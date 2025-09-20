import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  FileText, 
  Shield, 
  BookOpen,
  ClipboardList
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/add-patient', label: 'New Patient', icon: UserPlus },
  { to: '/patients', label: 'Patient Management', icon: Users },
  { to: '/reports', label: 'Lab Reports', icon: FileText },
  { to: '/audit', label: 'Audit', icon: Shield },
  { to: '/docs', label: 'API Docs', icon: BookOpen },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList },
];

export const Sidebar = () => {
  return (
    <div className="w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">Health Hub</h1>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};