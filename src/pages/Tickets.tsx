import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { tickets, companies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Clock } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high:     "bg-warning/10 text-warning border-warning/30",
  medium:   "bg-info/10 text-info border-info/30",
  low:      "bg-muted text-muted-foreground border-border",
};

const Tickets = () => {
  const [search, setSearch] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({ company: "", subject: "", priority: "medium", description: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = tickets.filter(
    (t) =>
      t.company.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;

  const handleCreate = () => {
    if (!form.company || !form.subject) {
      toast({ title: "Missing fields", description: "Company and subject are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Ticket created", description: `Ticket for ${form.company} has been created.` });
    setNewOpen(false);
    setForm({ company: "", subject: "", priority: "medium", description: "" });
  };

  return (
    <>
      <AppHeader title="Support Tickets" subtitle={`${openCount} open tickets`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Open",        count: tickets.filter((t) => t.status === "open").length },
            { label: "In Progress", count: tickets.filter((t) => t.status === "in_progress").length },
            { label: "Resolved",    count: tickets.filter((t) => t.status === "resolved").length },
            { label: "Closed",      count: tickets.filter((t) => t.status === "closed").length },
            { label: "Critical",    count: tickets.filter((t) => t.priority === "critical").length },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-card-foreground">{s.count}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button size="sm" className="h-9" onClick={() => setNewOpen(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> New Ticket</Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Subject</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Priority</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Assignee</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => navigate(`/tickets/${t.id}`)}>
                  <TableCell className="text-sm font-mono text-muted-foreground">{t.id}</TableCell>
                  <TableCell className="text-sm font-medium max-w-[300px] truncate">{t.subject}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.company}</TableCell>
                  <TableCell>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded border capitalize", priorityColors[t.priority])}>{t.priority}</span>
                  </TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.assignee}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.updatedAt}</span>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">No tickets found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Support Ticket</DialogTitle></DialogHeader>
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
            <div className="space-y-2"><Label>Subject</Label><Input placeholder="Brief description of the issue" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Detailed description of the issue..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Tickets;
