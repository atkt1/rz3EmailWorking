import { supabase } from '../supabase';
import { validateCsvContent } from '../utils/csvValidation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BATCH_SIZE = 1000;

export async function processOrdersFile(
  file: File, 
  marketplace: string,
  userId: string
): Promise<void> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  if (!userId) throw new Error('User not authenticated');

  try {
    const content = await file.text();
    const orderIds = await validateCsvContent(content);

    // Process in batches
    for (let i = 0; i < orderIds.length; i += BATCH_SIZE) {
      const batch = orderIds.slice(i, i + BATCH_SIZE);
      
      // First, get existing orders for deduplication
      const { data: existingOrders } = await supabase
        .from('orders')
        .select('order_id')
        .eq('user_id', userId)
        .in('order_id', batch);

      // Filter out existing order IDs
      const existingOrderIds = new Set(existingOrders?.map(o => o.order_id));
      const newOrders = batch
        .filter(orderId => !existingOrderIds.has(orderId))
        .map(orderId => ({
          order_id: orderId,
          marketplace,
          user_id: userId,
          created_at: new Date().toISOString()
        }));

      if (newOrders.length > 0) {
        const { error } = await supabase
          .from('orders')
          .insert(newOrders);

        if (error) {
          console.error('Database error:', error);
          throw new Error('Failed to upload orders');
        }
      }
    }
  } catch (error) {
    console.error('Error processing orders file:', error);
    throw error instanceof Error ? error : new Error('Failed to process orders file');
  }
}
