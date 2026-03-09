import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { pipelineDeals, pipelineStages } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Building2, User, Package, IndianRupee, Clock, Globe, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const LeadDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const deal = pipelineDeals.find((d) => d.id === id);
  const [currentStage, setCurrentStage] = useState(deal?.stage ?? "inquiry");
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");

  if (!deal) {
    return (
      <>
        <AppHeader title="Lead Not Found" />
        <div className="flex-1 p-6"><Link to="/pipeline"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link></div>
      </>
    );
  }

  const stageOrder = ["inquiry", "demo", "proposal", "negotiation"];
  const currentStageIndex = stageOrder.indexOf(currentStage);

  const advanceStage = () => {
    if (currentStageIndex < stageOrder.length - 1) {
      const next = stageOrder[currentStageIndex + 1];
      setCurrentStage(next);
      toast({ title: "Stage advanced", description: `${deal.company} moved to ${next}.` });
    }
  };

  const handleFollowUp = () => {
    if (!followUpDate) {
      toast({ title: "Select a date", variant: "destructive" });
      return;
    }
    toast({ title: "Follow-up scheduled", description: `Follow-up with ${deal.company} on ${followUpDate}.` });
    setFollowUpOpen(false);
  };

  const handleConvert = () => {
    toast({ title: "Lead converted!", description: `${deal.company} has been converted to a client.` });
    setConvertOpen(false);
  };

  return (
    <>
      <AppHeader title={deal.company} subtitle={`${deal.id} · ${deal.contact}`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/pipeline"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Pipeline</Button></Link>
          <Button size="sm" onClick={() => setEditOpen(true)}><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: Building2,    label: "Company",       value: deal.company },
            { icon: User,         label: "Contact",       value: deal.contact },
            { icon: Package,      label: "Product",       value: deal.product },
            { icon: IndianRupee,  label: "Value",         value: `₹${deal.value.toLocaleString("en-IN")}` },
            { icon: Globe,        label: "Source",        value: deal.source },
            { icon: Clock,        label: "Days in Stage", value: `${deal.daysInStage}d` },
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
              <span className="text-sm text-muted-foreground capitalize">Stage: {currentStage}</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Conversion Probability</p>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: deal.score === "hot" ? "80%" : deal.score === "warm" ? "50%" : "20%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{deal.score === "hot" ? "80%" : deal.score === "warm" ? "50%" : "20%"}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Stage Progression</h3>
            <div className="flex gap-2">
              {stageOrder.map((stage, i) => (
                <div key={stage} className={`flex-1 h-2 rounded-full transition-colors ${i <= currentStageIndex ? "bg-primary" : "bg-secondary"}`} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              {pipelineStages.map((s) => <span key={s.id}>{s.label}</span>)}
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {currentStageIndex < stageOrder.length - 1 && (
            <Button size="sm" onClick={advanceStage}>Move to Next Stage</Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setFollowUpOpen(true)}>
            <Calendar className="w-3.5 h-3.5 mr-1.5" /> Schedule Follow-up
          </Button>
          <Button variant="outline" size="sm" onClick={() => setConvertOpen(true)}>Convert to Client</Button>
        </div>
      </div>

      {/* Follow-up Dialog */}
      <Dialog open={followUpOpen} onOpenChange={setFollowUpOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Schedule Follow-up</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2"><Label>Follow-up Date</Label><Input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUpOpen(false)}>Cancel</Button>
            <Button onClick={handleFollowUp}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Dialog */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Convert to Client</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Convert <strong>{deal.company}</strong> from a pipeline lead to an active client? This will create a new client record.
          </p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setConvertOpen(false)}>Cancel</Button>
            <Button onClick={handleConvert}>Convert to Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Lead</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2"><Label>Company</Label><Input defaultValue={deal.company} /></div>
            <div className="space-y-2"><Label>Contact</Label><Input defaultValue={deal.contact} /></div>
            <div className="space-y-2"><Label>Deal Value (₹)</Label><Input type="number" defaultValue={deal.value} /></div>
            <div className="space-y-2">
              <Label>Score</Label>
              <Select defaultValue={deal.score}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast({ title: "Lead updated" }); setEditOpen(false); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadDetail;
