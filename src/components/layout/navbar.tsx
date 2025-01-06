import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blur border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">ReviewZone</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#pricing" className="nav-link">Pricing</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="font-medium">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="font-medium">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}