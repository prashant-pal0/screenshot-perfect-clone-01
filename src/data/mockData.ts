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
