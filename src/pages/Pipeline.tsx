import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { pipelineDeals, pipelineStages } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Pipeline = () => {
  const navigate = useNavigate();
  const totalValue = pipelineDeals.reduce((acc, d) => acc + d.value, 0);

  return (
    <>
      <AppHeader
        title="Sales Pipeline"
        subtitle={`${pipelineDeals.length} deals · ₹${(totalValue / 100000).toFixed(1)}L total value`}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-end">
          <Button size="sm" className="h-9">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Lead
          </Button>
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {pipelineStages.map((stage) => {
            const deals = pipelineDeals.filter((d) => d.stage === stage.id);
            const stageValue = deals.reduce((acc, d) => acc + d.value, 0);
            return (
              <div key={stage.id} className="space-y-3">
                <div className={cn("rounded-lg border px-3 py-2 flex items-center justify-between", stage.color)}>
                  <span className="text-sm font-semibold">{stage.label}</span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {deals.length} · ₹{(stageValue / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="space-y-2">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => navigate(`/pipeline/${deal.id}`)}
                      className="bg-card rounded-lg border border-border p-3 space-y-2 cursor-pointer hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-card-foreground leading-tight">{deal.company}</p>
                        <StatusBadge status={deal.score} />
                      </div>
                      <p className="text-xs text-muted-foreground">{deal.contact}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">{deal.product}</span>
                        <span className="text-sm font-semibold text-card-foreground">
                          ₹{deal.value.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{deal.source}</span>
                        <span
                          className={cn(
                            deal.daysInStage > 7 && "text-destructive font-medium"
                          )}
                        >
                          {deal.daysInStage}d in stage
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Pipeline;
