import { useParams, Link } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { invoices } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Send, Printer, FileText } from "lucide-react";

const InvoiceDetail = () => {
  const { id } = useParams();
  const inv = invoices.find((i) => i.id === id);

  if (!inv) {
    return (
      <>
        <AppHeader title="Invoice Not Found" />
        <div className="flex-1 p-6"><Link to="/invoices"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link></div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={inv.id} subtitle={inv.company} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/invoices"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Invoices</Button></Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Printer className="w-3.5 h-3.5 mr-1.5" /> Print</Button>
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF</Button>
            {inv.status === "pending" && <Button size="sm"><Send className="w-3.5 h-3.5 mr-1.5" /> Send Reminder</Button>}
          </div>
        </div>

        {/* Invoice card */}
        <div className="bg-card rounded-lg border border-border p-8 max-w-3xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">{inv.id}</h2>
              <p className="text-sm text-muted-foreground mt-1">{inv.company}</p>
            </div>
            <StatusBadge status={inv.status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div><p className="text-xs text-muted-foreground mb-1">Issue Date</p><p className="text-sm font-medium">{inv.issueDate}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Due Date</p><p className="text-sm font-medium">{inv.dueDate}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Product</p><span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{inv.product}</span></div>
            <div><p className="text-xs text-muted-foreground mb-1">Amount</p><p className="text-xl font-bold text-card-foreground">₹{inv.amount.toLocaleString("en-IN")}</p></div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Line Items</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm py-2 border-b border-border">
                <span className="text-muted-foreground">Description</span>
                <span className="text-muted-foreground">Amount</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span>{inv.product} License</span>
                <span>₹{Math.round(inv.amount * 0.85).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span>Support & Maintenance</span>
                <span>₹{Math.round(inv.amount * 0.15).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-t border-border font-semibold">
                <span>Total</span>
                <span>₹{inv.amount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetail;
