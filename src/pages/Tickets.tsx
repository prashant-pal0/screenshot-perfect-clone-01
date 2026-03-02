import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { tickets } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Clock } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-warning/10 text-warning border-warning/30",
  medium: "bg-info/10 text-info border-info/30",
  low: "bg-muted text-muted-foreground border-border",
};

const Tickets = () => {
  const [search, setSearch] = useState("");

  const filtered = tickets.filter(
    (t) =>
      t.company.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;

  return (
    <>
      <AppHeader title="Support Tickets" subtitle={`${openCount} open tickets`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Open", count: tickets.filter((t) => t.status === "open").length },
            { label: "In Progress", count: tickets.filter((t) => t.status === "in_progress").length },
            { label: "Resolved", count: tickets.filter((t) => t.status === "resolved").length },
            { label: "Closed", count: tickets.filter((t) => t.status === "closed").length },
            { label: "Critical", count: tickets.filter((t) => t.priority === "critical").length },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-card-foreground">{s.count}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button size="sm" className="h-9"><Plus className="w-3.5 h-3.5 mr-1.5" /> New Ticket</Button>
        </div>

        {/* Table */}
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
                <TableRow key={t.id} className="cursor-pointer">
                  <TableCell className="text-sm font-mono text-muted-foreground">{t.id}</TableCell>
                  <TableCell className="text-sm font-medium max-w-[300px] truncate">{t.subject}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.company}</TableCell>
                  <TableCell>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded border", priorityColors[t.priority])}>
                      {t.priority}
                    </span>
                  </TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.assignee}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.updatedAt}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Tickets;
