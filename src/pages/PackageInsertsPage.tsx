import { Routes, Route, Navigate } from 'react-router-dom';
import { PackageInsertList } from '@/components/package-inserts/PackageInsertList';
import { PackageInsertDesigner } from '@/components/package-inserts/PackageInsertDesigner';

export function PackageInsertsPage() {
  return (
    <Routes>
      <Route index element={<PackageInsertList />} />
      <Route path="new" element={<PackageInsertDesigner />} />
      <Route path="edit/:id" element={<PackageInsertDesigner isEditMode />} />
      <Route path="*" element={<Navigate to="/dashboard/package-inserts" replace />} />
    </Routes>
  );
}