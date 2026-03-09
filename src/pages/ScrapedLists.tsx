import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Trash2, ExternalLink, Loader2, Download } from "lucide-react";

interface ScrapedList {
    id: number;
    name: string;
    location: string;
    total_leads: number;
    excel_file_url: string;
    created_at: string;
}

const ScrapedLists = () => {
    const [lists, setLists] = useState<ScrapedList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchLists = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/scraper/lists");
            if (!response.ok) throw new Error("Failed to fetch lists");
            const data = await response.json();
            setLists(data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to load scraped lists. Is the backend running?",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this list and all its leads?")) return;

        try {
            const response = await fetch(`http://localhost:3000/scraper/lists/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete list");

            toast({
                title: "Deleted",
                description: "The list has been deleted successfully.",
            });
            fetchLists();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete list.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                        <Database className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Saved Scrapes</h1>
                        <p className="text-muted-foreground">Manage and view your extracted Google Maps leads</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Extraction History</CardTitle>
                    <CardDescription>All previously scraped lists are saved here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : lists.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No scraped lists found.</p>
                            <Button asChild className="mt-4" variant="outline">
                                <Link to="/lead-scraper">Start a new Scrape</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Execution Date</TableHead>
                                        <TableHead>Name / Target</TableHead>
                                        <TableHead>Total Leads</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lists.map((list) => (
                                        <TableRow key={list.id}>
                                            <TableCell className="font-medium">
                                                {format(new Date(list.created_at), "MMM d, yyyy HH:mm")}
                                            </TableCell>
                                            <TableCell>{list.name}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                    {list.total_leads} leads
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link to={`/scraped-lists/${list.id}`}>
                                                            <ExternalLink className="w-4 h-4 mr-2" />
                                                            View Leads
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(list.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ScrapedLists;
