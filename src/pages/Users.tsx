import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, MoreHorizontal, Shield, Edit, Trash2, KeyRound, UserCheck, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PERMISSIONS = [
  "View Clients", "Add/Edit Clients", "Delete Clients",
  "View Invoices", "Create Invoices", "Edit Invoices",
  "View Pipeline", "Manage Pipeline",
  "View Tickets", "Manage Tickets",
  "Manage Users", "View Reports", "System Settings"
] as const;

type Permission = typeof PERMISSIONS[number];

interface Role {
  id: string;
  name: string;
  color: string;
  permissions: Permission[];
}

const initialRoles: Role[] = [
  { id: "1", name: "Super Admin", color: "bg-destructive/10 text-destructive border-destructive/30", permissions: [...PERMISSIONS] },
  { id: "2", name: "Sales Manager", color: "bg-primary/10 text-primary border-primary/30", permissions: ["View Clients", "Add/Edit Clients", "View Invoices", "View Pipeline", "Manage Pipeline", "View Reports"] },
  { id: "3", name: "Sales Rep", color: "bg-info/10 text-info border-info/30", permissions: ["View Clients", "Add/Edit Clients", "View Pipeline"] },
  { id: "4", name: "Finance", color: "bg-warning/10 text-warning border-warning/30", permissions: ["View Clients", "View Invoices", "Create Invoices", "Edit Invoices", "View Reports"] },
  { id: "5", name: "Support Manager", color: "bg-success/10 text-success border-success/30", permissions: ["View Clients", "View Tickets", "Manage Tickets", "View Reports"] },
  { id: "6", name: "Support Agent", color: "bg-secondary text-secondary-foreground border-border", permissions: ["View Clients", "View Tickets", "Manage Tickets"] },
];

const colorOptions = [
  { value: "bg-destructive/10 text-destructive border-destructive/30", label: "Red" },
  { value: "bg-primary/10 text-primary border-primary/30", label: "Blue" },
  { value: "bg-info/10 text-info border-info/30", label: "Cyan" },
  { value: "bg-warning/10 text-warning border-warning/30", label: "Orange" },
  { value: "bg-success/10 text-success border-success/30", label: "Green" },
  { value: "bg-secondary text-secondary-foreground border-border", label: "Gray" },
];

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: "active" | "inactive";
  lastLogin: string;
  initials: string;
}

const initialUsers: User[] = [
  { id: "1", name: "Arjun Kumar",   email: "arjun@mastercrm.in",  roleId: "1", status: "active",   lastLogin: "Just now",        initials: "AK" },
  { id: "2", name: "Ravi Krishnan", email: "ravi@mastercrm.in",   roleId: "2", status: "active",   lastLogin: "2 hours ago",     initials: "RK" },
  { id: "3", name: "Priya Sharma",  email: "priya@mastercrm.in",  roleId: "5", status: "active",   lastLogin: "Yesterday",       initials: "PS" },
  { id: "4", name: "Amit Joshi",    email: "amit@mastercrm.in",   roleId: "6", status: "active",   lastLogin: "Yesterday",       initials: "AJ" },
  { id: "5", name: "Neha Gupta",    email: "neha@mastercrm.in",   roleId: "3", status: "active",   lastLogin: "3 days ago",      initials: "NG" },
  { id: "6", name: "Vijay Patel",   email: "vijay@mastercrm.in",  roleId: "4", status: "active",   lastLogin: "1 week ago",      initials: "VP" },
  { id: "7", name: "Sunita Rao",    email: "sunita@mastercrm.in", roleId: "3", status: "inactive", lastLogin: "2 weeks ago",     initials: "SR" },
];

const emptyUserForm = { name: "", email: "", roleId: "3", status: "active" as "active" | "inactive" };
const emptyRoleForm = { name: "", color: colorOptions[0].value, permissions: [] as Permission[] };

const Users = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [deleteUserTarget, setDeleteUserTarget] = useState<User | null>(null);
  
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState(emptyRoleForm);
  const [deleteRoleTarget, setDeleteRoleTarget] = useState<Role | null>(null);
  
  const { toast } = useToast();

  const getRoleById = (id: string) => roles.find(r => r.id === id);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.roleId === filterRole;
    return matchSearch && matchRole;
  });

  // User handlers
  const openAddUser = () => {
    setEditUser(null);
    setUserForm(emptyUserForm);
    setUserDialogOpen(true);
  };

  const openEditUser = (u: User) => {
    setEditUser(u);
    setUserForm({ name: u.name, email: u.email, roleId: u.roleId, status: u.status });
    setUserDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email) {
      toast({ title: "Missing fields", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    if (editUser) {
      setUsers((prev) => prev.map((u) => u.id === editUser.id ? { ...u, ...userForm } : u));
      toast({ title: "User updated", description: `${userForm.name}'s profile has been saved.` });
    } else {
      const initials = userForm.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      const newUser: User = { id: Date.now().toString(), ...userForm, lastLogin: "Never", initials };
      setUsers((prev) => [...prev, newUser]);
      toast({ title: "User invited", description: `Invitation sent to ${userForm.email}.` });
    }
    setUserDialogOpen(false);
  };

  const handleDeleteUser = () => {
    if (!deleteUserTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteUserTarget.id));
    toast({ title: "User removed", description: `${deleteUserTarget.name} has been removed.`, variant: "destructive" });
    setDeleteUserTarget(null);
  };

  const handleResetPassword = (u: User) => {
    toast({ title: "Password reset sent", description: `Reset link emailed to ${u.email}.` });
  };

  const handleToggleStatus = (u: User) => {
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x));
    toast({ title: `User ${u.status === "active" ? "deactivated" : "activated"}`, description: `${u.name} is now ${u.status === "active" ? "inactive" : "active"}.` });
  };

  // Role handlers
  const openAddRole = () => {
    setEditRole(null);
    setRoleForm(emptyRoleForm);
    setRoleDialogOpen(true);
  };

  const openEditRole = (r: Role) => {
    setEditRole(r);
    setRoleForm({ name: r.name, color: r.color, permissions: [...r.permissions] });
    setRoleDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!roleForm.name) {
      toast({ title: "Missing fields", description: "Role name is required.", variant: "destructive" });
      return;
    }
    if (editRole) {
      setRoles((prev) => prev.map((r) => r.id === editRole.id ? { ...r, ...roleForm } : r));
      toast({ title: "Role updated", description: `${roleForm.name} has been saved.` });
    } else {
      const newRole: Role = { id: Date.now().toString(), ...roleForm };
      setRoles((prev) => [...prev, newRole]);
      toast({ title: "Role created", description: `${roleForm.name} has been added.` });
    }
    setRoleDialogOpen(false);
  };

  const handleDeleteRole = () => {
    if (!deleteRoleTarget) return;
    const usersWithRole = users.filter(u => u.roleId === deleteRoleTarget.id);
    if (usersWithRole.length > 0) {
      toast({ title: "Cannot delete", description: `${usersWithRole.length} users have this role. Reassign them first.`, variant: "destructive" });
      setDeleteRoleTarget(null);
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== deleteRoleTarget.id));
    toast({ title: "Role deleted", description: `${deleteRoleTarget.name} has been removed.`, variant: "destructive" });
    setDeleteRoleTarget(null);
  };

  const togglePermission = (perm: Permission) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const roleCount = (roleId: string) => users.filter((u) => u.roleId === roleId).length;

  return (
    <>
      <AppHeader title="Users & Roles" subtitle={`${users.length} team members · ${roles.length} roles`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Role overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {roles.map((role) => (
                <div key={role.id} className="bg-card rounded-lg border border-border p-3 space-y-1 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterRole(filterRole === role.id ? "all" : role.id)}>
                  <p className="text-xs text-muted-foreground font-medium leading-tight">{role.name}</p>
                  <p className="text-2xl font-bold text-card-foreground">{roleCount(role.id)}</p>
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
                    {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" className="h-9" onClick={openAddUser}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Invite User
              </Button>
            </div>

            {/* Users Table */}
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
                  {filtered.map((user) => {
                    const role = getRoleById(user.roleId);
                    return (
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
                          <Badge variant="outline" className={`text-xs font-medium ${role?.color || ''}`}>
                            <Shield className="w-3 h-3 mr-1" />{role?.name || 'Unknown'}
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
                              <DropdownMenuItem onClick={() => openEditUser(user)}>
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
                              <DropdownMenuItem onClick={() => setDeleteUserTarget(user)} className="text-destructive focus:text-destructive">
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Remove User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">No users found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Manage roles and their permissions</p>
              <Button size="sm" className="h-9" onClick={openAddRole}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Role
              </Button>
            </div>

            <div className="grid gap-4">
              {roles.map((role) => (
                <div key={role.id} className="bg-card rounded-lg border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-sm font-medium ${role.color}`}>
                        <Shield className="w-3.5 h-3.5 mr-1.5" />{role.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{roleCount(role.id)} users</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditRole(role)}>
                        <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteRoleTarget(role)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.length > 0 ? (
                      role.permissions.map((perm) => (
                        <span key={perm} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">{perm}</span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No permissions assigned</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Permissions Matrix */}
            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" /> Permissions Matrix
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-semibold text-muted-foreground py-2 pr-4">Permission</th>
                      {roles.map((r) => <th key={r.id} className="text-center font-semibold text-muted-foreground py-2 px-2 whitespace-nowrap">{r.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSIONS.map((perm) => (
                      <tr key={perm} className="border-b border-border/50 last:border-0">
                        <td className="py-2 pr-4 font-medium text-card-foreground">{perm}</td>
                        {roles.map((r) => (
                          <td key={r.id} className="text-center py-2 px-2">
                            {r.permissions.includes(perm)
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editUser ? "Edit User" : "Invite New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="e.g. Rahul Sharma" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="name@company.in" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={userForm.roleId} onValueChange={(v) => setUserForm({ ...userForm, roleId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {editUser && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={userForm.status} onValueChange={(v) => setUserForm({ ...userForm, status: v as "active" | "inactive" })}>
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
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser}>{editUser ? "Save Changes" : "Send Invite"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirm Dialog */}
      <Dialog open={!!deleteUserTarget} onOpenChange={() => setDeleteUserTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove <strong>{deleteUserTarget?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDeleteUserTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editRole ? "Edit Role" : "Create New Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input placeholder="e.g. Marketing Manager" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Badge Color</Label>
              <Select value={roleForm.color} onValueChange={(v) => setRoleForm({ ...roleForm, color: v })}>
                <SelectTrigger>
                  <SelectValue>
                    <Badge variant="outline" className={roleForm.color}>Preview</Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <Badge variant="outline" className={c.value}>{c.label}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border border-border rounded-md">
                {PERMISSIONS.map((perm) => (
                  <div key={perm} className="flex items-center gap-2">
                    <Checkbox
                      id={perm}
                      checked={roleForm.permissions.includes(perm)}
                      onCheckedChange={() => togglePermission(perm)}
                    />
                    <label htmlFor={perm} className="text-xs text-card-foreground cursor-pointer">{perm}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRole}>{editRole ? "Save Changes" : "Create Role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirm Dialog */}
      <Dialog open={!!deleteRoleTarget} onOpenChange={() => setDeleteRoleTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteRoleTarget?.name}</strong>? Users with this role will need to be reassigned.
          </p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDeleteRoleTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRole}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Users;
