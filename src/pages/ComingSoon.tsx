import AppHeader from "@/components/layout/AppHeader";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/invoices": "Invoices",
  "/tickets": "Support Tickets",
  "/renewals": "Renewals",
  "/reports": "Reports",
};

const ComingSoon = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Coming Soon";

  return (
    <>
      <AppHeader title={title} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">This module is coming soon.</p>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
