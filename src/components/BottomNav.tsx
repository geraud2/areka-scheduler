import { NavLink } from "react-router-dom";
import { Home, CalendarPlus, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Accueil", icon: Home, end: true },
  { to: "/#reserver", label: "Réserver", icon: CalendarPlus, highlight: true },
  { to: "/admin/login", label: "Espace pro", icon: Briefcase },
];

const BottomNav = () => {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border shadow-card"
      aria-label="Navigation mobile"
    >
      <ul className="grid grid-cols-3">
        {items.map(({ to, label, icon: Icon, highlight, end }) => (
          <li key={label}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-base",
                  highlight
                    ? "text-primary"
                    : isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <span
                className={cn(
                  "flex items-center justify-center transition-base",
                  highlight && "h-10 w-10 rounded-full bg-primary text-primary-foreground -mt-4 shadow-elegant"
                )}
              >
                <Icon className={cn(highlight ? "h-5 w-5" : "h-5 w-5")} />
              </span>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
