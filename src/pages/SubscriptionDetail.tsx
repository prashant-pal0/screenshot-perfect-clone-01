import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { subscriptions, companies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Edit, Calendar, Users, CreditCard, Building2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SubscriptionDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const sub = subscriptions.find((s) => s.id === id);
  const [renewOpen, setRenewOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [addSeatsOpen, setAddSeatsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [seatsToAdd, setSeatsToAdd] = useState("5");
  const [upgradePlan, setUpgradePlan] = useState("2 Year");

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
          <Button size="sm" onClick={() => setEditOpen(true)}><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
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

        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setRenewOpen(true)}>Renew Subscription</Button>
          <Button variant="outline" size="sm" onClick={() => setUpgradeOpen(true)}>Upgrade Plan</Button>
          <Button variant="outline" size="sm" onClick={() => setAddSeatsOpen(true)}>Add Seats</Button>
        </div>
      </div>

      {/* Renew Dialog */}
      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Renew Subscription</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Renew <strong>{sub.company}</strong>'s {sub.plan} subscription for <strong>₹{sub.amount.toLocaleString("en-IN")}</strong>? A new invoice will be generated.</p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setRenewOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast({ title: "Subscription renewed", description: `${sub.company} renewed. Invoice being generated.` }); setRenewOpen(false); }}>Confirm Renewal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Plan Dialog */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Upgrade Plan</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">Current plan: <strong>{sub.plan}</strong></p>
            <div className="space-y-2">
              <Label>New Plan</Label>
              <Select value={upgradePlan} onValueChange={setUpgradePlan}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                  <SelectItem value="2 Year">2 Year</SelectItem>
                  <SelectItem value="3 Year">3 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast({ title: "Plan upgraded", description: `Upgraded to ${upgradePlan}.` }); setUpgradeOpen(false); }}>Upgrade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Seats Dialog */}
      <Dialog open={addSeatsOpen} onOpenChange={setAddSeatsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Add Seats</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">Current seats: <strong>{sub.seats}</strong></p>
            <div className="space-y-2"><Label>Seats to Add</Label><Input type="number" min={1} value={seatsToAdd} onChange={(e) => setSeatsToAdd(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSeatsOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast({ title: "Seats added", description: `${seatsToAdd} seats added to ${sub.company}.` }); setAddSeatsOpen(false); }}>Add Seats</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Subscription</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2"><Label>Seats</Label><Input type="number" min={1} defaultValue={sub.seats} /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue={sub.status}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast({ title: "Subscription updated" }); setEditOpen(false); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionDetail;
