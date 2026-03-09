import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { tickets } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high:     "bg-warning/10 text-warning border-warning/30",
  medium:   "bg-info/10 text-info border-info/30",
  low:      "bg-muted text-muted-foreground border-border",
};

const AGENTS = ["Ravi K.", "Priya S.", "Amit J.", "Neha G.", "Unassigned"];

const TicketDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const ticket = tickets.find((t) => t.id === id);
  const [reply, setReply] = useState("");
  const [reassignOpen, setReassignOpen] = useState(false);
  const [newAssignee, setNewAssignee] = useState("");
  const [currentStatus, setCurrentStatus] = useState(ticket?.status ?? "open");

  if (!ticket) {
    return (
      <>
        <AppHeader title="Ticket Not Found" />
        <div className="flex-1 p-6"><Link to="/tickets"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link></div>
      </>
    );
  }

  const handleSendReply = () => {
    if (!reply.trim()) {
      toast({ title: "Empty reply", description: "Please type a message before sending.", variant: "destructive" });
      return;
    }
    toast({ title: "Reply sent", description: "Your reply has been sent to the customer." });
    setReply("");
  };

  const handleInternalNote = () => {
    if (!reply.trim()) {
      toast({ title: "Empty note", description: "Please type a note.", variant: "destructive" });
      return;
    }
    toast({ title: "Internal note saved", description: "Note added to ticket timeline." });
    setReply("");
  };

  const advanceStatus = () => {
    const next = currentStatus === "open" ? "in_progress" : currentStatus === "in_progress" ? "resolved" : "closed";
    setCurrentStatus(next as typeof currentStatus);
    const labels: Record<string, string> = { in_progress: "In Progress", resolved: "Resolved", closed: "Closed" };
    toast({ title: `Ticket ${labels[next]}`, description: `Ticket ${ticket.id} moved to ${labels[next]}.` });
  };

  const handleReassign = () => {
    if (!newAssignee) return;
    toast({ title: "Ticket reassigned", description: `Assigned to ${newAssignee}.` });
    setReassignOpen(false);
  };

  return (
    <>
      <AppHeader title={ticket.id} subtitle={ticket.subject} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/tickets"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Tickets</Button></Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Add Reply</h3>
              <Textarea placeholder="Type your reply..." className="mb-3" rows={4} value={reply} onChange={(e) => setReply(e.target.value)} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleInternalNote}>Internal Note</Button>
                <Button size="sm" onClick={handleSendReply}>Send Reply</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-5 space-y-4">
              <h3 className="text-sm font-semibold text-card-foreground">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={currentStatus} /></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority</span>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded border capitalize", priorityColors[ticket.priority])}>{ticket.priority}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assignee</span>
                  <span className="flex items-center gap-1 text-sm"><User className="w-3 h-3" />{ticket.assignee}</span>
                </div>
                <div className="flex justify-between"><span className="text-muted-foreground">Company</span><span className="font-medium">{ticket.company}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="flex items-center gap-1 text-xs"><Clock className="w-3 h-3" />{ticket.updatedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {currentStatus !== "closed" && (
                <Button size="sm" className="w-full" onClick={advanceStatus}>
                  {currentStatus === "open" ? "Mark In Progress" : currentStatus === "in_progress" ? "Mark Resolved" : "Close Ticket"}
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full" onClick={() => setReassignOpen(true)}>Reassign</Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Reassign Ticket</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">Current assignee: <strong>{ticket.assignee}</strong></p>
            <div className="space-y-2">
              <Label>New Assignee</Label>
              <Select value={newAssignee} onValueChange={setNewAssignee}>
                <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
                <SelectContent>
                  {AGENTS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignOpen(false)}>Cancel</Button>
            <Button onClick={handleReassign}>Reassign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketDetail;
