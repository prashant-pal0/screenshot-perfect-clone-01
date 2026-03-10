import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Star, MapPin, Globe, Phone } from "lucide-react";

interface ScrapedLead {
    id: number;
    name: string;
    rating: number;
    review_count: number;
    category: string;
    address: string;
    contact_no: string;
    website: string;
    google_maps_link: string;
    status: string;
}

interface ListDetail {
    id: number;
    name: string;
    location: string;
    total_leads: number;
    leads: ScrapedLead[];
}

const ScrapedListDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [list, setList] = useState<ListDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchListDetail = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/scraper/lists/${id}/leads`);
                if (!response.ok) throw new Error("Failed to fetch list details");
                const data = await response.json();
                setList(data);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Failed to load list details.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchListDetail();
        }
    }, [id, toast]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!list) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">List not found</h2>
                <Button asChild>
                    <Link to="/scraped-lists">Back to Lists</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 animate-in fade-in duration-700 max-w-[1400px]">
            <div className="mb-6 flex items-center gap-4">
                <Button asChild variant="ghost" size="icon">
                    <Link to="/scraped-lists">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{list.name}</h1>
                    <p className="text-muted-foreground text-sm">Target: {list.location} • {list.total_leads} Extracted Leads</p>
                </div>
            </div>

            <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-lg flex justify-between items-center">
                        Extracted Data Table
                        <span className="text-sm font-normal text-muted-foreground bg-background px-3 py-1 rounded-full border">
                            {list.leads?.length || 0} Records
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="min-w-[250px] font-semibold">Business Name</TableHead>
                                    <TableHead className="min-w-[100px] font-semibold">Status</TableHead>
                                    <TableHead className="min-w-[100px] font-semibold"><Star className="w-4 h-4 inline mr-1 text-yellow-500" /> Rating</TableHead>
                                    <TableHead className="min-w-[150px] font-semibold">Category</TableHead>
                                    <TableHead className="min-w-[300px] font-semibold"><MapPin className="w-4 h-4 inline mr-1 text-blue-500" /> Address</TableHead>
                                    <TableHead className="min-w-[150px] font-semibold"><Phone className="w-4 h-4 inline mr-1 text-green-500" /> Phone</TableHead>
                                    <TableHead className="min-w-[200px] font-semibold"><Globe className="w-4 h-4 inline mr-1 text-purple-500" /> Web Links</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {list.leads?.map((lead) => (
                                    <TableRow key={lead.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium align-top">
                                            {lead.name}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                                                ${lead.status?.toLowerCase() === 'hot' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    lead.status?.toLowerCase() === 'cold' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                        'bg-green-100 text-green-700 border border-green-200'}`}>
                                                {lead.status || 'New'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            {lead.rating ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold">{lead.rating}</span>
                                                    <span className="text-xs text-muted-foreground">({lead.review_count})</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="align-top text-sm">
                                            <span className="bg-secondary px-2 py-1 rounded-md text-xs">
                                                {lead.category || 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="align-top text-xs text-muted-foreground">
                                            {lead.address || 'N/A'}
                                        </TableCell>
                                        <TableCell className="align-top text-sm font-medium">
                                            {lead.contact_no ? (
                                                <a href={`tel:${lead.contact_no}`} className="hover:text-primary hover:underline">
                                                    {lead.contact_no}
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col gap-2 text-xs">
                                                {lead.website && (
                                                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[200px] inline-block">
                                                        Visit Website
                                                    </a>
                                                )}
                                                {lead.google_maps_link && (
                                                    <a href={lead.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline truncate max-w-[200px] inline-block">
                                                        View on Maps
                                                    </a>
                                                )}
                                                {!lead.website && !lead.google_maps_link && (
                                                    <span className="text-muted-foreground italic">No links available</span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {list.leads?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            No leads found in this list.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ScrapedListDetail;
