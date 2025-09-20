import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';
import { Button } from './ui/button';

export const TopBar = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search patients, reports..."
            className="pl-10 pr-4 py-2 w-80 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full text-xs"></span>
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-sm">
            <div className="font-medium">Dr. Sarah Johnson</div>
            <div className="text-muted-foreground text-xs">Chief Medical Officer</div>
          </div>
        </div>
      </div>
    </header>
  );
};