import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@/lib/context/ThemeContext';
import { useAuth } from '@/lib/context/AuthContext';
import { cn } from '@/lib/utils';
import { DesignControls } from './DesignControls';
import { DesignPreview } from './DesignPreview';
import { Button } from '@/components/ui/button';
import { savePackageInsert, downloadPackageInsert } from '@/lib/services/packageInsertService';
import { DEFAULT_INSERT } from '@/lib/types/packageInsert';
import type { PackageInsert } from '@/lib/types/packageInsert';
import { useToast } from '@/lib/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { usePackageInsert } from '@/lib/hooks/usePackageInsert';

interface PackageInsertDesignerProps {
  isEditMode?: boolean;
}

export function PackageInsertDesigner({ isEditMode }: PackageInsertDesignerProps) {
  const { id } = useParams();
  const { data: existingInsert, isLoading } = usePackageInsert(id);
  const [design, setDesign] = useState<PackageInsert>(DEFAULT_INSERT);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedLogoUrl, setSelectedLogoUrl] = useState<string>();
  const [isNewLogoSelected, setIsNewLogoSelected] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState<string>();
  const [logoPath, setLogoPath] = useState<string>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const toast = useToast();

  // Load existing insert data if editing
  useEffect(() => {
  if (existingInsert) {
    setDesign(existingInsert);
    setSurveyUrl(existingInsert.surveyUrl);
    setLogoPath(existingInsert.surveyLogoPath);
  }
}, [existingInsert]);

  useEffect(() => {
  if (isEditMode && design.include_logo && design.logo_path) {
    console.log('Starting logo toggle sequence'); // Debug log
    
    // First toggle - uncheck
    setDesign(prev => {
      console.log('Unchecking logo'); // Debug log
      return {
        ...prev,
        include_logo: false
      };
    });

    // Second toggle - recheck after delay
    const reCheckTimer = setTimeout(() => {
      console.log('Rechecking logo'); // Debug log
      setDesign(prev => ({
        ...prev,
        include_logo: true
      }));
    }, 1000); // Reduced to 1 second

    return () => {
      clearTimeout(reCheckTimer);
    };
  }
}, [isEditMode, design.logo_path]); // Added design.logo_path as dependency


  // Fetch survey details when survey is selected
  useEffect(() => {
    async function fetchSurveyDetails() {
      if (!design.survey_id) {
        setSurveyUrl(undefined);
        setLogoPath(undefined);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('surveys')
          .select('url, logo_path')
          .eq('id', design.survey_id)
          .single();

        if (error) throw error;
        if (data) {
          setSurveyUrl(data.url);
          setLogoPath(data.logo_path);
          // Only reset include_logo if not in edit mode or if survey changes
          if (!isEditMode || design.survey_id !== existingInsert?.survey_id) {
            setDesign(prev => ({
              ...prev,
              include_logo: false
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching survey details:', err);
      }
    }

    fetchSurveyDetails();
  }, [design.survey_id, isEditMode, existingInsert?.survey_id]);

  const handleDesignChange = (updatedDesign: PackageInsert) => {
  // Combine both state updates into one
  setDesign({
    ...updatedDesign,
    logo_path: updatedDesign.include_logo ? logoPath : undefined
  });
};

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      await savePackageInsert(design, user.id, isEditMode ? id : undefined);
      toast.success('Package insert saved successfully');
      navigate('/dashboard/package-inserts');
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('Failed to save package insert');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const assets = await downloadPackageInsert(design);

      // Download print image
      const printLink = document.createElement('a');
      printLink.href = assets.printImage;
      printLink.download = `${design.name}-print.png`;
      printLink.click();

      toast.success('Assets downloaded successfully');
    } catch (error) {
      console.error('Error downloading assets:', error);
      toast.error('Failed to download assets');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={cn(
            "text-2xl font-bold mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}>
            {isEditMode ? 'Edit Package Insert' : 'Design your Package Insert'}
          </h1>
          <p className={cn(
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            Simply design your package insert and print it through GetReviews suggested service.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <DesignControls
          design={design}
          onChange={handleDesignChange}
        />
        <DesignPreview 
          design={design}
          surveyUrl={surveyUrl}
        />
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/dashboard/package-inserts')}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save for now'}
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isDownloading ? 'Downloading...' : 'Download Assets'}
        </Button>
      </div>
    </div>
  );
}