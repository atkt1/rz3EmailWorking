import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Play, Pause, Plus, ExternalLink, QrCode, Copy, CheckCircle } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ActionIcon } from './icons/ActionIcon';
import type { Survey } from '@/lib/types/survey';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { formatDate } from '@/lib/utils/date';

interface SurveyListProps {
  surveys: Survey[];
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, currentStatus: 'ACTIVE' | 'PAUSED') => Promise<void>;
  isLoading?: boolean;
}

export function SurveyList({ 
  surveys, 
  onDelete, 
  onToggleStatus,
  isLoading 
}: SurveyListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const testOrderId = '222-4444444-8888888';

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(testOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEditClick = (surveyId: string) => {
    navigate(`/dashboard/surveys/edit/${surveyId}`);
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadQr = async (qrCode: string) => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'survey-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={cn(
          "text-2xl font-bold",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Surveys
        </h1>
        <Button
          onClick={() => navigate('/dashboard/surveys/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Survey
        </Button>
      </div>

{/* Test Order ID Section */}
<div className={cn(
  "flex items-center justify-center gap-4 p-1 rounded-lg", // Added justify-center
  isDark ? "bg-gray-600/50" : "bg-blue-50"
)}>
  <div className="flex items-center gap-2"> {/* Added wrapper div for text and button */}
    <span className={cn(
      "text-sm",
      isDark ? "text-gray-300" : "text-gray-600"
    )}>
      To test surveys, use order number{' '}
      <span className={cn(
        "font-mono px-2 py-1 rounded",
        isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700"
      )}>
        {testOrderId}
      </span>
      {' '}for any marketplace.
    </span>
    <Button
      onClick={handleCopyOrderId}
      variant="outline"
      className={cn(
        "px-3 py-1 h-8",
        isDark ? "border-gray-700 hover:bg-gray-700" : "border-blue-200 hover:bg-blue-100"
      )}
    >
      {copied ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  </div>
</div>




      
      <div className={cn(
        "rounded-xl border overflow-hidden",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                "border-b text-sm",
                isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
              )}>
                <th className="px-6 py-4 text-left font-medium">Survey Name</th>
                <th className="px-6 py-4 text-left font-medium">Created Date</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-center font-medium">URL</th>
                <th className="px-6 py-4 text-center font-medium">QR Code</th>
                <th className="px-6 py-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {surveys.map((survey) => (
                <tr 
                  key={survey.id}
                  className={cn(
                    isDark ? "divide-gray-700" : "divide-gray-200"
                  )}
                >
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={survey.logo_path}
                          alt={survey.survey_name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className={cn(
                          "font-medium",
                          isDark ? "text-white" : "text-gray-900"
                        )}>
                          {survey.survey_name}
                        </div>
                        <div className={cn(
                          "text-sm",
                          isDark ? "text-gray-400" : "text-gray-500"
                        )}>
                          {survey.survey_style}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={cn(
                    "px-6 py-2",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    {formatDate(survey.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      survey.survey_status === 'ACTIVE'
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    )}>
                      {survey.survey_status}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-center">
                    <ActionIcon
                      icon={ExternalLink}
                      onClick={() => handleOpenUrl(survey.url)}
                      label="Open Survey"
                    />
                  </td>
                  <td className="px-6 py-2 text-center">
                    <ActionIcon
                      icon={QrCode}
                      onClick={() => handleDownloadQr(survey.qr_code)}
                      label="Download QR Code"
                    />
                  </td>
                  <td className="px-6 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <ActionIcon
                        icon={Pencil}
                        onClick={() => handleEditClick(survey.id)}
                        label="Edit survey"
                        variant="blue"
                      />
                      <ActionIcon
                        icon={survey.survey_status === 'ACTIVE' ? Pause : Play}
                        onClick={() => onToggleStatus(survey.id, survey.survey_status)}
                        label={survey.survey_status === 'ACTIVE' ? "Pause survey" : "Activate survey"}
                        variant="yellow"
                      />
                      <ActionIcon
                        icon={Trash2}
                        onClick={() => setDeleteId(survey.id)}
                        label="Delete survey"
                        variant="red"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await onDelete(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}