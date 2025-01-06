import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ReviewsPage } from './ReviewsPage';
import { SurveysPage } from './SurveysPage';
import { ProductsPage } from './ProductsPage';
import { AddProductPage } from './AddProductPage';
import { EditProductPage } from './EditProductPage';
import { CreateSurveyPage } from './CreateSurveyPage';
import { EditSurveyPage } from './EditSurveyPage';
import { PackageInsertsPage } from './PackageInsertsPage';
import { OrdersPage } from './OrdersPage';
import { UploadOrdersPage } from './UploadOrdersPage';

export function DashboardPage() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/surveys" element={<SurveysPage />} />
        <Route path="/surveys/new" element={<CreateSurveyPage />} />
        <Route path="/surveys/edit/:id" element={<EditSurveyPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<AddProductPage />} />
        <Route path="/products/edit/:id" element={<EditProductPage />} />
        <Route path="/package-inserts/*" element={<PackageInsertsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/upload-orders" element={<UploadOrdersPage />} />
      </Routes>
    </DashboardLayout>
  );
}