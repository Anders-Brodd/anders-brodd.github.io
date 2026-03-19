/*
File: script.js
Description: This script controls the client-side navigation for the portfolio website. It listens for clicks on the navigation menu and dynamically updates the DOM to show the targeted section (Portfolio, Socials, or Contact) while hiding the others. It includes detailed console logging to track the initialization state and navigation events.
*/

console.log("[Init] script.js loaded into DOM.");

function showSection(sectionId) {
    console.log(`[Nav] Request received to display section ID: ${sectionId}`);
    
    const sections = document.querySelectorAll('.page-section');
    console.log(`[Nav] Located ${sections.length} page sections in DOM.`);

    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
            console.log(`[Nav] State updated: Section ID ${section.id} is now VISIBLE.`);
        } else {
            section.style.display = 'none';
            console.log(`[Nav] State updated: Section ID ${section.id} is now HIDDEN.`);
        }
    });
    
    console.log(`[Nav] Navigation routine completed for target: ${sectionId}`);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("[Init] DOM fully parsed and loaded.");
    console.log("[Init] Triggering default view rendering.");
    showSection('portfolio');
});
