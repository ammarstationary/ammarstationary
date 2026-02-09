import { useState, ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminBottomNav } from './AdminBottomNav';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 glass-card border-b border-border/30 p-3 sm:p-4 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 hover:bg-muted/50 rounded-lg transition-colors touch-manipulation"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-lg font-display font-bold text-foreground truncate">{title}</h1>
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:block glass-card border-b border-border/30 p-6">
          <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
        </header>

        {/* Content - add bottom padding on mobile for bottom nav */}
        <div className="p-3 sm:p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <AdminBottomNav />
    </div>
  );
}
