export const companies = [
  { id: "1", name: "TravelMax India", gst: "29AADCT1234A1Z5", city: "Bangalore", product: "Tour CRM", status: "active" as const, contacts: 3, subscriptionEnd: "2026-12-15", mrr: 15000 },
  { id: "2", name: "GoTrip Solutions", gst: "27AAECG5678B2Z1", city: "Mumbai", product: "Travel CRM", status: "active" as const, contacts: 2, subscriptionEnd: "2026-08-20", mrr: 22000 },
  { id: "3", name: "Wanderlust Holidays", gst: "07AABCW9012C3Z4", city: "Delhi", product: "Tour CRM", status: "expiring" as const, contacts: 4, subscriptionEnd: "2026-03-10", mrr: 18000 },
  { id: "4", name: "Voyager Travel Co", gst: "33AACCV3456D4Z7", city: "Chennai", product: "Travel CRM", status: "expired" as const, contacts: 1, subscriptionEnd: "2025-11-30", mrr: 0 },
  { id: "5", name: "Safari Adventures", gst: "06AADCS7890E5Z2", city: "Jaipur", product: "Tour CRM", status: "active" as const, contacts: 2, subscriptionEnd: "2027-04-01", mrr: 12000 },
  { id: "6", name: "BlueSky Tours", gst: "32AABCB1234F6Z8", city: "Kerala", product: "Tour CRM", status: "active" as const, contacts: 3, subscriptionEnd: "2026-09-25", mrr: 25000 },
  { id: "7", name: "Horizon Travels", gst: "24AACCH5678G7Z3", city: "Ahmedabad", product: "Travel CRM", status: "expiring" as const, contacts: 2, subscriptionEnd: "2026-03-22", mrr: 16000 },
  { id: "8", name: "Nomad Experiences", gst: "19AAECN9012H8Z6", city: "Kolkata", product: "Tour CRM", status: "cancelled" as const, contacts: 1, subscriptionEnd: "2025-08-15", mrr: 0 },
];

export const subscriptions = [
  { id: "SUB-001", company: "TravelMax India", product: "Tour CRM", plan: "2 Year", seats: 10, startDate: "2025-01-01", endDate: "2026-12-31", amount: 180000, status: "active" as const },
  { id: "SUB-002", company: "GoTrip Solutions", product: "Travel CRM", plan: "1 Year", seats: 15, startDate: "2025-08-20", endDate: "2026-08-20", amount: 264000, status: "active" as const },
  { id: "SUB-003", company: "Wanderlust Holidays", product: "Tour CRM", plan: "1 Year", seats: 8, startDate: "2025-03-10", endDate: "2026-03-10", amount: 144000, status: "expiring" as const },
  { id: "SUB-004", company: "Voyager Travel Co", product: "Travel CRM", plan: "1 Year", seats: 5, startDate: "2024-12-01", endDate: "2025-11-30", amount: 90000, status: "expired" as const },
  { id: "SUB-005", company: "Safari Adventures", product: "Tour CRM", plan: "3 Year", seats: 6, startDate: "2024-04-01", endDate: "2027-04-01", amount: 324000, status: "active" as const },
  { id: "SUB-006", company: "BlueSky Tours", product: "Tour CRM", plan: "1 Year", seats: 20, startDate: "2025-09-25", endDate: "2026-09-25", amount: 300000, status: "active" as const },
];

export const pipelineDeals = [
  { id: "LEAD-001", company: "EcoTravel Pvt Ltd", contact: "Rahul Sharma", product: "Tour CRM", value: 180000, stage: "inquiry", score: "hot" as const, source: "Website", daysInStage: 2 },
  { id: "LEAD-002", company: "QuickTrips India", contact: "Priya Nair", product: "Travel CRM", value: 96000, stage: "demo", score: "warm" as const, source: "Referral", daysInStage: 5 },
  { id: "LEAD-003", company: "MountainView Tours", contact: "Vikram Singh", product: "Tour CRM", value: 240000, stage: "proposal", score: "hot" as const, source: "Cold Call", daysInStage: 3 },
  { id: "LEAD-004", company: "OceanBreeze Travel", contact: "Anita Desai", product: "Travel CRM", value: 144000, stage: "demo", score: "cold" as const, source: "Social", daysInStage: 12 },
  { id: "LEAD-005", company: "PeakAdventures", contact: "Suresh Menon", product: "Tour CRM", value: 360000, stage: "negotiation", score: "hot" as const, source: "Referral", daysInStage: 4 },
  { id: "LEAD-006", company: "GlobalWings", contact: "Neha Kapoor", product: "Travel CRM", value: 120000, stage: "inquiry", score: "warm" as const, source: "Website", daysInStage: 1 },
  { id: "LEAD-007", company: "Heritage Trails", contact: "Amit Joshi", product: "Tour CRM", value: 200000, stage: "proposal", score: "warm" as const, source: "Cold Call", daysInStage: 7 },
  { id: "LEAD-008", company: "SilkRoute Travel", contact: "Deepa Rao", product: "Travel CRM", value: 168000, stage: "negotiation", score: "hot" as const, source: "Website", daysInStage: 2 },
];

export const pipelineStages = [
  { id: "inquiry", label: "Inquiry", color: "bg-info/10 border-info/30" },
  { id: "demo", label: "Demo", color: "bg-primary/10 border-primary/30" },
  { id: "proposal", label: "Proposal", color: "bg-warning/10 border-warning/30" },
  { id: "negotiation", label: "Negotiation", color: "bg-success/10 border-success/30" },
];

export const recentActivity = [
  { id: 1, type: "subscription", message: "BlueSky Tours renewed for 1 year", time: "2 hours ago" },
  { id: 2, type: "payment", message: "₹1,80,000 received from TravelMax India", time: "4 hours ago" },
  { id: 3, type: "lead", message: "New lead: EcoTravel Pvt Ltd via website", time: "5 hours ago" },
  { id: 4, type: "ticket", message: "Critical ticket #TKT-2026-00142 resolved", time: "6 hours ago" },
  { id: 5, type: "subscription", message: "Wanderlust Holidays subscription expiring in 15 days", time: "8 hours ago" },
  { id: 6, type: "lead", message: "PeakAdventures moved to Negotiation stage", time: "Yesterday" },
];

export const revenueData = [
  { month: "Sep", revenue: 420000, collected: 380000 },
  { month: "Oct", revenue: 480000, collected: 450000 },
  { month: "Nov", revenue: 510000, collected: 470000 },
  { month: "Dec", revenue: 620000, collected: 590000 },
  { month: "Jan", revenue: 550000, collected: 520000 },
  { month: "Feb", revenue: 680000, collected: 610000 },
];

export const invoices = [
  { id: "INV-2026-001", company: "TravelMax India", amount: 180000, issueDate: "2026-01-05", dueDate: "2026-02-05", status: "paid" as const, product: "Tour CRM" },
  { id: "INV-2026-002", company: "GoTrip Solutions", amount: 264000, issueDate: "2026-01-10", dueDate: "2026-02-10", status: "paid" as const, product: "Travel CRM" },
  { id: "INV-2026-003", company: "Wanderlust Holidays", amount: 144000, issueDate: "2026-01-15", dueDate: "2026-02-15", status: "overdue" as const, product: "Tour CRM" },
  { id: "INV-2026-004", company: "BlueSky Tours", amount: 300000, issueDate: "2026-02-01", dueDate: "2026-03-01", status: "pending" as const, product: "Tour CRM" },
  { id: "INV-2026-005", company: "Safari Adventures", amount: 108000, issueDate: "2026-02-10", dueDate: "2026-03-10", status: "pending" as const, product: "Tour CRM" },
  { id: "INV-2026-006", company: "Horizon Travels", amount: 192000, issueDate: "2026-02-15", dueDate: "2026-03-15", status: "draft" as const, product: "Travel CRM" },
  { id: "INV-2026-007", company: "Voyager Travel Co", amount: 90000, issueDate: "2025-10-01", dueDate: "2025-11-01", status: "overdue" as const, product: "Travel CRM" },
  { id: "INV-2026-008", company: "Nomad Experiences", amount: 72000, issueDate: "2025-07-01", dueDate: "2025-08-01", status: "cancelled" as const, product: "Tour CRM" },
];

export const tickets = [
  { id: "TKT-001", company: "TravelMax India", subject: "Unable to generate booking PDF", priority: "high" as const, status: "open" as const, assignee: "Ravi K.", createdAt: "2026-02-28", updatedAt: "2026-03-01" },
  { id: "TKT-002", company: "GoTrip Solutions", subject: "Dashboard loading slow on mobile", priority: "medium" as const, status: "in_progress" as const, assignee: "Priya S.", createdAt: "2026-02-27", updatedAt: "2026-03-01" },
  { id: "TKT-003", company: "Wanderlust Holidays", subject: "Invoice email not delivered", priority: "high" as const, status: "open" as const, assignee: "Unassigned", createdAt: "2026-03-01", updatedAt: "2026-03-01" },
  { id: "TKT-004", company: "BlueSky Tours", subject: "Custom fields not saving properly", priority: "low" as const, status: "resolved" as const, assignee: "Amit J.", createdAt: "2026-02-20", updatedAt: "2026-02-25" },
  { id: "TKT-005", company: "Safari Adventures", subject: "Need API access for external integration", priority: "medium" as const, status: "open" as const, assignee: "Ravi K.", createdAt: "2026-02-26", updatedAt: "2026-02-28" },
  { id: "TKT-006", company: "Horizon Travels", subject: "Bulk import failing with CSV file", priority: "critical" as const, status: "in_progress" as const, assignee: "Priya S.", createdAt: "2026-03-01", updatedAt: "2026-03-02" },
  { id: "TKT-007", company: "Nomad Experiences", subject: "Account reactivation request", priority: "low" as const, status: "closed" as const, assignee: "Amit J.", createdAt: "2026-02-15", updatedAt: "2026-02-18" },
];

export const renewals = [
  { id: "REN-001", company: "Wanderlust Holidays", product: "Tour CRM", plan: "1 Year", seats: 8, expiryDate: "2026-03-10", daysLeft: 8, amount: 144000, status: "urgent" as const },
  { id: "REN-002", company: "Horizon Travels", product: "Travel CRM", plan: "1 Year", seats: 10, expiryDate: "2026-03-22", daysLeft: 20, amount: 192000, status: "upcoming" as const },
  { id: "REN-003", company: "GoTrip Solutions", product: "Travel CRM", plan: "1 Year", seats: 15, expiryDate: "2026-08-20", daysLeft: 171, amount: 264000, status: "scheduled" as const },
  { id: "REN-004", company: "BlueSky Tours", product: "Tour CRM", plan: "1 Year", seats: 20, expiryDate: "2026-09-25", daysLeft: 207, amount: 300000, status: "scheduled" as const },
  { id: "REN-005", company: "TravelMax India", product: "Tour CRM", plan: "2 Year", seats: 10, expiryDate: "2026-12-31", daysLeft: 304, amount: 360000, status: "scheduled" as const },
  { id: "REN-006", company: "Voyager Travel Co", product: "Travel CRM", plan: "1 Year", seats: 5, expiryDate: "2025-11-30", daysLeft: -92, amount: 90000, status: "lapsed" as const },
];

export const reportData = {
  revenueByProduct: [
    { product: "Tour CRM", revenue: 896000, clients: 5 },
    { product: "Travel CRM", revenue: 546000, clients: 3 },
  ],
  monthlyGrowth: [
    { month: "Sep", clients: 125, mrr: 980000 },
    { month: "Oct", clients: 130, mrr: 1040000 },
    { month: "Nov", clients: 134, mrr: 1100000 },
    { month: "Dec", clients: 138, mrr: 1180000 },
    { month: "Jan", clients: 140, mrr: 1220000 },
    { month: "Feb", clients: 142, mrr: 1240000 },
  ],
  ticketsByPriority: [
    { name: "Critical", value: 3, fill: "hsl(0, 72%, 51%)" },
    { name: "High", value: 8, fill: "hsl(38, 92%, 50%)" },
    { name: "Medium", value: 12, fill: "hsl(199, 89%, 48%)" },
    { name: "Low", value: 5, fill: "hsl(152, 69%, 41%)" },
  ],
};
