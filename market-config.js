// This file contains the configuration for the market page.
// If you update things in the Admin panel, you can export the new config and paste it here.

window.marketConfig = {
    // List of available currencies for pricing
    currencies: [
        "Coal",
        "Bluesteel",
        "Darksteel",
        "steel",
        "adamantite",
        "vicanite",
        "Logs"
    ],
    // The items you are selling
    items: {
        "Steel": { prices: { "Coal": 1.5, "Bluesteel": 1, "Darksteel": 0.85, "steel": 0, "adamantite": 0.1, "vicanite": 0.3, "Logs": 2.5 }, stock: 100, minPurchase: 1 },
        "Iron": { prices: { "Coal": 0.75, "Bluesteel": 0.5, "Darksteel": 0.42, "steel": 0.5, "adamantite": 0.05, "vicanite": 0.15, "Logs": 1.25 }, stock: 100, minPurchase: 1 },
        "Stone": { prices: { "Coal": 0.6, "Bluesteel": 0.4, "Darksteel": 0.34, "steel": 0.4, "adamantite": 0.04, "vicanite": 0.12, "Logs": 1 }, stock: 100, minPurchase: 1 },
        "Logs": { prices: { "Coal": 0.6, "Bluesteel": 0.4, "Darksteel": 0.34, "steel": 0.4, "adamantite": 0.04, "vicanite": 0.12, "Logs": 0 }, stock: 100, minPurchase: 1 },
        "Copper": { prices: { "Coal": 0.75, "Bluesteel": 0.5, "Darksteel": 0.42, "steel": 0.5, "adamantite": 0.05, "vicanite": 0.15, "Logs": 1.25 }, stock: 100, minPurchase: 1 },
        "Coal": { prices: { "Coal": 0, "Bluesteel": 0.67, "Darksteel": 0.57, "steel": 0.67, "adamantite": 0.07, "vicanite": 0.2, "Logs": 1.68 }, stock: 100, minPurchase: 1 },
        "Meat": { prices: { "Coal": 6, "Bluesteel": 4, "Darksteel": 3.4, "steel": 4, "adamantite": 0.4, "vicanite": 1.2, "Logs": 10 }, stock: 100, minPurchase: 1 },
        "Sulfur": { prices: { "Coal": 0.3, "Bluesteel": 0.2, "Darksteel": 0.17, "steel": 0.2, "adamantite": 0.02, "vicanite": 0.06, "Logs": 0.5 }, stock: 100, minPurchase: 1 },
        "Bluesteel": { prices: { "Coal": 1.5, "Bluesteel": 0, "Darksteel": 0.85, "steel": 1, "adamantite": 0.1, "vicanite": 0.3, "Logs": 2.5 }, stock: 10, minPurchase: 1 },
        "Darksteel": { prices: { "Coal": 1.76, "Bluesteel": 1.18, "Darksteel": 0, "steel": 1.18, "adamantite": 0.12, "vicanite": 0.35, "Logs": 2.95 }, stock: 10, minPurchase: 1 }
    }
};
