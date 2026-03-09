import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { renewals } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Renewals = () => {
  const { toast } = useToast();
  const [emailTarget, setEmailTarget] = useState<typeof renewals[0] | null>(null);
  const [callTarget, setCallTarget] = useState<typeof renewals[0] | null>(null);

  const urgentCount = renewals.filter((r) => r.status === "urgent" || r.status === "lapsed").length;
  const totalAtRisk = renewals
    .filter((r) => r.status === "urgent" || r.status === "lapsed")
    .reduce((a, b) => a + b.amount, 0);

  const handleEmail = (r: typeof renewals[0]) => { setEmailTarget(r); };
  const handleCall  = (r: typeof renewals[0]) => { setCallTarget(r); };

  const confirmEmail = () => {
    toast({ title: "Renewal email sent", description: `Email sent to ${emailTarget?.company}.` });
    setEmailTarget(null);
  };

  return (
    <>
      <AppHeader
        title="Renewals"
        subtitle={`${urgentCount} need attention · ₹${(totalAtRisk / 100000).toFixed(1)}L at risk`}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Lapsed",          count: renewals.filter((r) => r.status === "lapsed").length,    color: "text-destructive" },
            { label: "Urgent (≤30d)",   count: renewals.filter((r) => r.status === "urgent").length,    color: "text-warning" },
            { label: "Upcoming",        count: renewals.filter((r) => r.status === "upcoming").length,  color: "text-info" },
            { label: "Scheduled",       count: renewals.filter((r) => r.status === "scheduled").length, color: "text-success" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Plan</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Seats</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Expiry</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Days Left</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Amount</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renewals.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm font-medium">{r.company}</TableCell>
                  <TableCell><span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{r.product}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.plan}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.seats}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.expiryDate}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-sm font-medium",
                      r.daysLeft <= 0 ? "text-destructive" : r.daysLeft <= 30 ? "text-warning" : "text-muted-foreground"
                    )}>
                      {r.daysLeft <= 0 ? `${Math.abs(r.daysLeft)}d overdue` : `${r.daysLeft}d`}
                    </span>
                  </TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-sm font-medium text-right">₹{r.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Send renewal email" onClick={() => handleEmail(r)}>
                        <Mail className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Log call" onClick={() => handleCall(r)}>
                        <Phone className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Email confirm dialog */}
      <Dialog open={!!emailTarget} onOpenChange={() => setEmailTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Send Renewal Email</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Send a renewal reminder email to <strong>{emailTarget?.company}</strong>? Their subscription expires on <strong>{emailTarget?.expiryDate}</strong>.
          </p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setEmailTarget(null)}>Cancel</Button>
            <Button onClick={confirmEmail}><Mail className="w-3.5 h-3.5 mr-1.5" /> Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call log dialog */}
      <Dialog open={!!callTarget} onOpenChange={() => setCallTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Log Call</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Log a call with <strong>{callTarget?.company}</strong> regarding their upcoming renewal.
          </p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setCallTarget(null)}>Cancel</Button>
            <Button onClick={() => { toast({ title: "Call logged", description: `Call with ${callTarget?.company} has been logged.` }); setCallTarget(null); }}>
              <Phone className="w-3.5 h-3.5 mr-1.5" /> Log Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Renewals;
