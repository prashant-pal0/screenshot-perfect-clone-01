import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { invoices } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Send } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const Invoices = () => {
  const [search, setSearch] = useState("");

  const filtered = invoices.filter(
    (inv) =>
      inv.company.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <>
      <AppHeader
        title="Invoices"
        subtitle={`${invoices.length} invoices · ₹${(totalPending / 100000).toFixed(1)}L outstanding`}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Paid", count: invoices.filter((i) => i.status === "paid").length, color: "text-success" },
            { label: "Pending", count: invoices.filter((i) => i.status === "pending").length, color: "text-warning" },
            { label: "Overdue", count: invoices.filter((i) => i.status === "overdue").length, color: "text-destructive" },
            { label: "Draft", count: invoices.filter((i) => i.status === "draft").length, color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
            <Button size="sm" className="h-9"><Plus className="w-3.5 h-3.5 mr-1.5" /> New Invoice</Button>
          </div>
        </div>

        {/* Table */}
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
                <TableRow key={inv.id} className="cursor-pointer">
                  <TableCell className="text-sm font-mono text-muted-foreground">{inv.id}</TableCell>
                  <TableCell className="text-sm font-medium">{inv.company}</TableCell>
                  <TableCell><span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{inv.product}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.issueDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                  <TableCell className="text-sm font-medium text-right">₹{inv.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">
                    {inv.status === "pending" && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs"><Send className="w-3 h-3 mr-1" /> Remind</Button>
                    )}
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

export default Invoices;
