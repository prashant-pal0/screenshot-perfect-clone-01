import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, MasterUser, MasterRole } from "@/lib/api";
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
import { Search, Plus, MoreHorizontal, Shield, Edit, Trash2, KeyRound, UserCheck, Settings2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MODULES = [
  "Dashboard", "Clients", "Invoices", "Pipeline", "Tickets",
  "Subscriptions", "Renewals", "Reports", "Users", "Settings"
] as const;

const ACTIONS = ["View", "Create", "Edit", "Delete"] as const;

type Module = typeof MODULES[number];
type Action = typeof ACTIONS[number];
type PermissionKey = `${Module}:${Action}`;

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: PermissionKey[];
}

const allPerms = (): PermissionKey[] => MODULES.flatMap(m => ACTIONS.map(a => `${m}:${a}` as PermissionKey));

const initialRoles: Role[] = [
  { id: "1", name: "Super Admin", description: "Full system access", color: "bg-destructive/10 text-destructive border-destructive/30", permissions: allPerms() },
  { id: "2", name: "Sales Manager", description: "Manages sales team & pipeline", color: "bg-primary/10 text-primary border-primary/30", permissions: ["Dashboard:View", "Clients:View", "Clients:Create", "Clients:Edit", "Invoices:View", "Pipeline:View", "Pipeline:Create", "Pipeline:Edit", "Reports:View"] },
  { id: "3", name: "Sales Rep", description: "Handles leads & clients", color: "bg-info/10 text-info border-info/30", permissions: ["Dashboard:View", "Clients:View", "Clients:Create", "Clients:Edit", "Pipeline:View", "Pipeline:Create", "Pipeline:Edit"] },
  { id: "4", name: "Finance", description: "Invoice & billing management", color: "bg-warning/10 text-warning border-warning/30", permissions: ["Dashboard:View", "Clients:View", "Invoices:View", "Invoices:Create", "Invoices:Edit", "Subscriptions:View", "Renewals:View", "Reports:View"] },
  { id: "5", name: "Support Manager", description: "Manages support team", color: "bg-success/10 text-success border-success/30", permissions: ["Dashboard:View", "Clients:View", "Tickets:View", "Tickets:Create", "Tickets:Edit", "Tickets:Delete", "Reports:View"] },
  { id: "6", name: "Support Agent", description: "Handles customer tickets", color: "bg-secondary text-secondary-foreground border-border", permissions: ["Dashboard:View", "Clients:View", "Tickets:View", "Tickets:Create", "Tickets:Edit"] },
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
  { id: "1", name: "Arjun Kumar", email: "arjun@mastercrm.in", roleId: "1", status: "active", lastLogin: "Just now", initials: "AK" },
  { id: "2", name: "Ravi Krishnan", email: "ravi@mastercrm.in", roleId: "2", status: "active", lastLogin: "2 hours ago", initials: "RK" },
  { id: "3", name: "Priya Sharma", email: "priya@mastercrm.in", roleId: "5", status: "active", lastLogin: "Yesterday", initials: "PS" },
  { id: "4", name: "Amit Joshi", email: "amit@mastercrm.in", roleId: "6", status: "active", lastLogin: "Yesterday", initials: "AJ" },
  { id: "5", name: "Neha Gupta", email: "neha@mastercrm.in", roleId: "3", status: "active", lastLogin: "3 days ago", initials: "NG" },
  { id: "6", name: "Vijay Patel", email: "vijay@mastercrm.in", roleId: "4", status: "active", lastLogin: "1 week ago", initials: "VP" },
  { id: "7", name: "Sunita Rao", email: "sunita@mastercrm.in", roleId: "3", status: "inactive", lastLogin: "2 weeks ago", initials: "SR" },
];

const emptyUserForm = { name: "", email: "", roleId: "", status: "active" as "active" | "inactive", password: "" };
const emptyRoleForm = { name: "", description: "", color: colorOptions[0].value, permissions: [] as PermissionKey[] };

const Users = () => {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<MasterUser | null>(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [deleteUserTarget, setDeleteUserTarget] = useState<MasterUser | null>(null);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<MasterRole | null>(null);
  const [roleForm, setRoleForm] = useState(emptyRoleForm);
  const [deleteRoleTarget, setDeleteRoleTarget] = useState<MasterRole | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: api.getMasterRoles
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.getMasterUsers
  });

  const getRoleById = (id: number) => roles.find((r) => r.id === id);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role_id.toString() === filterRole;
    return matchSearch && matchRole;
  });

  // Mutations
  const mutateUser = useMutation({
    mutationFn: (data: Partial<MasterUser> & { password?: string }) =>
      editUser ? api.updateMasterUser(editUser.id, data) : api.createMasterUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: editUser ? "User updated" : "User created", description: `${userForm.name}'s profile has been saved.` });
      setUserDialogOpen(false);
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const deleteUser = useMutation({
    mutationFn: api.deleteMasterUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: "User removed", description: `User has been removed.`, variant: "destructive" });
      setDeleteUserTarget(null);
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const mutateRole = useMutation({
    mutationFn: (data: Partial<MasterRole>) =>
      editRole ? api.updateMasterRole(editRole.id, data) : api.createMasterRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({ title: editRole ? "Role updated" : "Role created", description: `${roleForm.name} has been saved.` });
      setRoleDialogOpen(false);
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const deleteRole = useMutation({
    mutationFn: api.deleteMasterRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({ title: "Role deleted", description: `Role has been removed.`, variant: "destructive" });
      setDeleteRoleTarget(null);
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  // User handlers
  const openAddUser = () => {
    setEditUser(null);
    setUserForm(emptyUserForm);
    setUserDialogOpen(true);
  };

  const openEditUser = (u: MasterUser) => {
    setEditUser(u);
    setUserForm({ name: u.name, email: u.email, roleId: u.role_id?.toString() || "", status: u.is_active ? "active" : "inactive", password: "" });
    setUserDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email || !userForm.roleId) {
      toast({ title: "Missing fields", description: "Name, email, and role are required.", variant: "destructive" });
      return;
    }
    mutateUser.mutate({
      name: userForm.name,
      email: userForm.email,
      role_id: parseInt(userForm.roleId),
      is_active: userForm.status === "active" ? 1 : 0,
      ...(userForm.password && { password_hash: userForm.password })
    });
  };

  const handleDeleteUser = () => {
    if (!deleteUserTarget) return;
    deleteUser.mutate(deleteUserTarget.id);
  };

  const handleResetPassword = (u: MasterUser) => {
    toast({ title: "Password reset", description: `In a real app, this would send an email to ${u.email}.` });
  };

  const handleToggleStatus = (u: MasterUser) => {
    mutateUser.mutate({ ...u, is_active: u.is_active ? 0 : 1 });
  };

  // Role handlers
  const openAddRole = () => {
    setEditRole(null);
    setRoleForm(emptyRoleForm);
    setRoleDialogOpen(true);
  };

  const openEditRole = (r: MasterRole) => {
    setEditRole(r);
    // Use first color option as fallback since we eliminated color field from backend for simplicity
    setRoleForm({ name: r.name, description: r.description, color: colorOptions[0].value, permissions: r.permissions as PermissionKey[] });
    setRoleDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!roleForm.name) {
      toast({ title: "Missing fields", description: "Role name is required.", variant: "destructive" });
      return;
    }
    mutateRole.mutate({
      name: roleForm.name,
      description: roleForm.description,
      permissions: roleForm.permissions,
      is_active: 1
    });
  };

  const handleDeleteRole = () => {
    if (!deleteRoleTarget) return;
    const usersWithRole = users.filter((u) => u.role_id === deleteRoleTarget.id);
    if (usersWithRole.length > 0) {
      toast({ title: "Cannot delete", description: `${usersWithRole.length} users have this role. Reassign them first.`, variant: "destructive" });
      setDeleteRoleTarget(null);
      return;
    }
    deleteRole.mutate(deleteRoleTarget.id);
  };

  const togglePermission = (perm: PermissionKey) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const toggleModuleAll = (mod: Module) => {
    const modPerms = ACTIONS.map(a => `${mod}:${a}` as PermissionKey);
    const allChecked = modPerms.every(p => roleForm.permissions.includes(p));
    setRoleForm(prev => ({
      ...prev,
      permissions: allChecked
        ? prev.permissions.filter(p => !modPerms.includes(p))
        : [...new Set([...prev.permissions, ...modPerms])]
    }));
  };

  const roleCount = (roleId: number) => users.filter((u) => u.role_id === roleId).length;

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
              {rolesLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-sm rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}
              {roles.map((role) => (
                <div key={role.id} className="bg-card rounded-lg border border-border p-3 space-y-1 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterRole(filterRole === role.id.toString() ? "all" : role.id.toString())}>
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
                    {roles.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" className="h-9" onClick={openAddUser}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Invite User
              </Button>
            </div>

            {/* Users Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden relative min-h-[400px]">
              {usersLoading && (
                <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">Loading users...</p>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">User</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Role</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => {
                    const role = getRoleById(user.role_id);
                    const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs font-medium ${roleOptionsColor(role?.id)}`}>
                            <Shield className="w-3 h-3 mr-1" />{role?.name || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${user.is_active
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-muted text-muted-foreground border-border"
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-success" : "bg-muted-foreground"}`} />
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
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
                                {user.is_active ? "Deactivate" : "Activate"}
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
                  {!usersLoading && filtered.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-10">No users found</TableCell></TableRow>
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

            <div className="grid gap-4 relative min-h-[200px]">
              {rolesLoading && (
                <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">Loading roles...</p>
                </div>
              )}
              {roles.map((role) => (
                <div key={role.id} className="bg-card rounded-lg border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-sm font-medium ${roleOptionsColor(role.id)}`}>
                        <Shield className="w-3.5 h-3.5 mr-1.5" />{role.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{role.description}</span>
                      <span className="text-xs text-muted-foreground">· {roleCount(role.id)} users</span>
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
                  <div className="flex flex-wrap gap-1.5">
                    {MODULES.filter(m => ACTIONS.some(a => role.permissions?.includes(`${m}:${a}` as PermissionKey))).map((mod) => {
                      const modActions = ACTIONS.filter(a => role.permissions?.includes(`${mod}:${a}` as PermissionKey));
                      return (
                        <span key={mod} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                          {mod}: {modActions.join(", ")}
                        </span>
                      );
                    })}
                    {(!role.permissions || role.permissions.length === 0) && (
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
                      <th className="text-left font-semibold text-muted-foreground py-2 pr-4">Module</th>
                      {ACTIONS.map(a => <th key={a} className="text-center font-semibold text-muted-foreground py-2 px-2">{a}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map((mod) => (
                      <tr key={mod} className="border-b border-border/50 last:border-0">
                        <td className="py-2 pr-4 font-medium text-card-foreground">{mod}</td>
                        {ACTIONS.map((action) => {
                          const key = `${mod}:${action}` as PermissionKey;
                          return (
                            <td key={action} className="text-center py-2 px-2">
                              <div className="flex justify-center gap-1 flex-wrap max-w-24 mx-auto">
                                {roles.filter(r => r.permissions?.includes(key)).map(r => (
                                  <span key={r.id} title={r.name} className="w-2 h-2 rounded-full bg-success" />
                                ))}
                              </div>
                            </td>
                          );
                        })}
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
                  {roles.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {!editUser && (
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Temporary password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
              </div>
            )}
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
            <Button variant="outline" onClick={() => setUserDialogOpen(false)} disabled={mutateUser.isPending}>Cancel</Button>
            <Button onClick={handleSaveUser} disabled={mutateUser.isPending}>
              {mutateUser.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editUser ? "Save Changes" : "Create User"}
            </Button>
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
            <Button variant="outline" onClick={() => setDeleteUserTarget(null)} disabled={deleteUser.isPending}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={deleteUser.isPending}>
              {deleteUser.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editRole ? "Edit Role" : "Create New Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input placeholder="e.g. Marketing Manager" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Role for Marketing Manager" value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Permissions</Label>
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left font-semibold text-muted-foreground py-2.5 px-3">Module</th>
                      {ACTIONS.map(a => <th key={a} className="text-center font-semibold text-muted-foreground py-2.5 px-3">{a}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map((mod) => (
                      <tr key={mod} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-medium text-card-foreground">{mod}</td>
                        {ACTIONS.map((action) => {
                          const key = `${mod}:${action}` as PermissionKey;
                          return (
                            <td key={action} className="text-center py-2.5 px-3">
                              <Checkbox
                                checked={roleForm.permissions.includes(key)}
                                onCheckedChange={() => togglePermission(key)}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)} disabled={mutateRole.isPending}>Cancel</Button>
            <Button onClick={handleSaveRole} disabled={mutateRole.isPending}>
              {mutateRole.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editRole ? "Save Changes" : "Create Role"}
            </Button>
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
            <Button variant="outline" onClick={() => setDeleteRoleTarget(null)} disabled={deleteRole.isPending}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRole} disabled={deleteRole.isPending}>
              {deleteRole.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper for generic role colors
function roleOptionsColor(id?: number) {
  if (!id) return colorOptions[0].value;
  return colorOptions[id % colorOptions.length].value;
}

export default Users;
