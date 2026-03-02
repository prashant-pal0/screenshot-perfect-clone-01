import { useParams, Link } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { subscriptions, companies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Calendar, Users, CreditCard, Building2 } from "lucide-react";

const SubscriptionDetail = () => {
  const { id } = useParams();
  const sub = subscriptions.find((s) => s.id === id);

  if (!sub) {
    return (
      <>
        <AppHeader title="Subscription Not Found" />
        <div className="flex-1 p-6"><Link to="/subscriptions"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link></div>
      </>
    );
  }

  const company = companies.find((c) => c.name === sub.company);

  return (
    <>
      <AppHeader title={sub.id} subtitle={sub.company} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/subscriptions"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Subscriptions</Button></Link>
          <Button size="sm"><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium"><Building2 className="w-3.5 h-3.5" /> Company</div>
            <p className="text-lg font-semibold text-card-foreground">{sub.company}</p>
            {company && <StatusBadge status={company.status} />}
          </div>
          <div className="bg-card rounded-lg border border-border p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium"><CreditCard className="w-3.5 h-3.5" /> Plan & Product</div>
            <p className="text-lg font-semibold text-card-foreground">{sub.plan}</p>
            <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{sub.product}</span>
          </div>
          <div className="bg-card rounded-lg border border-border p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium"><Users className="w-3.5 h-3.5" /> Seats</div>
            <p className="text-lg font-semibold text-card-foreground">{sub.seats}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium"><Calendar className="w-3.5 h-3.5" /> Duration</div>
            <p className="text-sm text-card-foreground">{sub.startDate} → {sub.endDate}</p>
            <StatusBadge status={sub.status} />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Subscription Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 text-sm">
            <div><p className="text-muted-foreground text-xs mb-1">Total Amount</p><p className="font-semibold text-lg">₹{sub.amount.toLocaleString("en-IN")}</p></div>
            <div><p className="text-muted-foreground text-xs mb-1">Monthly Value</p><p className="font-semibold">₹{Math.round(sub.amount / (sub.plan === "1 Year" ? 12 : sub.plan === "2 Year" ? 24 : 36)).toLocaleString("en-IN")}/mo</p></div>
            <div><p className="text-muted-foreground text-xs mb-1">Per Seat/Month</p><p className="font-semibold">₹{Math.round(sub.amount / (sub.plan === "1 Year" ? 12 : sub.plan === "2 Year" ? 24 : 36) / sub.seats).toLocaleString("en-IN")}</p></div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm">Renew Subscription</Button>
          <Button variant="outline" size="sm">Upgrade Plan</Button>
          <Button variant="outline" size="sm">Add Seats</Button>
        </div>
      </div>
    </>
  );
};

export default SubscriptionDetail;
