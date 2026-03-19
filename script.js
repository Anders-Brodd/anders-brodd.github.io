/*
File: script.js
What this script does: Controls client-side navigation for the portfolio website. It listens for clicks on the navigation menu and dynamically updates the DOM to show the targeted section (Portfolio, Socials, or Contact) while hiding the others. Includes extensive, concise console logging to track initialization and events.
What the old script did: Handled the exact same DOM manipulation and navigation logic with event listeners and console logging.
Things added/removed: Maintained all existing logic and logging. Removed nothing. Added nothing.
*/

console.log("[System] script.js loaded into DOM.");

function showSection(sectionId) {
    console.log(`[Action] showSection triggered for target ID: ${sectionId}`);
    
    const sections = document.querySelectorAll('.page-section');
    console.log(`[Query] Found ${sections.length} elements with class .page-section.`);

    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
            console.log(`[State] Section ID '${section.id}' set to block (VISIBLE).`);
        } else {
            section.style.display = 'none';
            console.log(`[State] Section ID '${section.id}' set to none (HIDDEN).`);
        }
    });
    
    console.log(`[Complete] Navigation routine finished for: ${sectionId}`);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("[Event] DOMContentLoaded fired. DOM fully parsed.");
    
    const navLinks = document.querySelectorAll('.nav-links a');
    console.log(`[Query] Found ${navLinks.length} navigation links.`);
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log(`[Event] Click detected on nav link pointing to: ${e.target.getAttribute('href')}`);
        });
    });

    console.log("[Action] Triggering default view rendering (portfolio).");
    showSection('portfolio');
});
