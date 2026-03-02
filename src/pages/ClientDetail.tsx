import { useParams, Link } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { companies, subscriptions, invoices, tickets } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Mail, Phone, MapPin, FileText, CreditCard, LifeBuoy, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const ClientDetail = () => {
  const { id } = useParams();
  const company = companies.find((c) => c.id === id);

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

  return (
    <>
      <AppHeader title={company.name} subtitle={company.city} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/clients"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Clients</Button></Link>
          <Button size="sm"><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <Building2 className="w-4 h-4 text-primary" /> Company Info
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span className="font-mono text-xs">{company.gst}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.city}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">{company.product}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={company.status} /></div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <CreditCard className="w-4 h-4 text-primary" /> Financials
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">MRR</span><span className="font-semibold">{company.mrr > 0 ? `₹${company.mrr.toLocaleString("en-IN")}` : "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Subscriptions</span><span>{companySubs.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Invoices</span><span>{companyInvoices.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sub Ends</span><span>{company.subscriptionEnd}</span></div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <Mail className="w-4 h-4 text-primary" /> Contacts
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Contacts</span><span>{company.contacts}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Open Tickets</span><span>{companyTickets.filter(t => t.status === "open").length}</span></div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="h-8 text-xs"><Mail className="w-3 h-3 mr-1" /> Email</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs"><Phone className="w-3 h-3 mr-1" /> Call</Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
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
                    <TableRow key={s.id} className="cursor-pointer" onClick={() => {}}>
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
                    <TableRow key={inv.id}>
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
                    <TableRow key={t.id}>
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
    </>
  );
};

export default ClientDetail;
