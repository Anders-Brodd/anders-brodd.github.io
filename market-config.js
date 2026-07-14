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
        "Steel": { price: 10, currency: "Coal", stock: 100, minPurchase: 1 },
        "Iron": { price: 10, currency: "Coal", stock: 100, minPurchase: 1 },
        "Stone": { price: 10, currency: "Coal", stock: 100, minPurchase: 1 },
        "Logs": { price: 10, currency: "Coal", stock: 100, minPurchase: 1 },
        "Copper": { price: 10, currency: "Coal", stock: 100, minPurchase: 1 },
        "Coal": { price: 10, currency: "steel", stock: 100, minPurchase: 1 },
        "Meat": { price: 10, currency: "Coal", stock: 100, minPurchase: 1 },
        "Sulfur": { price: 10, currency: "Coal", stock: 100, minPurchase: 1 },
        "Bluesteel": { price: 10, currency: "Darksteel", stock: 10, minPurchase: 1 },
        "Darksteel": { price: 10, currency: "Bluesteel", stock: 10, minPurchase: 1 }
    }
};
