import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Zap, Download, Database, Loader2 } from "lucide-react";

const LeadData = () => {
    const [html, setHtml] = useState("");
    const [location, setLocation] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastResult, setLastResult] = useState<{ totalLeads: number } | null>(null);
    const { toast } = useToast();

    const handleProcessLeads = async () => {
        if (!html.trim()) {
            toast({
                title: "Error",
                description: "Please paste some HTML content first.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch("http://localhost:3000/scraper/scrape-html", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ html, location }),
            });

            if (!response.ok) {
                throw new Error("Failed to process leads");
            }

            // The response is a blob (Excel file)
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `leads_${location || 'export'}_${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Success",
                description: "Leads processed and Excel file downloaded.",
            });

            setLastResult({ totalLeads: 0 }); // Placeholder
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to process leads. Please ensure the backend is running.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-5xl animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                        <Database className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Lead Data Intelligence</h1>
                        <p className="text-muted-foreground">Transform Google Maps HTML into structured business leads</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium">System Ready</span>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-primary/10 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                Data Input Module
                            </CardTitle>
                            <CardDescription>
                                Securely paste your extracted HTML content below for high-fidelity processing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium px-1">Source Label / Location (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. New York Restaurants, Dubai Real Estate..."
                                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium px-1">HTML Content Payload</label>
                                <Textarea
                                    placeholder="Paste <html> source code here..."
                                    className="min-h-[350px] font-mono text-xs bg-muted/30 focus:bg-background transition-all border-border/60 resize-none"
                                    value={html}
                                    onChange={(e) => setHtml(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <div className="text-xs text-muted-foreground italic px-1">
                                    {html.length > 0 ? `${(html.length / 1024).toFixed(1)} KB content detected` : 'No data loaded'}
                                </div>
                                <Button
                                    onClick={handleProcessLeads}
                                    disabled={isProcessing}
                                    className="gap-2 px-10 py-6 text-lg font-bold shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all bg-primary hover:bg-primary/90"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Processing Intelligence...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Generate High-Fidelity Excel
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {lastResult && (
                        <Card className="bg-primary/5 border-primary/20 border-dashed animate-in slide-in-from-bottom-5 duration-500">
                            <CardContent className="py-8 flex items-center justify-center text-center">
                                <div className="space-y-2">
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Download className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-primary">Leads Extracted Successfully!</h2>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        Your premium dataset has been generated. The download has been initiated automatically.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="border-border/50 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Workflow Guide</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2">
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">1</div>
                                <h3 className="font-semibold text-sm mb-1">Search & Load</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">Search on Google Maps and scroll until all desired results are visible in the left sidebar.</p>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">2</div>
                                <h3 className="font-semibold text-sm mb-1">Extract Node</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">Right-click the list, 'Inspect', find the &lt;div role="feed"&gt; and Copy Outer HTML.</p>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">3</div>
                                <h3 className="font-semibold text-sm mb-1">Process Data</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">Paste the payload here. Our AI engine will clean and structure the data into a professional Excel sheet.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
                        <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            Data Integrity
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            This module extracts names, addresses, ratings, review counts, phone numbers, and websites (with auto-UTM tracking) directly from the source.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadData;
