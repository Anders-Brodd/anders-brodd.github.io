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
        "wood"
    ],
    // The items you are selling
    items: {
        "Steel": { prices: { "Coal": 10, "Bluesteel": 0, "Darksteel": 0, "steel": 0, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 100, minPurchase: 1 },
        "Iron": { prices: { "Coal": 10, "Bluesteel": 0, "Darksteel": 0, "steel": 0, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 100, minPurchase: 1 },
        "Stone": { prices: { "Coal": 10, "Bluesteel": 0, "Darksteel": 0, "steel": 0, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 100, minPurchase: 1 },
        "Logs": { prices: { "Coal": 10, "Bluesteel": 0, "Darksteel": 0, "steel": 0, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 100, minPurchase: 1 },
        "Copper": { prices: { "Coal": 10, "Bluesteel": 0, "Darksteel": 0, "steel": 0, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 100, minPurchase: 1 },
        "Coal": { prices: { "Coal": 0, "Bluesteel": 0, "Darksteel": 0, "steel": 10, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 100, minPurchase: 1 },
        "Meat": { prices: { "Coal": 10, "Bluesteel": 0, "Darksteel": 0, "steel": 0, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 100, minPurchase: 1 },
        "Sulfur": { prices: { "Coal": 10, "Bluesteel": 0, "Darksteel": 0, "steel": 0, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 100, minPurchase: 1 },
        "Bluesteel": { prices: { "Coal": 0, "Bluesteel": 0, "Darksteel": 10, "steel": 0, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 10, minPurchase: 1 },
        "Darksteel": { prices: { "Coal": 0, "Bluesteel": 10, "Darksteel": 0, "steel": 0, "adamantite": 0, "vicanite": 0, "wood": 0 }, stock: 10, minPurchase: 1 }
    }
};
