import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { companies } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Plus, Download, Filter } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Clients = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", product: "Tour CRM", gst: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus.length === 0 || filterStatus.includes(c.status);
    return matchSearch && matchStatus;
  });

  const toggleFilter = (s: string) =>
    setFilterStatus((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const handleAdd = () => {
    if (!form.name || !form.city) {
      toast({ title: "Missing fields", description: "Company name and city are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Client added", description: `${form.name} has been added successfully.` });
    setAddOpen(false);
    setForm({ name: "", city: "", product: "Tour CRM", gst: "" });
  };

  const handleExport = () => {
    const csv = [
      ["Name", "City", "Product", "Status", "MRR"].join(","),
      ...filtered.map((c) => [c.name, c.city, c.product, c.status, c.mrr].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "clients.csv"; a.click();
    toast({ title: "Export started", description: "clients.csv is downloading." });
  };

  return (
    <>
      <AppHeader title="Clients" subtitle={`${companies.length} companies`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  Filter {filterStatus.length > 0 && `(${filterStatus.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {["active", "expiring", "expired", "cancelled"].map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={filterStatus.includes(s)}
                    onCheckedChange={() => toggleFilter(s)}
                    className="capitalize"
                  >{s}</DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export
            </Button>
            <Button size="sm" className="h-9" onClick={() => setAddOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Company
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">City</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Contacts</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">MRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((company) => (
                <TableRow key={company.id} className="cursor-pointer" onClick={() => navigate(`/clients/${company.id}`)}>
                  <TableCell className="font-medium text-sm">{company.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{company.city}</TableCell>
                  <TableCell>
                    <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{company.product}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{company.contacts}</TableCell>
                  <TableCell><StatusBadge status={company.status} /></TableCell>
                  <TableCell className="text-sm font-medium text-right">
                    {company.mrr > 0 ? `₹${company.mrr.toLocaleString("en-IN")}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">No clients found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add New Company</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Company Name</Label><Input placeholder="e.g. TravelMax India" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>City</Label><Input placeholder="e.g. Bangalore" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
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
            <div className="space-y-2"><Label>GST Number (optional)</Label><Input placeholder="e.g. 29AADCT1234A1Z5" value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Clients;
