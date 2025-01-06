import { supabase } from '../supabase';
import { getStoragePathFromUrl, isValidStoragePath } from '../utils/storage';
import type { Product, ProductFormData } from '../types/product';

export async function getProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function deleteProductImages(imagePath: string | null, thumbnailPath: string | null) {
  const pathsToDelete: string[] = [];

  if (imagePath) {
    const imageStoragePath = getStoragePathFromUrl(imagePath);
    if (isValidStoragePath(imageStoragePath)) {
      pathsToDelete.push(imageStoragePath);
    }
  }

  if (thumbnailPath) {
    const thumbnailStoragePath = getStoragePathFromUrl(thumbnailPath);
    if (isValidStoragePath(thumbnailStoragePath)) {
      pathsToDelete.push(thumbnailStoragePath);
    }
  }

  if (pathsToDelete.length > 0) {
    const { error } = await supabase.storage
      .from('products')
      .remove(pathsToDelete);

    if (error) {
      console.error('Error deleting images:', error);
      throw error;
    }
  }
}

export async function deleteProduct(productId: string, userId: string) {
  try {
    // First get the product to get image paths
    const { data: product } = await supabase
      .from('products')
      .select('image_path, thumbnail_path')
      .eq('id', productId)
      .eq('user_id', userId)
      .single();

    if (product) {
      // Delete images from storage
      await deleteProductImages(product.image_path, product.thumbnail_path);
    }

    // Delete the product record
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function updateProduct(
  productId: string,
  data: ProductFormData,
  userId: string
): Promise<void> {
  try {
    const updates: Partial<Product> = {
      name: data.name,
      marketplace: data.marketplace,
      marketplace_product_id: data.marketplace_product_id,
      giveaway: data.giveaway,
    };

    // Handle image update if provided
    if (data.image) {
      // Get the current product to clean up old images
      const { data: currentProduct } = await supabase
        .from('products')
        .select('image_path, thumbnail_path')
        .eq('id', productId)
        .single();

      // Delete old images if they exist
      if (currentProduct) {
        await deleteProductImages(currentProduct.image_path, currentProduct.thumbnail_path);
      }

      // Upload new images
      const optimizedImage = await optimizeImage(data.image);
      const thumbnail = await createThumbnail(optimizedImage);

      const baseFilename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const ext = data.image.name.split('.').pop() || 'jpg';
      const imagePath = `${userId}/${baseFilename}.${ext}`;
      const thumbnailPath = `${userId}/${baseFilename}_thumb.${ext}`;

      const [imageUpload, thumbnailUpload] = await Promise.all([
        supabase.storage.from('products').upload(imagePath, optimizedImage, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        }),
        supabase.storage.from('products').upload(thumbnailPath, thumbnail, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        }),
      ]);

      if (imageUpload.error) throw new Error(`Failed to upload image: ${imageUpload.error.message}`);
      if (thumbnailUpload.error) throw new Error(`Failed to upload thumbnail: ${thumbnailUpload.error.message}`);

      // Get public URLs
      const { data: { publicUrl: imageUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(imagePath);

      const { data: { publicUrl: thumbnailUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(thumbnailPath);

      updates.image_path = imageUrl;
      updates.thumbnail_path = thumbnailUrl;
    }

    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function createProduct(data: ProductFormData, userId: string) {
  try {
    if (!data.image) {
      throw new Error('Product image is required');
    }

    // Optimize main image
    const optimizedImage = await optimizeImage(data.image);

    // Create and upload thumbnail
    const thumbnail = await createThumbnail(optimizedImage);

    // Generate unique filenames
    const ext = data.image.name.split('.').pop() || 'jpg';
    const baseFilename = `${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const imagePath = `${userId}/${baseFilename}.${ext}`;
    const thumbnailPath = `${userId}/${baseFilename}_thumb.${ext}`;

    // Upload both images
    const [imageUpload, thumbnailUpload] = await Promise.all([
      supabase.storage.from('products').upload(imagePath, optimizedImage, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      }),
      supabase.storage.from('products').upload(thumbnailPath, thumbnail, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      }),
    ]);

    if (imageUpload.error)
      throw new Error(`Failed to upload image: ${imageUpload.error.message}`);
    if (thumbnailUpload.error)
      throw new Error(
        `Failed to upload thumbnail: ${thumbnailUpload.error.message}`
      );

    // Get public URLs
    const {
      data: { publicUrl: imageUrl },
    } = supabase.storage.from('products').getPublicUrl(imagePath);

    const {
      data: { publicUrl: thumbnailUrl },
    } = supabase.storage.from('products').getPublicUrl(thumbnailPath);

    // Create product record
    const { error: insertError } = await supabase.from('products').insert({
      name: data.name,
      marketplace: data.marketplace,
      marketplace_product_id: data.marketplace_product_id,
      giveaway: data.giveaway,
      image_path: imageUrl,
      thumbnail_path: thumbnailUrl,
      user_id: userId,
    });

    if (insertError) {
      // Clean up uploaded images if product creation fails
      await Promise.all([
        supabase.storage.from('products').remove([imagePath]),
        supabase.storage.from('products').remove([thumbnailPath]),
      ]);

      throw new Error(`Failed to create product: ${insertError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to create product');
  }
}

async function createThumbnail(file: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      const maxWidth = 200;
      const maxHeight = 200;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create thumbnail'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.7
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for thumbnail'));
    };

    img.src = objectUrl;
  });
}

async function optimizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.8
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
}