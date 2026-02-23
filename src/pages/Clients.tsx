import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { companies } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Download, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Clients = () => {
  const [search, setSearch] = useState("");

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AppHeader title="Clients" subtitle={`${companies.length} companies`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="w-3.5 h-3.5 mr-1.5" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export
            </Button>
            <Button size="sm" className="h-9">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Company
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">City</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Contacts</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">MRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((company) => (
                <TableRow key={company.id} className="cursor-pointer">
                  <TableCell className="font-medium text-sm">{company.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{company.city}</TableCell>
                  <TableCell>
                    <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">
                      {company.product}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{company.contacts}</TableCell>
                  <TableCell>
                    <StatusBadge status={company.status} />
                  </TableCell>
                  <TableCell className="text-sm font-medium text-right">
                    {company.mrr > 0 ? `₹${company.mrr.toLocaleString("en-IN")}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Clients;
