import { useParams, Link } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { tickets } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Clock, User, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-warning/10 text-warning border-warning/30",
  medium: "bg-info/10 text-info border-info/30",
  low: "bg-muted text-muted-foreground border-border",
};

const TicketDetail = () => {
  const { id } = useParams();
  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <>
        <AppHeader title="Ticket Not Found" />
        <div className="flex-1 p-6"><Link to="/tickets"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link></div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={ticket.id} subtitle={ticket.subject} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/tickets"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Tickets</Button></Link>
          <Button size="sm"><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-2">{ticket.subject}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Reported by {ticket.company} · Created {ticket.createdAt}
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 text-sm text-card-foreground leading-relaxed">
                <p>The customer has reported an issue with {ticket.subject.toLowerCase()}. This needs to be investigated and resolved according to the SLA for {ticket.priority} priority tickets.</p>
                <p className="mt-2">Steps to reproduce:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-muted-foreground">
                  <li>Log into the application</li>
                  <li>Navigate to the affected module</li>
                  <li>Attempt the reported action</li>
                  <li>Observe the error or unexpected behavior</li>
                </ol>
              </div>
            </div>

            {/* Reply box */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Add Reply</h3>
              <Textarea placeholder="Type your reply..." className="mb-3" rows={4} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Internal Note</Button>
                <Button size="sm">Send Reply</Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-5 space-y-4">
              <h3 className="text-sm font-semibold text-card-foreground">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority</span>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded border capitalize", priorityColors[ticket.priority])}>{ticket.priority}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assignee</span>
                  <span className="flex items-center gap-1 text-sm"><User className="w-3 h-3" />{ticket.assignee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium">{ticket.company}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="flex items-center gap-1 text-xs"><Clock className="w-3 h-3" />{ticket.updatedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {ticket.status === "open" && <Button size="sm" className="w-full">Mark In Progress</Button>}
              {ticket.status === "in_progress" && <Button size="sm" className="w-full">Mark Resolved</Button>}
              {ticket.status === "resolved" && <Button size="sm" className="w-full">Close Ticket</Button>}
              <Button variant="outline" size="sm" className="w-full">Reassign</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketDetail;
