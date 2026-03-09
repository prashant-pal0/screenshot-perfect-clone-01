import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Loader2 } from "lucide-react";
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
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ company_id: "", product: "Tour CRM", plan: "1 Year", seats: "5" });

  const { data: subscriptions = [], isLoading, error } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: api.getSubscriptions
  });

  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: api.getCompanies
  });

  const createSub = useMutation({
    mutationFn: api.createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({ title: "Subscription created", description: `New subscription has been created.` });
      setAddOpen(false);
      setForm({ company_id: "", product: "Tour CRM", plan: "1 Year", seats: "5" });
    },
    onError: (err) => {
      toast({ title: "Failed to create", description: err.message, variant: "destructive" });
    }
  });

  const filtered = subscriptions.filter(
    (s) =>
      // Mocking company name search since backend only returns company_id
      // A full join in backend would be ideal
      s.id.toString().includes(search.toLowerCase()) ||
      companies.find(c => c.id === s.company_id)?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.company_id) {
      toast({ title: "Missing company", description: "Please select a company.", variant: "destructive" });
      return;
    }
    createSub.mutate({
      company_id: parseInt(form.company_id),
      plan: form.plan,
      seats: parseInt(form.seats),
      amount: 10000, // Hardcoded for demo, normally backend/frontend logic dictates pricing
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: 'active'
    });
  };

  if (error) {
    return <div className="p-6 text-destructive">Error loading subscriptions: {(error as Error).message}</div>;
  }

  return (
    <>
      <AppHeader title="Subscriptions" subtitle={`${isLoading ? '...' : subscriptions.length} subscriptions`} />
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

        <div className="bg-card rounded-lg border border-border overflow-hidden relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Plan</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Seats</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">End Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => {
                const companyInfo = companies.find(c => c.id === sub.company_id);
                return (
                  <TableRow key={sub.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate(`/subscriptions/${sub.id}`)}>
                    <TableCell className="text-sm font-mono text-muted-foreground">{sub.id}</TableCell>
                    <TableCell className="text-sm font-medium">{companyInfo?.name || `Company #${sub.company_id}`}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sub.plan}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sub.seats}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(sub.end_date).toLocaleDateString()}</TableCell>
                    <TableCell><StatusBadge status={sub.status as "active" | "inactive"} /></TableCell>
                    <TableCell className="text-sm font-medium text-right">₹{sub.amount?.toLocaleString("en-IN") || 0}</TableCell>
                  </TableRow>
                );
              })}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">No subscriptions found</TableCell></TableRow>
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
              <Select value={form.company_id} onValueChange={(v) => setForm({ ...form, company_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                <SelectContent>
                  {companies.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
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
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={createSub.isPending}>Cancel</Button>
            <Button onClick={handleAdd} disabled={createSub.isPending}>
              {createSub.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Subscriptions;
