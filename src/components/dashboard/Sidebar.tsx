import { useTheme } from '@/lib/context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Star, Package, FileSpreadsheet,
  Gift, ClipboardList, Upload, CheckSquare, QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, to }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const isDark = theme === 'dark';
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
        'hover:scale-[1.02]',
        isActive 
          ? (isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600') 
          : (isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100')
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const NavGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="space-y-1.5">
      {children}
    </div>
  );
};

const Divider = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="px-4 py-4">
      <div className={cn(
        'h-px w-full',
        isDark ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' 
        : 'bg-gradient-to-r from-transparent via-gray-200 to-transparent'
      )} />
    </div>
  );
};

export function Sidebar() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      'w-64 border-r fixed left-0 top-16 bottom-0 transition-colors duration-300',
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-white/80 backdrop-blur-md border-gray-200'
    )}>
      <div className="space-y-6 pt-6 px-4">
        {/* Main Group */}
        <NavGroup>
          <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <NavItem icon={Star} label="Reviews" to="/dashboard/reviews" />
        </NavGroup>

        <Divider />

        {/* Management Group */}
        <NavGroup>
          <NavItem icon={Package} label="Products" to="/dashboard/products" />
          <NavItem icon={FileSpreadsheet} label="Surveys" to="/dashboard/surveys" />
          <NavItem icon={QrCode} label="Package Inserts" to="/dashboard/package-inserts" />
          <NavItem icon={Gift} label="Giveaways" to="/dashboard/giveaways" />
        </NavGroup>

        <Divider />

        {/* Orders Group */}
        <NavGroup>
          <NavItem icon={ClipboardList} label="Orders" to="/dashboard/orders" />
          <NavItem icon={Upload} label="Upload Orders" to="/dashboard/upload-orders" />
        </NavGroup>
      </div>
    </div>
  );
}