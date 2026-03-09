import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { subscriptions, companies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Subscriptions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ company: "", product: "Tour CRM", plan: "1 Year", seats: "5" });

  const filtered = subscriptions.filter(
    (s) =>
      s.company.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.company) {
      toast({ title: "Missing company", description: "Please select a company.", variant: "destructive" });
      return;
    }
    toast({ title: "Subscription created", description: `New subscription for ${form.company} has been created.` });
    setAddOpen(false);
    setForm({ company: "", product: "Tour CRM", plan: "1 Year", seats: "5" });
  };

  return (
    <>
      <AppHeader title="Subscriptions" subtitle={`${subscriptions.length} subscriptions`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search subscriptions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button size="sm" className="h-9" onClick={() => setAddOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Subscription
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Plan</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Seats</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">End Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <TableRow key={sub.id} className="cursor-pointer" onClick={() => navigate(`/subscriptions/${sub.id}`)}>
                  <TableCell className="text-sm font-mono text-muted-foreground">{sub.id}</TableCell>
                  <TableCell className="text-sm font-medium">{sub.company}</TableCell>
                  <TableCell><span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{sub.product}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{sub.plan}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{sub.seats}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{sub.endDate}</TableCell>
                  <TableCell><StatusBadge status={sub.status} /></TableCell>
                  <TableCell className="text-sm font-medium text-right">₹{sub.amount.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">No subscriptions found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Subscription</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Company</Label>
              <Select value={form.company} onValueChange={(v) => setForm({ ...form, company: v })}>
                <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                <SelectContent>
                  {companies.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
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
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={form.plan} onValueChange={(v) => setForm({ ...form, plan: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                  <SelectItem value="2 Year">2 Year</SelectItem>
                  <SelectItem value="3 Year">3 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Number of Seats</Label><Input type="number" min={1} value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create Subscription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Subscriptions;
