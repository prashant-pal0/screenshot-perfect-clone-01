import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { invoices, companies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Download, Send } from "lucide-react";
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

const Invoices = () => {
  const [search, setSearch] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [remindTarget, setRemindTarget] = useState<string | null>(null);
  const [form, setForm] = useState({ company: "", product: "Tour CRM", amount: "", dueDate: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = invoices.filter(
    (inv) =>
      inv.company.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((a, b) => a + b.amount, 0);

  const handleCreate = () => {
    if (!form.company || !form.amount) {
      toast({ title: "Missing fields", description: "Company and amount are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Invoice created", description: `Invoice for ${form.company} created.` });
    setNewOpen(false);
    setForm({ company: "", product: "Tour CRM", amount: "", dueDate: "" });
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Company", "Product", "Issue Date", "Due Date", "Status", "Amount"].join(","),
      ...filtered.map((i) => [i.id, i.company, i.product, i.issueDate, i.dueDate, i.status, i.amount].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "invoices.csv"; a.click();
    toast({ title: "Export started", description: "invoices.csv is downloading." });
  };

  const handleRemind = (invId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRemindTarget(invId);
  };

  const confirmRemind = () => {
    const inv = invoices.find((i) => i.id === remindTarget);
    toast({ title: "Reminder sent", description: `Payment reminder emailed to ${inv?.company}.` });
    setRemindTarget(null);
  };

  return (
    <>
      <AppHeader title="Invoices" subtitle={`${invoices.length} invoices · ₹${(totalPending / 100000).toFixed(1)}L outstanding`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Paid",    count: invoices.filter((i) => i.status === "paid").length,    color: "text-success" },
            { label: "Pending", count: invoices.filter((i) => i.status === "pending").length, color: "text-warning" },
            { label: "Overdue", count: invoices.filter((i) => i.status === "overdue").length, color: "text-destructive" },
            { label: "Draft",   count: invoices.filter((i) => i.status === "draft").length,   color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport}><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
            <Button size="sm" className="h-9" onClick={() => setNewOpen(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> New Invoice</Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Invoice</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Issue Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Due Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Amount</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => (
                <TableRow key={inv.id} className="cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
                  <TableCell className="text-sm font-mono text-muted-foreground">{inv.id}</TableCell>
                  <TableCell className="text-sm font-medium">{inv.company}</TableCell>
                  <TableCell><span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{inv.product}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.issueDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                  <TableCell className="text-sm font-medium text-right">₹{inv.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    {(inv.status === "pending" || inv.status === "overdue") && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => handleRemind(inv.id, e)}>
                        <Send className="w-3 h-3 mr-1" /> Remind
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">No invoices found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* New Invoice Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
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
            <div className="space-y-2"><Label>Amount (₹)</Label><Input type="number" placeholder="e.g. 180000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
            <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Reminder Confirm */}
      <Dialog open={!!remindTarget} onOpenChange={() => setRemindTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Send Payment Reminder</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will send an email reminder to <strong>{invoices.find((i) => i.id === remindTarget)?.company}</strong> for invoice <strong>{remindTarget}</strong>.
          </p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setRemindTarget(null)}>Cancel</Button>
            <Button onClick={confirmRemind}><Send className="w-3.5 h-3.5 mr-1.5" /> Send Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Invoices;
