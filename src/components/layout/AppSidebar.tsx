import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Target,
  FileText,
  LifeBuoy,
  RefreshCw,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Building2, label: "Clients" },
  { to: "/subscriptions", icon: CreditCard, label: "Subscriptions" },
  { to: "/pipeline", icon: Target, label: "Sales Pipeline" },
  { to: "/invoices", icon: FileText, label: "Invoices" },
  { to: "/tickets", icon: LifeBuoy, label: "Support" },
  { to: "/renewals", icon: RefreshCw, label: "Renewals" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
];

const bottomNavItems = [
  { to: "/users", icon: Users, label: "Users & Roles" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const navClass = (to: string) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive(to)
        ? "bg-sidebar-accent text-sidebar-primary"
        : "text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
    );

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sidebar-accent-foreground text-sm tracking-tight">
            Master CRM
          </span>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={navClass(item.to)}>
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav: Users + Settings */}
      <div className="px-2 py-2 border-t border-sidebar-border space-y-0.5">
        {bottomNavItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={navClass(item.to)}>
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Collapse toggle */}
      <div className="px-2 py-3 border-t border-sidebar-border shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
