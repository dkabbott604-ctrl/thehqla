import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../../data");
function readJson(file) {
    return JSON.parse(readFileSync(resolve(DATA_DIR, file), "utf-8"));
}
function writeJson(file, data) {
    writeFileSync(resolve(DATA_DIR, file), JSON.stringify(data, null, 2) + "\n", "utf-8");
}
const server = new McpServer({
    name: "thehqla-content",
    version: "1.0.0",
});
// ── Flower tools ──────────────────────────────────────────────────────────────
server.tool("get_flower_listings", "Get all flower listings", {}, () => {
    const flowers = readJson("flowers.json");
    return { content: [{ type: "text", text: JSON.stringify(flowers, null, 2) }] };
});
server.tool("add_flower_listing", "Add a new flower listing to the site", {
    tag: z.string().describe("Category tag (e.g. 'Top Shelf', 'Seasonal')"),
    name: z.string().describe("Name of the listing"),
    description: z.string().describe("Description text"),
}, ({ tag, name, description }) => {
    const flowers = readJson("flowers.json");
    const newId = String(Math.max(0, ...flowers.map((f) => Number(f.id))) + 1);
    flowers.push({ id: newId, tag, name, description });
    writeJson("flowers.json", flowers);
    return { content: [{ type: "text", text: `Added listing "${name}" with id ${newId}.` }] };
});
server.tool("update_flower_listing", "Update an existing flower listing by id", {
    id: z.string().describe("Id of the listing to update"),
    tag: z.string().optional().describe("New tag"),
    name: z.string().optional().describe("New name"),
    description: z.string().optional().describe("New description"),
}, ({ id, tag, name, description }) => {
    const flowers = readJson("flowers.json");
    const idx = flowers.findIndex((f) => f.id === id);
    if (idx === -1) {
        return { content: [{ type: "text", text: `Listing with id ${id} not found.` }], isError: true };
    }
    if (tag !== undefined)
        flowers[idx].tag = tag;
    if (name !== undefined)
        flowers[idx].name = name;
    if (description !== undefined)
        flowers[idx].description = description;
    writeJson("flowers.json", flowers);
    return { content: [{ type: "text", text: `Updated listing id ${id}.` }] };
});
server.tool("remove_flower_listing", "Remove a flower listing by id", { id: z.string().describe("Id of the listing to remove") }, ({ id }) => {
    const flowers = readJson("flowers.json");
    const filtered = flowers.filter((f) => f.id !== id);
    if (filtered.length === flowers.length) {
        return { content: [{ type: "text", text: `Listing with id ${id} not found.` }], isError: true };
    }
    writeJson("flowers.json", filtered);
    return { content: [{ type: "text", text: `Removed listing id ${id}.` }] };
});
// ── Review tools ──────────────────────────────────────────────────────────────
server.tool("get_reviews", "Get all customer reviews", {}, () => {
    const reviews = readJson("reviews.json");
    return { content: [{ type: "text", text: JSON.stringify(reviews, null, 2) }] };
});
server.tool("add_review", "Add a new customer review", {
    stars: z.number().int().min(1).max(5).describe("Star rating (1-5)"),
    text: z.string().describe("Review text"),
    reviewer: z.string().describe("Reviewer name / location"),
}, ({ stars, text, reviewer }) => {
    const reviews = readJson("reviews.json");
    const newId = String(Math.max(0, ...reviews.map((r) => Number(r.id))) + 1);
    reviews.push({ id: newId, stars, text, reviewer });
    writeJson("reviews.json", reviews);
    return { content: [{ type: "text", text: `Added review id ${newId} from ${reviewer}.` }] };
});
server.tool("remove_review", "Remove a review by id", { id: z.string().describe("Id of the review to remove") }, ({ id }) => {
    const reviews = readJson("reviews.json");
    const filtered = reviews.filter((r) => r.id !== id);
    if (filtered.length === reviews.length) {
        return { content: [{ type: "text", text: `Review with id ${id} not found.` }], isError: true };
    }
    writeJson("reviews.json", filtered);
    return { content: [{ type: "text", text: `Removed review id ${id}.` }] };
});
// ── Hours tools ───────────────────────────────────────────────────────────────
server.tool("get_hours", "Get current business hours", {}, () => {
    const hours = readJson("hours.json");
    return { content: [{ type: "text", text: JSON.stringify(hours, null, 2) }] };
});
server.tool("update_hours", "Update business hours for a day group", {
    day: z.enum(["monday_friday", "saturday", "sunday"]).describe("Which day group to update"),
    open: z.string().describe("Opening time (e.g. '10am')"),
    close: z.string().describe("Closing time (e.g. '9pm')"),
}, ({ day, open, close }) => {
    const hours = readJson("hours.json");
    hours[day].open = open;
    hours[day].close = close;
    writeJson("hours.json", hours);
    return { content: [{ type: "text", text: `Updated hours for ${day}: ${open} – ${close}.` }] };
});
// ── Start server ──────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
