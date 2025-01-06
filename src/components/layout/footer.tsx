import { Star } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Star className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">ReviewZone</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Twitter</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">GitHub</a>
          </div>
          <div className="text-gray-600 text-sm mt-4 md:mt-0">
            © 2024 ReviewZone.ai All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}