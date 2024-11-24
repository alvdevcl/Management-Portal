import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Settings,
  Menu,
  ChevronLeft,
  Library,
  Layers,
  BookOpen
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/',
  },
  {
    label: 'Software Catalogs',
    icon: <Library className="h-5 w-5" />,
    href: '/catalogs',
  },
  {
    label: 'Resources',
    icon: <Boxes className="h-5 w-5" />,
    href: '/resources',
  },
  {
    label: 'Environments',
    icon: <Layers className="h-5 w-5" />,
    href: '/environments',
  },
  {
    label: 'Documentation',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/docs',
  },
  {
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings',
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20' : 'w-64'}
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            {!collapsed && (
              <span className="font-bold text-xl gradient-text">K8s Manager</span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 lg:block hidden"
            >
              <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 group transition-colors
                      ${location.pathname === item.href ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                  >
                    <span className="flex items-center justify-center">
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="ml-3 text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#F15A5A] to-[#702459]" />
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@k8s.local</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}