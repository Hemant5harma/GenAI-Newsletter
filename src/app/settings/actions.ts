'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAiSettings() {
    // Get or create default user (for MVP, single user mode)
    let user = await db.user.findFirst({
        include: { aiSettings: true }
    });

    if (!user) {
        user = await db.user.create({
            data: { email: "demo@example.com", name: "Demo User" },
            include: { aiSettings: true }
        });
    }

    return user.aiSettings;
}

export async function saveAiSettings(data: { googleApiKey: string; model: string }) {
    // Get or create default user
    let user = await db.user.findFirst();

    if (!user) {
        user = await db.user.create({
            data: { email: "demo@example.com", name: "Demo User" }
        });
    }

    // Upsert AI settings
    const settings = await db.aiSettings.upsert({
        where: { userId: user.id },
        update: {
            googleApiKey: data.googleApiKey,
            model: data.model
        },
        create: {
            userId: user.id,
            googleApiKey: data.googleApiKey,
            model: data.model
        }
    });

    revalidatePath('/settings');
    return { success: true, settings };
}
