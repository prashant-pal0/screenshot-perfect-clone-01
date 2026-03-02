import AppHeader from "@/components/layout/AppHeader";
import KPICard from "@/components/shared/KPICard";
import { reportData, revenueData } from "@/data/mockData";
import { TrendingUp, Users, IndianRupee, PieChart as PieIcon } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const Reports = () => {
  return (
    <>
      <AppHeader title="Reports" subtitle="Business analytics & insights" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Revenue" value="₹14.4L" change="+12.8% YoY" changeType="positive" icon={IndianRupee} />
          <KPICard title="Active Clients" value="142" change="+13.6% YoY" changeType="positive" icon={Users} />
          <KPICard title="Avg Deal Size" value="₹1.8L" change="+4.2% vs Q3" changeType="positive" icon={TrendingUp} />
          <KPICard title="Churn Rate" value="3.2%" change="-0.8% vs last Q" changeType="positive" icon={PieIcon} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue chart */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Revenue vs Collection</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, undefined]} contentStyle={{ borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" name="Invoiced" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="hsl(152, 69%, 41%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Growth chart */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Client & MRR Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={reportData.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip formatter={(value: number, name: string) => [name === "mrr" ? `₹${value.toLocaleString("en-IN")}` : value, name === "mrr" ? "MRR" : "Clients"]} contentStyle={{ borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="clients" name="Clients" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="mrr" name="MRR" stroke="hsl(152, 69%, 41%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Product */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Revenue by Product</h3>
            <div className="space-y-4">
              {reportData.revenueByProduct.map((p) => (
                <div key={p.product} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-card-foreground">{p.product}</span>
                    <span className="text-muted-foreground">₹{(p.revenue / 100000).toFixed(1)}L · {p.clients} clients</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(p.revenue / 900000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tickets by Priority */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Tickets by Priority</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={reportData.ticketsByPriority} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {reportData.ticketsByPriority.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
