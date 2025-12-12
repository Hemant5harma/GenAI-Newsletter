'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateNewsletterForBrand } from "@/lib/generator";

export async function generateIssueAction(formData: FormData) {
    const brandId = formData.get("brandId") as string;
    if (!brandId) throw new Error("Brand ID is required");

    const issueId = await generateNewsletterForBrand(brandId);
    revalidatePath(`/dashboard/brands/${brandId}`);
    redirect(`/dashboard/issues/${issueId}`);
}

interface BlockData {
    id: string;
    title: string | null;
    content: string | null;
    linkUrl: string | null;
    imageUrl: string | null;
    ctaText: string | null;
}

interface UpdateIssueData {
    issueId: string;
    subject: string;
    preheader: string;
    blocks: BlockData[];
    htmlContent?: string;
}

export async function updateIssueJson(data: UpdateIssueData) {
    const { issueId, subject, preheader, blocks, htmlContent } = data;

    // Update issue metadata
    const updateData: any = { subject, preheader };
    if (htmlContent !== undefined) {
        updateData.htmlContent = htmlContent;
    }

    await db.issue.update({
        where: { id: issueId },
        data: updateData
    });

    // Get existing blocks
    const existingBlocks = await db.contentBlock.findMany({
        where: { issueId }
    });

    const existingIds = new Set(existingBlocks.map(b => b.id));
    const newIds = new Set(blocks.map(b => b.id));

    // Delete removed blocks
    const idsToDelete = [...existingIds].filter(id => !newIds.has(id));
    if (idsToDelete.length > 0) {
        await db.contentBlock.deleteMany({
            where: { id: { in: idsToDelete } }
        });
    }

    // Update or create blocks
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (existingIds.has(block.id)) {
            // Update existing block
            await db.contentBlock.update({
                where: { id: block.id },
                data: {
                    title: block.title,
                    content: block.content,
                    linkUrl: block.linkUrl,
                    imageUrl: block.imageUrl,
                    ctaText: block.ctaText,
                    order: i
                }
            });
        } else {
            // Create new block (shouldn't normally happen with current editor, but good to handle)
            // Skip creation here - new blocks should be added via separate action
        }
    }

    revalidatePath(`/dashboard/issues/${issueId}`);
    return { success: true };
}

export async function updateBrandSettings(brandId: string, settings: any) {
    await db.brand.update({
        where: { id: brandId },
        data: { settings: JSON.parse(JSON.stringify(settings)) }
    });

    revalidatePath(`/dashboard/brands/${brandId}`);
    revalidatePath(`/dashboard/brands/${brandId}/settings`);
    return { success: true };
}

export async function createBrand(formData: FormData) {
    const name = formData.get("name") as string;
    const domain = formData.get("domain") as string;
    const category = formData.get("category") as string;
    const tone = formData.get("tone") as string;
    const audience = formData.get("audience") as string;
    const description = formData.get("description") as string | null;
    const tagline = formData.get("tagline") as string | null;

    if (!name || !domain || !category || !tone || !audience) {
        throw new Error("Required fields are missing");
    }

    let user = await db.user.findFirst();
    if (!user) {
        user = await db.user.create({
            data: { email: "demo@example.com", name: "Demo User" }
        });
    }

    const brand = await db.brand.create({
        data: {
            name, domain, category, tone, audience,
            description: description || null,
            tagline: tagline || null,
            userId: user.id
        }
    });

    revalidatePath("/dashboard");
    redirect(`/dashboard/brands/${brand.id}`);
}

export async function deleteIssueAction(issueId: string, brandId: string) {
    await db.issue.delete({
        where: { id: issueId }
    });

    revalidatePath(`/dashboard/brands/${brandId}`);
    return { success: true };
}
