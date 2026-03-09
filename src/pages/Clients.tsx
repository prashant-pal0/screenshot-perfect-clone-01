import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Plus, Download, Filter, Loader2 } from "lucide-react";
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
  const [form, setForm] = useState({ name: "", city: "", product: "Tour CRM", code: "" });
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: api.getCompanies
  });

  const createCompany = useMutation({
    mutationFn: api.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({ title: "Client added", description: `${form.name} has been added successfully.` });
      setAddOpen(false);
      setForm({ name: "", city: "", product: "Tour CRM", code: "" });
    },
    onError: (err) => {
      toast({ title: "Failed to add client", description: err.message, variant: "destructive" });
    }
  });

  const filtered = companies.filter((c) => {
    // Backend doesn't have city directly right now, simulate it from mock or base it on name for search
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase());

    // Map is_active to a status string for compatibility with StatusBadge
    const status = c.is_active ? "active" : "inactive";
    const matchStatus = filterStatus.length === 0 || filterStatus.includes(status);
    return matchSearch && matchStatus;
  });

  const toggleFilter = (s: string) =>
    setFilterStatus((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const handleAdd = () => {
    if (!form.name || !form.code) {
      toast({ title: "Missing fields", description: "Company name and code are required.", variant: "destructive" });
      return;
    }
    createCompany.mutate({
      name: form.name,
      code: form.code,
      is_active: 1
    });
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Name", "Code", "Status"].join(","),
      ...filtered.map((c) => [c.id, c.name, c.code, c.is_active ? "active" : "inactive"].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "clients.csv"; a.click();
    toast({ title: "Export started", description: "clients.csv is downloading." });
  };

  if (error) {
    return <div className="p-6 text-destructive">Error loading companies: {(error as Error).message}</div>;
  }

  return (
    <>
      <AppHeader title="Clients" subtitle={`${isLoading ? '...' : companies.length} companies`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or code..."
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
                {["active", "inactive"].map((s) => (
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

        <div className="bg-card rounded-lg border border-border overflow-hidden relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground font-medium">Loading companies...</p>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company Code</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Created</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((company) => (
                <TableRow key={company.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {company.logo_url ? (
                        <img src={company.logo_url} alt={company.name} className="w-8 h-8 rounded-full border border-border bg-card" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                          {company.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-sm text-card-foreground">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-muted-foreground">{company.code || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(company.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell><StatusBadge status={company.is_active ? "active" : "inactive"} /></TableCell>
                  <TableCell className="text-sm font-medium text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/clients/${company.id}`); }}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">No clients found in the database</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add New Company</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input placeholder="e.g. TravelMax India" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Company Code</Label>
              <Input placeholder="e.g. TMI-01" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              <p className="text-xs text-muted-foreground">Unique identifier, like a slug.</p>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={createCompany.isPending}>Cancel</Button>
            <Button onClick={handleAdd} disabled={createCompany.isPending}>
              {createCompany.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Clients;
