import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

const KPICard = ({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: KPICardProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-5 animate-slide-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconColor || "bg-primary/10")}>
          <Icon className={cn("w-5 h-5", iconColor ? "text-card" : "text-primary")} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
