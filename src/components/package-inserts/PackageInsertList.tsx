import { useState, useEffect } from 'react';
import { QrCode, Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import { EmptyState } from '@/components/empty-states/EmptyState';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils/date';
import { Pencil, Trash2 } from 'lucide-react';
import { ActionIcon } from '@/components/surveys/icons/ActionIcon';



interface PackageInsert {
  id: string;
  name: string;
  style_size: string;
  created_at: string;
}


export function PackageInsertList() {
  const [inserts, setInserts] = useState<PackageInsert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleDelete = async (id: string) => {
  try {
    const { error } = await supabase
      .from('package_inserts')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id);

    if (error) throw error;

    // Remove the deleted insert from the state to update UI
    setInserts(prevInserts => prevInserts.filter(insert => insert.id !== id));
  } catch (err) {
    console.error('Error deleting package insert:', err);
    // You can add toast notification here if you want
  }
};

  useEffect(() => {
    async function loadInserts() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('package_inserts')
          .select('id, name, style_size, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInserts(data || []);
      } catch (err) {
        console.error('Error loading package inserts:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInserts();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (inserts.length === 0) {
    return (
      <EmptyState
        icon={QrCode}
        title="No Package Inserts"
        description="Create your first package insert to boost review collection."
        actionLabel="Create Insert"
        onAction={() => navigate('new')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={cn(
            "text-2xl font-bold mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Package Inserts
          </h1>
          <p className={cn(
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            Manage your package insert designs and print them through our suggested service.
          </p>
        </div>
        <Button
          onClick={() => navigate('new')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Insert
        </Button>
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
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-left font-medium">Style & Size</th>
                <th className="px-6 py-4 text-left font-medium">Created</th>
                <th className="px-6 py-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className={cn(
              "divide-y",
              isDark ? "divide-gray-700" : "divide-gray-200"
            )}>
              {inserts.map((insert) => (
                <tr 
                  key={insert.id}
                  className={cn(
                    "transition-colors duration-150",
                    isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                  )}
                >
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      )}>
                        <FileText className={cn(
                          "w-5 h-5",
                          isDark ? "text-gray-400" : "text-gray-500"
                        )} />
                      </div>
                      <span className={cn(
                        "font-medium",
                        isDark ? "text-gray-200" : "text-gray-900"
                      )}>
                        {insert.name}
                      </span>
                    </div>
                  </td>
                  <td className={cn(
                    "px-6 py-2",
                    isDark ? "text-gray-300" : "text-gray-600"
                  )}>
                    {insert.style_size}
                  </td>
                  <td className={cn(
                    "px-6 py-2",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    {formatDate(insert.created_at)}
                  </td>
                  <td className="px-6 py-2">
  <div className="flex items-center justify-center gap-2">
    <ActionIcon
      icon={Pencil}
      onClick={() => navigate(`edit/${insert.id}`)}
      label="Edit package insert"
      variant="blue"
    />
    <ActionIcon
      icon={Trash2}
      onClick={() => handleDelete(insert.id)}
      label="Delete package insert"
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
    </div>
  );
}