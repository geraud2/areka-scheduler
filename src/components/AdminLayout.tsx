import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarDays, QrCode, LogOut, Menu, X, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authStore } from "@/store/authStore";
import logo from "@/assets/areka-logo.png";

const navItems = [
  { to: "/admin/demandes", label: "Demandes", icon: LayoutDashboard },
  { to: "/admin/planning", label: "Planning", icon: CalendarDays },
  { to: "/admin/qr", label: "QR Code", icon: QrCode },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    authStore.logout();
    navigate("/admin/login");
  };
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <img src={logo} alt="Areka" className="h-10 w-10 rounded-lg bg-white p-1" width={40} height={40} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold leading-tight truncate">Areka Services</p>
          <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sidebar-accent text-sidebar-accent-foreground">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-base",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" /> Déconnexion
        </Button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    authStore.logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/40 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-elegant animate-fade-in">
            <button
              className="absolute top-3 right-3 z-10 h-9 w-9 grid place-items-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:pl-64">
        <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card sticky top-0 z-20">
          <button
            className="md:hidden h-9 w-9 grid place-items-center rounded-md hover:bg-muted"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <UserCircle2 className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Ligner Julien</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={handleLogout}
              aria-label="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
