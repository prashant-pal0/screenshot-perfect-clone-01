import { useParams, Link } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { pipelineDeals } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Building2, User, Package, IndianRupee, Clock, Globe } from "lucide-react";

const LeadDetail = () => {
  const { id } = useParams();
  const deal = pipelineDeals.find((d) => d.id === id);

  if (!deal) {
    return (
      <>
        <AppHeader title="Lead Not Found" />
        <div className="flex-1 p-6"><Link to="/pipeline"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link></div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={deal.company} subtitle={`${deal.id} · ${deal.contact}`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/pipeline"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Pipeline</Button></Link>
          <Button size="sm"><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: Building2, label: "Company", value: deal.company },
            { icon: User, label: "Contact", value: deal.contact },
            { icon: Package, label: "Product", value: deal.product },
            { icon: IndianRupee, label: "Value", value: `₹${deal.value.toLocaleString("en-IN")}` },
            { icon: Globe, label: "Source", value: deal.source },
            { icon: Clock, label: "Days in Stage", value: `${deal.daysInStage}d` },
          ].map((item) => (
            <div key={item.label} className="bg-card rounded-lg border border-border p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><item.icon className="w-3 h-3" />{item.label}</div>
              <p className="text-sm font-semibold text-card-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Lead Scoring</h3>
            <div className="flex items-center gap-4 mb-4">
              <StatusBadge status={deal.score} />
              <span className="text-sm text-muted-foreground capitalize">Stage: {deal.stage}</span>
            </div>
            <div className="space-y-3">
              <div><p className="text-xs text-muted-foreground mb-1">Conversion Probability</p>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: deal.score === "hot" ? "80%" : deal.score === "warm" ? "50%" : "20%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{deal.score === "hot" ? "80%" : deal.score === "warm" ? "50%" : "20%"}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Stage Progression</h3>
            <div className="flex gap-2">
              {["inquiry", "demo", "proposal", "negotiation"].map((stage) => (
                <div key={stage} className={`flex-1 h-2 rounded-full ${
                  ["inquiry", "demo", "proposal", "negotiation"].indexOf(deal.stage) >= ["inquiry", "demo", "proposal", "negotiation"].indexOf(stage) ? "bg-primary" : "bg-secondary"
                }`} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Inquiry</span><span>Demo</span><span>Proposal</span><span>Negotiation</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="sm">Move to Next Stage</Button>
          <Button variant="outline" size="sm">Schedule Follow-up</Button>
          <Button variant="outline" size="sm">Convert to Client</Button>
        </div>
      </div>
    </>
  );
};

export default LeadDetail;
