import { db } from "@/lib/db";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const issue = await db.issue.findUnique({
        where: { id: params.id },
        include: { brand: true }
    });

    if (!issue) {
        return new Response("Issue not found", { status: 404 });
    }

    // Use AI-generated HTML directly, or show placeholder
    const html = issue.htmlContent || `
<!DOCTYPE html>
<html>
<head><title>No Content</title></head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
    <h1>Newsletter Not Generated</h1>
    <p>This issue doesn't have HTML content yet.</p>
</body>
</html>`;

    return new Response(html, {
        headers: { "Content-Type": "text/html" },
    });
}
