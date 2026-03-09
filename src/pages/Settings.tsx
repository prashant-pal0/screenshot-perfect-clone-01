import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, CreditCard, Bell, Shield, Palette, Save } from "lucide-react";

const Settings = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <AppHeader title="Settings" subtitle="Manage your CRM configuration" />
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="profile"><User className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />Profile</TabsTrigger>
            <TabsTrigger value="billing"><CreditCard className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />Billing</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />Alerts</TabsTrigger>
            <TabsTrigger value="security"><Shield className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />Security</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />Theme</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-card rounded-lg border border-border p-6 max-w-2xl space-y-6">
              <h3 className="text-sm font-semibold text-card-foreground">Profile Information</h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">AK</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>First Name</Label><Input defaultValue="Arjun" /></div>
                <div className="space-y-2"><Label>Last Name</Label><Input defaultValue="Kumar" /></div>
                <div className="space-y-2"><Label>Email</Label><Input defaultValue="arjun@mastercrm.in" type="email" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
                <div className="col-span-2 space-y-2"><Label>Role</Label><Input defaultValue="Super Admin" disabled className="bg-muted" /></div>
              </div>
              <div className="space-y-2"><Label>Bio</Label><Textarea defaultValue="Founder & CEO at Master CRM. Building the best SaaS CRM for Indian businesses." rows={3} /></div>
              <Button onClick={handleSave} size="sm"><Save className="w-3.5 h-3.5 mr-1.5" />{saved ? "Saved!" : "Save Changes"}</Button>
            </div>
          </TabsContent>




          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="bg-card rounded-lg border border-border p-6 max-w-2xl space-y-6">
              <h3 className="text-sm font-semibold text-card-foreground">Billing & Plan</h3>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">Business Pro Plan</p>
                    <p className="text-xs text-muted-foreground mt-1">₹4,999/month · Billed annually</p>
                  </div>
                  <Button variant="outline" size="sm">Upgrade</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan Includes</h4>
                {["Unlimited contacts", "20 user seats", "Priority support", "Custom branding", "API access", "Advanced reports"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-success" />{f}</div>
                ))}
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Method</h4>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-secondary rounded flex items-center justify-center"><CreditCard className="w-4 h-4 text-muted-foreground" /></div>
                    <div><p className="text-sm font-medium">•••• •••• •••• 4242</p><p className="text-xs text-muted-foreground">Expires 12/27</p></div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">Change</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="bg-card rounded-lg border border-border p-6 max-w-2xl space-y-6">
              <h3 className="text-sm font-semibold text-card-foreground">Notification Preferences</h3>
              {[
                { label: "New lead assigned", desc: "Get notified when a new lead is assigned to you", default: true },
                { label: "Subscription expiring", desc: "Alert 30 days before a subscription expires", default: true },
                { label: "Invoice overdue", desc: "Notify when an invoice passes its due date", default: true },
                { label: "Ticket SLA breach", desc: "Alert when a ticket breaches its SLA", default: true },
                { label: "Daily digest email", desc: "Receive a daily summary of CRM activity", default: false },
                { label: "Weekly reports", desc: "Receive weekly performance reports", default: true },
                { label: "Marketing emails", desc: "Product updates and feature announcements", default: false },
              ].map((notif) => (
                <div key={notif.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{notif.label}</p>
                    <p className="text-xs text-muted-foreground">{notif.desc}</p>
                  </div>
                  <Switch defaultChecked={notif.default} />
                </div>
              ))}
              <Button onClick={handleSave} size="sm"><Save className="w-3.5 h-3.5 mr-1.5" />{saved ? "Saved!" : "Save Preferences"}</Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="bg-card rounded-lg border border-border p-6 max-w-2xl space-y-6">
              <h3 className="text-sm font-semibold text-card-foreground">Security Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
                  <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" placeholder="••••••••" /></div>
                </div>
                <Button onClick={handleSave} size="sm">Update Password</Button>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium text-card-foreground">Enable 2FA</p><p className="text-xs text-muted-foreground">Add extra security to your account</p></div>
                  <Switch />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sessions</h4>
                <div className="flex items-center justify-between py-2">
                  <div><p className="text-sm font-medium">Current Session</p><p className="text-xs text-muted-foreground">Chrome · Mumbai, India · Active now</p></div>
                  <span className="text-xs text-success font-medium">Active</span>
                </div>
                <Button variant="outline" size="sm" className="text-destructive">Sign Out All Devices</Button>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="bg-card rounded-lg border border-border p-6 max-w-2xl space-y-6">
              <h3 className="text-sm font-semibold text-card-foreground">Appearance</h3>
              <div className="space-y-3">
                <Label>Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Density</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Date Format</Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Currency</Label>
                <Select defaultValue="inr">
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr">₹ INR</SelectItem>
                    <SelectItem value="usd">$ USD</SelectItem>
                    <SelectItem value="eur">€ EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} size="sm"><Save className="w-3.5 h-3.5 mr-1.5" />{saved ? "Saved!" : "Save Preferences"}</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
