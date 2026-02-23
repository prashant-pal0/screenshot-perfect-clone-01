import { cn } from "@/lib/utils";

type StatusType = "active" | "expiring" | "expired" | "cancelled" | "paid" | "unpaid" | "overdue" | "partial" | "hot" | "warm" | "cold" | "open" | "resolved" | "closed";

const statusStyles: Record<StatusType, string> = {
  active: "bg-success/10 text-success border-success/20",
  paid: "bg-success/10 text-success border-success/20",
  resolved: "bg-success/10 text-success border-success/20",
  closed: "bg-muted text-muted-foreground border-border",
  expiring: "bg-warning/10 text-warning border-warning/20",
  partial: "bg-warning/10 text-warning border-warning/20",
  warm: "bg-warning/10 text-warning border-warning/20",
  open: "bg-info/10 text-info border-info/20",
  cold: "bg-info/10 text-info border-info/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  unpaid: "bg-destructive/10 text-destructive border-destructive/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  hot: "bg-destructive/10 text-destructive border-destructive/20",
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize",
        statusStyles[status]
      )}
    >
      {label || status}
    </span>
  );
};

export default StatusBadge;
