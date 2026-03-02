import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { subscriptions } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Subscriptions = () => {
  const navigate = useNavigate();
  return (
    <>
      <AppHeader title="Subscriptions" subtitle={`${subscriptions.length} subscriptions`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-end">
          <Button size="sm" className="h-9">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Subscription
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Plan</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Seats</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">End Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id} className="cursor-pointer" onClick={() => navigate(`/subscriptions/${sub.id}`)}>
                  <TableCell className="text-sm font-mono text-muted-foreground">{sub.id}</TableCell>
                  <TableCell className="text-sm font-medium">{sub.company}</TableCell>
                  <TableCell>
                    <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{sub.product}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{sub.plan}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{sub.seats}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{sub.endDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={sub.status} />
                  </TableCell>
                  <TableCell className="text-sm font-medium text-right">₹{sub.amount.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
