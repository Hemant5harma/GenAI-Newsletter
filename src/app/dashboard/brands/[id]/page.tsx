import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateIssueAction, deleteBrandAction } from "@/app/actions";
import DeleteIssueButton from "@/components/DeleteIssueButton";
import GenerateIssueButton from "@/components/GenerateIssueButton";
import DeleteBrandButton from "@/components/DeleteBrandButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Inbox, ArrowRight, FileText, Send, Edit3, MoreHorizontal, Trash2 } from "lucide-react";

interface Issue {
    id: string;
    subject: string | null;
    status: string;
    generatedAt: Date;
}

export default async function BrandDashboard(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const brand = await db.brand.findUnique({
        where: { id: params.id },
        include: {
            issues: {
                orderBy: { generatedAt: 'desc' },
                take: 20
            }
        }
    });

    if (!brand) {
        notFound();
    }

    const issues = brand.issues as Issue[];
    const draftCount = issues.filter((i: Issue) => i.status === 'DRAFT').length;
    const sentCount = issues.filter((i: Issue) => i.status === 'SENT').length;

    const statusVariants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
        DRAFT: 'secondary',
        GENERATING: 'default',
        APPROVED: 'success',
        SENT: 'success',
        FAILED: 'destructive'
    };

    return (
        <div className="p-6 max-w-6xl mx-auto animate-fade-in">
            {/* Brand Header Card */}
            <Card className="mb-6 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{brand.name}</h1>
                                <Badge variant="default" className="bg-primary/10 text-primary border-0">
                                    {brand.category}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-4">
                                {brand.tagline || brand.audience || 'AI-powered newsletter generation'}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Button asChild variant="outline" size="sm" className="gap-2">
                                    <Link href={`/dashboard/brands/${brand.id}/settings`}>
                                        <Settings size={14} /> Settings
                                    </Link>
                                </Button>
                                <DeleteBrandButton
                                    brandId={brand.id}
                                    brandName={brand.name}
                                    deleteAction={deleteBrandAction}
                                />
                            </div>
                        </div>

                        <GenerateIssueButton
                            brandId={brand.id}
                            generateAction={generateIssueAction}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="text-center py-6">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <FileText size={18} className="text-primary" />
                        </div>
                        <div className="text-3xl font-bold">{issues.length}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Total</div>
                    </div>
                </Card>
                <Card className="text-center py-6">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                            <Edit3 size={18} className="text-amber-500" />
                        </div>
                        <div className="text-3xl font-bold">{draftCount}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Drafts</div>
                    </div>
                </Card>
                <Card className="text-center py-6">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                            <Send size={18} className="text-emerald-500" />
                        </div>
                        <div className="text-3xl font-bold">{sentCount}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Sent</div>
                    </div>
                </Card>
            </div>

            {/* Issues List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
                    <CardTitle className="text-lg font-semibold">Recent Issues</CardTitle>
                    <Badge variant="secondary" className="font-normal">
                        {issues.length} total
                    </Badge>
                </CardHeader>

                <Separator />

                {issues.length === 0 ? (
                    <CardContent className="py-16 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                            <Inbox size={28} className="text-muted-foreground/50" />
                        </div>
                        <p className="font-medium mb-1">No newsletters yet</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Click &quot;Generate New Issue&quot; to create your first AI newsletter
                        </p>
                    </CardContent>
                ) : (
                    <div>
                        {issues.map((issue: Issue, index: number) => (
                            <div
                                key={issue.id}
                                className={`group flex items-center gap-4 px-6 py-4 hover:bg-accent/30 transition-colors ${index < issues.length - 1 ? 'border-b border-border' : ''
                                    }`}
                            >
                                <Link
                                    href={`/dashboard/issues/${issue.id}`}
                                    className="flex items-center gap-4 flex-1 min-w-0"
                                >
                                    {/* Issue Icon */}
                                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                                        <FileText size={18} className="text-muted-foreground" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className={`font-medium mb-0.5 truncate ${issue.subject ? 'text-foreground' : 'text-muted-foreground italic'
                                            }`}>
                                            {issue.subject || 'Untitled Draft'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {issue.generatedAt.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>

                                    <Badge variant={statusVariants[issue.status] || 'secondary'}>
                                        {issue.status}
                                    </Badge>

                                    <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hide-mobile" />
                                </Link>

                                <DeleteIssueButton issueId={issue.id} brandId={brand.id} />
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
