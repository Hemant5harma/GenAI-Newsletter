import 'dotenv/config';
import { db } from "./lib/db";

async function main() {
    console.log("Testing DB Connection...");
    try {
        const brands = await db.brand.findMany();
        console.log("Successfully connected to Postgres. Brands found:", brands.length);
        if (brands.length === 0) {
            console.log("Database is empty (expected for new DB).");
        }
    } catch (e) {
        console.error("Connection failed:", e);
    }
}

main();
