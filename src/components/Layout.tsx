import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Header height used in CSS (keep in sync with index.css top & padding)
  const headerH = 64; // px — CHANGE HERE if you change header height

  return (
    <div className="app">
      {/* Mobile overlay drawer */}
      {open && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{ top: 0 }} // ✅ sidebar now starts from the very top
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Health Hub</h1>
            </div>

            {/* Mobile close button shown when drawer open */}
            <button
              className="md:hidden ml-2 p-1 rounded hover:bg-[hsl(var(--sidebar-accent))]"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block p-3 rounded-lg ${
                  isActive
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "hover:bg-[hsl(var(--sidebar-accent))]"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/add-patient"
              className={({ isActive }) =>
                `block p-3 rounded-lg ${
                  isActive
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "hover:bg-[hsl(var(--sidebar-accent))]"
                }`
              }
            >
              New Patient
            </NavLink>

            <NavLink
              to="/patients"
              className="block p-3 rounded-lg hover:bg-[hsl(var(--sidebar-accent))]"
            >
              Patient Management
            </NavLink>

            <NavLink
              to="/reports"
              className="block p-3 rounded-lg hover:bg-[hsl(var(--sidebar-accent))]"
            >
              Lab Reports
            </NavLink>

            <NavLink
              to="/audit"
              className="block p-3 rounded-lg hover:bg-[hsl(var(--sidebar-accent))]"
            >
              Audit
            </NavLink>

            <NavLink
              to="/docs"
              className="block p-3 rounded-lg hover:bg-[hsl(var(--sidebar-accent))]"
            >
              API Docs
            </NavLink>

            <NavLink
              to="/tasks"
              className="block p-3 rounded-lg hover:bg-[hsl(var(--sidebar-accent))]"
            >
              Tasks
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* ✅ Content wrapper (header + main beside sidebar) */}
      <div className="flex flex-col flex-1 ml-[var(--sidebar-w)]">
        {/* Header at the very top, aligned with sidebar */}
        <header
          className="h-16 flex items-center justify-between px-4 border-b bg-[hsl(var(--background))] shadow-sm"
          style={{
            height: `${headerH}px`,
          }}
        >
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded hover:bg-[hsl(var(--sidebar-accent))]"
              onClick={() => setOpen((s) => !s)}
              aria-label="Open sidebar"
            >
              ☰
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded hover:bg-[hsl(var(--sidebar-accent))]">
              🔔
            </button>
            <button className="p-2 rounded hover:bg-[hsl(var(--sidebar-accent))]">
              ⚙️
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center">
                SJ
              </div>
              <div className="text-sm">
                <div className="font-medium">Dr. Sarah Johnson</div>
                <div className="text-xs text-muted-foreground">
                  Chief Medical Officer
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="main">
          <div className="max-w-7xl mx-auto">
            {/* React Router outlet will render Dashboard / AddPatient / etc */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
