import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { pipelineDeals, pipelineStages } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Pipeline = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ company: "", contact: "", product: "Tour CRM", value: "", source: "Website", stage: "inquiry" });
  const totalValue = pipelineDeals.reduce((acc, d) => acc + d.value, 0);

  const handleAdd = () => {
    if (!form.company || !form.contact || !form.value) {
      toast({ title: "Missing fields", description: "Company, contact, and value are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Lead added", description: `${form.company} added to ${form.stage} stage.` });
    setAddOpen(false);
    setForm({ company: "", contact: "", product: "Tour CRM", value: "", source: "Website", stage: "inquiry" });
  };

  return (
    <>
      <AppHeader
        title="Sales Pipeline"
        subtitle={`${pipelineDeals.length} deals · ₹${(totalValue / 100000).toFixed(1)}L total value`}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-end">
          <Button size="sm" className="h-9" onClick={() => setAddOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Lead
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {pipelineStages.map((stage) => {
            const deals = pipelineDeals.filter((d) => d.stage === stage.id);
            const stageValue = deals.reduce((acc, d) => acc + d.value, 0);
            return (
              <div key={stage.id} className="space-y-3">
                <div className={cn("rounded-lg border px-3 py-2 flex items-center justify-between", stage.color)}>
                  <span className="text-sm font-semibold">{stage.label}</span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {deals.length} · ₹{(stageValue / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="space-y-2">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => navigate(`/pipeline/${deal.id}`)}
                      className="bg-card rounded-lg border border-border p-3 space-y-2 cursor-pointer hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-card-foreground leading-tight">{deal.company}</p>
                        <StatusBadge status={deal.score} />
                      </div>
                      <p className="text-xs text-muted-foreground">{deal.contact}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{deal.product}</span>
                        <span className="text-sm font-semibold text-card-foreground">₹{deal.value.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{deal.source}</span>
                        <span className={cn(deal.daysInStage > 7 && "text-destructive font-medium")}>
                          {deal.daysInStage}d in stage
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Company</Label><Input placeholder="Company name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
              <div className="space-y-2"><Label>Contact Person</Label><Input placeholder="Contact name" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={form.product} onValueChange={(v) => setForm({ ...form, product: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tour CRM">Tour CRM</SelectItem>
                  <SelectItem value="Travel CRM">Travel CRM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Deal Value (₹)</Label><Input type="number" placeholder="e.g. 120000" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Website", "Referral", "Cold Call", "Social", "Exhibition"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Initial Stage</Label>
              <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {pipelineStages.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Pipeline;
