import AppHeader from "@/components/layout/AppHeader";
import KPICard from "@/components/shared/KPICard";
import { Building2, CreditCard, Target, IndianRupee, AlertTriangle, LifeBuoy } from "lucide-react";
import { revenueData, recentActivity } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  return (
    <>
      <AppHeader title="Dashboard" subtitle="Welcome back, Arjun" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Active Clients"
            value="142"
            change="+8 this month"
            changeType="positive"
            icon={Building2}
          />
          <KPICard
            title="Active Subscriptions"
            value="186"
            change="+12 this month"
            changeType="positive"
            icon={CreditCard}
          />
          <KPICard
            title="MRR"
            value="₹12.4L"
            change="+6.2% vs last month"
            changeType="positive"
            icon={IndianRupee}
          />
          <KPICard
            title="Pipeline Value"
            value="₹15.1L"
            change="18 active deals"
            changeType="neutral"
            icon={Target}
          />
          <KPICard
            title="Expiring Soon"
            value="7"
            change="₹4.2L at risk"
            changeType="negative"
            icon={AlertTriangle}
          />
          <KPICard
            title="Open Tickets"
            value="23"
            change="3 SLA breached"
            changeType="negative"
            icon={LifeBuoy}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, undefined]}
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)", fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" name="Invoiced" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="hsl(152, 69%, 41%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-card-foreground leading-snug">{item.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
