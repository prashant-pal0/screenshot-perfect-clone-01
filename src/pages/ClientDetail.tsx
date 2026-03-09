import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { companies, subscriptions, invoices, tickets } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Mail, Phone, MapPin, FileText, CreditCard, LifeBuoy, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const company = companies.find((c) => c.id === id);
  const [editOpen, setEditOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [form, setForm] = useState(company ? { name: company.name, city: company.city, product: company.product } : { name: "", city: "", product: "" });

  if (!company) {
    return (
      <>
        <AppHeader title="Client Not Found" />
        <div className="flex-1 p-6">
          <Link to="/clients"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
        </div>
      </>
    );
  }

  const companySubs = subscriptions.filter((s) => s.company === company.name);
  const companyInvoices = invoices.filter((i) => i.company === company.name);
  const companyTickets = tickets.filter((t) => t.company === company.name);

  const handleSave = () => {
    toast({ title: "Client updated", description: `${form.name}'s details have been saved.` });
    setEditOpen(false);
  };

  return (
    <>
      <AppHeader title={company.name} subtitle={company.city} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/clients"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Clients</Button></Link>
          <Button size="sm" onClick={() => setEditOpen(true)}><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground"><Building2 className="w-4 h-4 text-primary" /> Company Info</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span className="font-mono text-xs">{company.gst}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.city}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">{company.product}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={company.status} /></div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground"><CreditCard className="w-4 h-4 text-primary" /> Financials</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">MRR</span><span className="font-semibold">{company.mrr > 0 ? `₹${company.mrr.toLocaleString("en-IN")}` : "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Subscriptions</span><span>{companySubs.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Invoices</span><span>{companyInvoices.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sub Ends</span><span>{company.subscriptionEnd}</span></div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground"><Mail className="w-4 h-4 text-primary" /> Contacts</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Contacts</span><span>{company.contacts}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Open Tickets</span><span>{companyTickets.filter((t) => t.status === "open").length}</span></div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setEmailOpen(true)}><Mail className="w-3 h-3 mr-1" /> Email</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setCallOpen(true)}><Phone className="w-3 h-3 mr-1" /> Call</Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="subscriptions">
          <TabsList>
            <TabsTrigger value="subscriptions"><CreditCard className="w-3.5 h-3.5 mr-1.5" />Subscriptions ({companySubs.length})</TabsTrigger>
            <TabsTrigger value="invoices"><FileText className="w-3.5 h-3.5 mr-1.5" />Invoices ({companyInvoices.length})</TabsTrigger>
            <TabsTrigger value="tickets"><LifeBuoy className="w-3.5 h-3.5 mr-1.5" />Tickets ({companyTickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="mt-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">ID</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Plan</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Seats</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">End Date</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Amount</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {companySubs.map((s) => (
                    <TableRow key={s.id} className="cursor-pointer" onClick={() => navigate(`/subscriptions/${s.id}`)}>
                      <TableCell className="text-sm font-mono text-muted-foreground">{s.id}</TableCell>
                      <TableCell className="text-sm">{s.plan}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.seats}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.endDate}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell className="text-sm font-medium text-right">₹{s.amount.toLocaleString("en-IN")}</TableCell>
                    </TableRow>
                  ))}
                  {companySubs.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">No subscriptions</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Invoice</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Issue Date</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Due Date</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Amount</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {companyInvoices.map((inv) => (
                    <TableRow key={inv.id} className="cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
                      <TableCell className="text-sm font-mono text-muted-foreground">{inv.id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{inv.issueDate}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
                      <TableCell><StatusBadge status={inv.status} /></TableCell>
                      <TableCell className="text-sm font-medium text-right">₹{inv.amount.toLocaleString("en-IN")}</TableCell>
                    </TableRow>
                  ))}
                  {companyInvoices.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">No invoices</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="mt-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">ID</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Subject</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Priority</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Assignee</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {companyTickets.map((t) => (
                    <TableRow key={t.id} className="cursor-pointer" onClick={() => navigate(`/tickets/${t.id}`)}>
                      <TableCell className="text-sm font-mono text-muted-foreground">{t.id}</TableCell>
                      <TableCell className="text-sm font-medium">{t.subject}</TableCell>
                      <TableCell><span className="text-xs font-medium capitalize">{t.priority}</span></TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.assignee}</TableCell>
                    </TableRow>
                  ))}
                  {companyTickets.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">No tickets</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Client</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Company Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Email {company.name}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will open your default email client to compose an email to the primary contact at {company.name}.</p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setEmailOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast({ title: "Email client opened" }); setEmailOpen(false); }}><Mail className="w-3.5 h-3.5 mr-1.5" /> Open Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={callOpen} onOpenChange={setCallOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Call {company.name}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Log a call interaction with {company.name}. This will be recorded in the activity timeline.</p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setCallOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast({ title: "Call logged", description: `Call with ${company.name} has been recorded.` }); setCallOpen(false); }}><Phone className="w-3.5 h-3.5 mr-1.5" /> Log Call</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientDetail;
