import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-zinc-500">
      <NavLink
        to="/admin/dashboard"
        className="flex items-center hover:text-zinc-700 transition-colors"
      >
        <Home className="h-4 w-4" />
      </NavLink>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
          {item.href ? (
            <NavLink
              to={item.href}
              className="hover:text-zinc-700 transition-colors"
            >
              {item.title}
            </NavLink>
          ) : (
            <span className="text-zinc-900 font-medium">{item.title}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

// Hook to generate breadcrumb items based on current path
export const useBreadcrumb = () => {
  const location = useLocation();

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    try {
      // Safe path parsing with fallbacks
      const pathname = location?.pathname || '/admin/dashboard';
      const pathSegments = pathname.split('/').filter(Boolean);

      // Remove 'admin' from the beginning
      const adminPath = pathSegments.slice(1);

      const items: BreadcrumbItem[] = [];

      adminPath.forEach((segment, index) => {
        if (!segment) return;

        const href = `/admin/${adminPath.slice(0, index + 1).join('/')}`;
        const title = segment.charAt(0).toUpperCase() + segment.slice(1);

        // Convert some common paths to readable names
        const titleMap: Record<string, string> = {
          'dashboard': 'Dashboard',
          'orders': 'Orders',
          'dishes': 'Dishes',
          'setmeals': 'Setmeals',
          'categories': 'Categories',
          'employees': 'Employees',
          'settings': 'Settings',
          'users': 'Users',
          'add': 'Add',
          'edit': 'Edit',
          'new': 'New'
        };

        items.push({
          title: titleMap[segment] || title,
          href: index < adminPath.length - 1 ? href : undefined
        });
      });

      return items;
    } catch (error) {
      console.error('Error generating breadcrumb items:', error);
      return [];
    }
  };

  return getBreadcrumbItems();
};
