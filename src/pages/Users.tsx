import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Shield, Edit, Trash2, KeyRound, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROLES = ["Super Admin", "Sales Manager", "Sales Rep", "Finance", "Support Manager", "Support Agent"] as const;
type Role = typeof ROLES[number];

const roleColors: Record<Role, string> = {
  "Super Admin":     "bg-destructive/10 text-destructive border-destructive/30",
  "Sales Manager":   "bg-primary/10 text-primary border-primary/30",
  "Sales Rep":       "bg-info/10 text-info border-info/30",
  "Finance":         "bg-warning/10 text-warning border-warning/30",
  "Support Manager": "bg-success/10 text-success border-success/30",
  "Support Agent":   "bg-secondary text-secondary-foreground border-border",
};

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
  lastLogin: string;
  initials: string;
}

const initialUsers: User[] = [
  { id: "1", name: "Arjun Kumar",   email: "arjun@mastercrm.in",  role: "Super Admin",     status: "active",   lastLogin: "Just now",        initials: "AK" },
  { id: "2", name: "Ravi Krishnan", email: "ravi@mastercrm.in",   role: "Sales Manager",   status: "active",   lastLogin: "2 hours ago",     initials: "RK" },
  { id: "3", name: "Priya Sharma",  email: "priya@mastercrm.in",  role: "Support Manager", status: "active",   lastLogin: "Yesterday",       initials: "PS" },
  { id: "4", name: "Amit Joshi",    email: "amit@mastercrm.in",   role: "Support Agent",   status: "active",   lastLogin: "Yesterday",       initials: "AJ" },
  { id: "5", name: "Neha Gupta",    email: "neha@mastercrm.in",   role: "Sales Rep",       status: "active",   lastLogin: "3 days ago",      initials: "NG" },
  { id: "6", name: "Vijay Patel",   email: "vijay@mastercrm.in",  role: "Finance",         status: "active",   lastLogin: "1 week ago",      initials: "VP" },
  { id: "7", name: "Sunita Rao",    email: "sunita@mastercrm.in", role: "Sales Rep",       status: "inactive", lastLogin: "2 weeks ago",     initials: "SR" },
];

const emptyForm = { name: "", email: "", role: "Sales Rep" as Role, status: "active" as "active" | "inactive" };

const Users = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const { toast } = useToast();

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const openAdd = () => {
    setEditUser(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, role: u.role, status: u.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) {
      toast({ title: "Missing fields", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    if (editUser) {
      setUsers((prev) => prev.map((u) => u.id === editUser.id ? { ...u, ...form } : u));
      toast({ title: "User updated", description: `${form.name}'s profile has been saved.` });
    } else {
      const initials = form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      const newUser: User = { id: Date.now().toString(), ...form, lastLogin: "Never", initials };
      setUsers((prev) => [...prev, newUser]);
      toast({ title: "User invited", description: `Invitation sent to ${form.email}.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    toast({ title: "User removed", description: `${deleteTarget.name} has been removed.`, variant: "destructive" });
    setDeleteTarget(null);
  };

  const handleResetPassword = (u: User) => {
    toast({ title: "Password reset sent", description: `Reset link emailed to ${u.email}.` });
  };

  const handleToggleStatus = (u: User) => {
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x));
    toast({ title: `User ${u.status === "active" ? "deactivated" : "activated"}`, description: `${u.name} is now ${u.status === "active" ? "inactive" : "active"}.` });
  };

  const roleCount = (role: Role) => users.filter((u) => u.role === role).length;

  return (
    <>
      <AppHeader title="Users & Roles" subtitle={`${users.length} team members`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Role overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ROLES.map((role) => (
            <div key={role} className="bg-card rounded-lg border border-border p-3 space-y-1 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterRole(filterRole === role ? "all" : role)}>
              <p className="text-xs text-muted-foreground font-medium leading-tight">{role}</p>
              <p className="text-2xl font-bold text-card-foreground">{roleCount(role)}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-3 flex-1 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-44 h-9"><SelectValue placeholder="All roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="h-9" onClick={openAdd}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Invite User
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">User</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Role</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Last Login</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{user.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs font-medium ${roleColors[user.role]}`}>
                      <Shield className="w-3 h-3 mr-1" />{user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${
                      user.status === "active"
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => openEdit(user)}>
                          <Edit className="w-3.5 h-3.5 mr-2" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                          <KeyRound className="w-3.5 h-3.5 mr-2" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                          <UserCheck className="w-3.5 h-3.5 mr-2" />
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteTarget(user)} className="text-destructive focus:text-destructive">
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">No users found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Role permissions reference */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> Role Permissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-semibold text-muted-foreground py-2 pr-4">Permission</th>
                  {ROLES.map((r) => <th key={r} className="text-center font-semibold text-muted-foreground py-2 px-2 whitespace-nowrap">{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "View Clients",        perms: [true, true, true, true, true, true] },
                  { label: "Add/Edit Clients",    perms: [true, true, true, false, false, false] },
                  { label: "View Invoices",       perms: [true, true, false, true, false, false] },
                  { label: "Create Invoices",     perms: [true, false, false, true, false, false] },
                  { label: "View Pipeline",       perms: [true, true, true, false, false, false] },
                  { label: "Manage Tickets",      perms: [true, false, false, false, true, true] },
                  { label: "Manage Users",        perms: [true, false, false, false, false, false] },
                  { label: "View Reports",        perms: [true, true, false, true, true, false] },
                  { label: "System Settings",     perms: [true, false, false, false, false, false] },
                ].map(({ label, perms }) => (
                  <tr key={label} className="border-b border-border/50 last:border-0">
                    <td className="py-2 pr-4 font-medium text-card-foreground">{label}</td>
                    {perms.map((has, i) => (
                      <td key={i} className="text-center py-2 px-2">
                        {has
                          ? <span className="text-success font-bold">✓</span>
                          : <span className="text-muted-foreground/40">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editUser ? "Edit User" : "Invite New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="e.g. Rahul Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="name@company.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {editUser && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editUser ? "Save Changes" : "Send Invite"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Users;
