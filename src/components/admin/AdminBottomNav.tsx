import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ClipboardList, Wrench, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Tag, Phone, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const primaryNav = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/cards', icon: CreditCard, label: 'Products' },
  { path: '/admin/bookings', icon: ClipboardList, label: 'Bookings' },
  { path: '/admin/services', icon: Wrench, label: 'Services' },
];

const moreNav = [
  { path: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { path: '/admin/promo-codes', icon: Tag, label: 'Promo Codes' },
  { path: '/admin/contact', icon: Phone, label: 'Contact' },
  { path: '/', icon: Home, label: 'Back to Site' },
];

export function AdminBottomNav() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [showMore, setShowMore] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isMoreActive = moreNav.some(item => isActive(item.path));

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-3 right-3 z-50 lg:hidden"
            >
              <div className="glass-card border border-border/30 rounded-2xl p-3 space-y-1">
                {moreNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors touch-manipulation ${
                      isActive(item.path)
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={async () => {
                    setShowMore(false);
                    await signOut();
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-destructive hover:bg-destructive/10 transition-colors touch-manipulation"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
        <div className="glass border-t border-border/30 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around h-16">
            {primaryNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl min-w-[4rem] touch-manipulation transition-colors ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl min-w-[4rem] touch-manipulation transition-colors ${
                isMoreActive || showMore
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">More</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
