const REPO_CONFIG = Object.freeze({
    owner: "Anders-Brodd",
    repo: "anders-brodd.github.io",
    branch: "main",
    contentPath: "content.json",
    projectAssetDir: "media/projects",
    photoAssetDir: "media/photos"
});

const DEFAULT_CONTENT = {
    profile: {
        introHeading: "Hello, I'm Anders Brodd",
        introText: "A web and game developer with photography on the side."
    },
    sections: {
        development: true,
        photography: true,
        socials: true,
        contact: true
    },
    projects: [
        {
            id: "project-private-kitty",
            title: "Private Kitty",
            summary: "Custom e-commerce work shaped around a smoother shopping flow.",
            details: "Designed, developed, and customized the storefront to feel polished, clear, and easier to move through.",
            url: "https://www.privatekitty.com/",
            cta: "Visit site",
            image: "",
            imageAlt: "Private Kitty project preview",
            tags: ["E-commerce", "Customization", "UX"]
        },
        {
            id: "project-mountain-architect",
            title: "Mountain Architect",
            summary: "A custom Roblox game built around your own world and systems.",
            details: "A space for level ideas, gameplay direction, progress screenshots, and the key systems you want to highlight as the project evolves.",
            url: "",
            cta: "See details",
            image: "",
            imageAlt: "Mountain Architect project preview",
            tags: ["Roblox", "Game design", "Custom build"]
        },
        {
            id: "project-the-little-cottage",
            title: "The Little Cottage",
            summary: "A client website designed and developed to feel warm, simple, and easy to trust.",
            details: "Use this slot for a clean recap of the visual direction, what you built, and the problem the site solved for the client.",
            url: "https://www.thelittlecottage.com/",
            cta: "Visit site",
            image: "",
            imageAlt: "The Little Cottage project preview",
            tags: ["Client work", "Web design", "Front end"]
        }
    ],
    photos: [
        {
            id: "photo-stillness-at-dawn",
            title: "Stillness at Dawn",
            caption: "Replace this placeholder with one of your own uploads and a short line about the scene.",
            location: "Add a location",
            accent: "Morning frost",
            image: "",
            imageAlt: "Winter photography placeholder"
        },
        {
            id: "photo-frozen-path",
            title: "Frozen Path",
            caption: "Use the admin panel to add photography notes, image uploads, and whatever context you want beside the shot.",
            location: "Add a location",
            accent: "Blue hour",
            image: "",
            imageAlt: "Winter photography placeholder"
        },
        {
            id: "photo-soft-snowline",
            title: "Soft Snowline",
            caption: "This section is ready for your actual images so the page feels personal instead of generic.",
            location: "Add a location",
            accent: "Fresh snowfall",
            image: "",
            imageAlt: "Winter photography placeholder"
        }
    ],
    socials: [
        {
            id: "social-github",
            label: "GitHub",
            value: "Anders-Brodd",
            url: "https://github.com/Anders-Brodd"
        },
        {
            id: "social-discord",
            label: "Discord",
            value: "Andersbrodd",
            url: "https://discord.com/users/Andersbrodd"
        }
    ],
    contact: {
        heading: "Let us build something crisp and useful.",
        email: "Andersbrodd@icloud.com",
        note: "Available for website work, digital product ideas, and photography collaborations.",
        location: "Based in Sweden",
        availability: "Open for freelance and collaboration"
    }
};

const state = {
    content: deepClone(DEFAULT_CONTENT),
    adminDraft: deepClone(DEFAULT_CONTENT),
    githubToken: "",
    githubUser: null,
    revealObserver: null,
    uploads: {
        project: new Map(),
        photo: new Map()
    }
};

const dom = {};

document.addEventListener("DOMContentLoaded", async () => {
    cacheDom();
    bindEvents();
    seedSnow("hero", 22);
    seedSnow("footer", 10);
    requestAnimationFrame(() => {
        document.body.classList.add("has-animations");
    });
    await loadContent();
});

function cacheDom() {
    dom.introHeading = document.getElementById("intro-heading");
    dom.introText = document.getElementById("intro-text");
    dom.developmentSection = document.getElementById("development");
    dom.photographySection = document.getElementById("photography");
    dom.connectSection = document.getElementById("connect");
    dom.connectGrid = document.getElementById("connect-grid");
    dom.projectsList = document.getElementById("projects-list");
    dom.photosList = document.getElementById("photos-list");
    dom.socialsList = document.getElementById("socials-list");
    dom.contactHeading = document.getElementById("contact-heading");
    dom.contactEmail = document.getElementById("contact-email");
    dom.contactNote = document.getElementById("contact-note");
    dom.contactLocation = document.getElementById("contact-location");
    dom.contactAvailability = document.getElementById("contact-availability");
    dom.adminToggle = document.getElementById("admin-toggle");
    dom.adminModal = document.getElementById("admin-modal");
    dom.adminAuth = document.getElementById("admin-auth");
    dom.adminAuthForm = document.getElementById("admin-auth-form");
    dom.githubToken = document.getElementById("github-token");
    dom.adminAuthStatus = document.getElementById("admin-auth-status");
    dom.adminEditor = document.getElementById("admin-editor");
    dom.adminProjects = document.getElementById("admin-projects");
    dom.adminPhotos = document.getElementById("admin-photos");
    dom.adminSocials = document.getElementById("admin-socials");
    dom.previewContent = document.getElementById("preview-content");
    dom.publishContent = document.getElementById("publish-content");
    dom.adminSaveStatus = document.getElementById("admin-save-status");
    dom.navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
    dom.sectionCards = {
        contact: document.querySelector("[data-section-card='contact']"),
        socials: document.querySelector("[data-section-card='socials']")
    };
}

function bindEvents() {
    dom.adminToggle.addEventListener("click", openAdmin);
    dom.adminModal.addEventListener("click", (event) => {
        if (event.target.closest("[data-close-admin]")) {
            closeAdmin();
        }
    });
    dom.adminAuthForm.addEventListener("submit", handleAdminAuth);
    dom.previewContent.addEventListener("click", previewDraft);
    dom.adminEditor.addEventListener("submit", publishDraft);
    dom.adminEditor.addEventListener("click", handleEditorClick);
    dom.adminEditor.addEventListener("change", handleEditorChange);
}

async function loadContent() {
    try {
        const response = await fetch(`${REPO_CONFIG.contentPath}?v=${Date.now()}`, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Could not load ${REPO_CONFIG.contentPath}.`);
        }

        const content = await response.json();
        state.content = normalizeContent(content);
    } catch (error) {
        state.content = deepClone(DEFAULT_CONTENT);
        setStatus(dom.adminSaveStatus, `Using default content because the live file could not be loaded: ${error.message}`, true);
    }

    state.adminDraft = deepClone(state.content);
    renderSite(state.content);
    renderAdminEditor();
}

function renderSite(content) {
    const visibility = getSectionVisibility(content);

    renderProfile(content.profile);
    renderProjects(visibility.showDevelopment ? content.projects : []);
    renderPhotos(visibility.showPhotography ? content.photos : []);
    renderSocials(visibility.showSocials ? content.socials : []);
    renderContact(visibility.showContact ? content.contact : {});
    applySectionVisibility(visibility);
    setupRevealObserver();
}

function renderProfile(profile) {
    dom.introHeading.textContent = profile.introHeading || "Hello, I'm Anders Brodd";
    dom.introText.textContent = profile.introText || "A web and game developer with photography on the side.";
}

function renderProjects(projects) {
    dom.projectsList.innerHTML = projects
        .map((project, index) => {
            const reveal = index % 2 === 0 ? "right" : "left";
            const cardClass = index % 2 === 0 ? "project-card" : "project-card project-card--reverse";
            const sideClass = index % 2 === 0 ? "scroll-card--right" : "scroll-card--left";

            return `
                <article class="${cardClass} frosted-card scroll-card ${sideClass}" data-reveal="${reveal}" data-scroll-card style="--stagger: ${index};">
                    <div class="project-media">
                        ${renderImageBlock(project.image, project.imageAlt || project.title, project.title)}
                    </div>
                    <div class="project-copy">
                        <p class="card-label">Project ${String(index + 1).padStart(2, "0")}</p>
                        <h3>${escapeHtml(project.title)}</h3>
                        <p class="project-summary">${escapeHtml(project.summary)}</p>
                        <p class="project-details">${escapeHtml(project.details)}</p>
                        <ul class="tag-list">
                            ${project.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}
                        </ul>
                        ${renderLink(project.url, project.cta || "Visit project", "project-link")}
                    </div>
                </article>
            `;
        })
        .join("");
}

function renderPhotos(photos) {
    dom.photosList.innerHTML = photos
        .map(
            (photo, index) => `
                <article class="photo-card frosted-card" data-photo-stack-card style="--stack-index: ${index}; --stack-z: ${photos.length - index};">
                    <div class="photo-media">
                        ${renderImageBlock(photo.image, photo.imageAlt || photo.title, photo.title)}
                    </div>
                    <div class="photo-copy">
                        <div>
                            <p class="card-label">${escapeHtml(photo.location || "Photography")}</p>
                            <h3>${escapeHtml(photo.title)}</h3>
                        </div>
                        <p>${escapeHtml(photo.caption)}</p>
                        <span class="photo-chip">${escapeHtml(photo.accent || "Winter light")}</span>
                    </div>
                </article>
            `
        )
        .join("");
}

function renderSocials(socials) {
    dom.socialsList.innerHTML = socials
        .map((social, index) => {
            const safeUrl = sanitizeUrl(social.url, { allowRelative: false, allowMailto: false });

            if (!safeUrl) {
                return `
                    <div class="social-item social-item--static" data-reveal="bottom" style="--stagger: ${index};">
                        <span>${escapeHtml(social.label)}</span>
                        <strong>${escapeHtml(social.value)}</strong>
                    </div>
                `;
            }

            return `
                <a class="social-item" data-reveal="bottom" style="--stagger: ${index};" href="${escapeAttribute(safeUrl)}" target="_blank" rel="noreferrer">
                    <span>${escapeHtml(social.label)}</span>
                    <strong>${escapeHtml(social.value)}</strong>
                </a>
            `;
        })
        .join("");
}

function renderContact(contact) {
    const safeEmail = sanitizeEmail(contact.email);

    dom.contactHeading.textContent = contact.heading || "Let us build something crisp and useful.";
    dom.contactEmail.textContent = safeEmail || "Add an email in admin mode";
    dom.contactEmail.href = safeEmail ? `mailto:${encodeURIComponent(safeEmail)}` : "#";
    dom.contactNote.textContent = contact.note || "Add a short contact note in the admin editor.";
    dom.contactLocation.textContent = contact.location || "Add a location";
    dom.contactAvailability.textContent = contact.availability || "Add availability";
}

function renderImageBlock(imageSource, altText, fallbackTitle) {
    const safeSource = sanitizeUrl(imageSource, { allowRelative: true, allowMailto: false });

    if (!safeSource) {
        return `<div class="media-placeholder"><span>${escapeHtml(fallbackTitle)}</span></div>`;
    }

    return `<img src="${escapeAttribute(safeSource)}" alt="${escapeAttribute(altText || fallbackTitle)}" loading="lazy">`;
}

function renderLink(url, label, className) {
    const safeUrl = sanitizeUrl(url, { allowRelative: false, allowMailto: false });

    if (!safeUrl) {
        return "";
    }

    return `<a class="${className}" href="${escapeAttribute(safeUrl)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function renderAdminEditor() {
    const draft = state.adminDraft;

    dom.adminProjects.innerHTML = renderProjectEditors(draft.projects);
    dom.adminPhotos.innerHTML = renderPhotoEditors(draft.photos);
    dom.adminSocials.innerHTML = renderSocialEditors(draft.socials);

    dom.adminEditor.elements.introHeading.value = draft.profile.introHeading || "";
    dom.adminEditor.elements.introText.value = draft.profile.introText || "";
    dom.adminEditor.elements.sectionDevelopment.checked = Boolean(draft.sections.development);
    dom.adminEditor.elements.sectionPhotography.checked = Boolean(draft.sections.photography);
    dom.adminEditor.elements.sectionSocials.checked = Boolean(draft.sections.socials);
    dom.adminEditor.elements.sectionContact.checked = Boolean(draft.sections.contact);
    dom.adminEditor.elements.contactHeading.value = draft.contact.heading || "";
    dom.adminEditor.elements.contactEmail.value = draft.contact.email || "";
    dom.adminEditor.elements.contactLocation.value = draft.contact.location || "";
    dom.adminEditor.elements.contactAvailability.value = draft.contact.availability || "";
    dom.adminEditor.elements.contactNote.value = draft.contact.note || "";
}

function renderProjectEditors(projects) {
    return `
        <div class="editor-card-list">
            ${projects
                .map((project) => {
                    const pendingUpload = state.uploads.project.get(project.id);

                    return `
                        <div class="editor-card" data-item-type="project" data-item-id="${escapeAttribute(project.id)}">
                            <div class="editor-card__header">
                                <h4>${escapeHtml(project.title || "New project")}</h4>
                                <button class="button button--danger" type="button" data-remove-item="project" data-item-id="${escapeAttribute(project.id)}">Remove</button>
                            </div>
                            <div class="editor-grid">
                                <label>
                                    <span>Title</span>
                                    <input type="text" name="title" value="${escapeAttribute(project.title)}">
                                </label>
                                <label>
                                    <span>Button label</span>
                                    <input type="text" name="cta" value="${escapeAttribute(project.cta)}" placeholder="Visit project">
                                </label>
                                <label class="editor-grid__full">
                                    <span>Summary</span>
                                    <textarea name="summary">${escapeHtml(project.summary)}</textarea>
                                </label>
                                <label class="editor-grid__full">
                                    <span>Details</span>
                                    <textarea name="details">${escapeHtml(project.details)}</textarea>
                                </label>
                                <label>
                                    <span>Project URL</span>
                                    <input type="url" name="url" value="${escapeAttribute(project.url)}" placeholder="https://...">
                                </label>
                                <label>
                                    <span>Image alt text</span>
                                    <input type="text" name="imageAlt" value="${escapeAttribute(project.imageAlt)}" placeholder="Screenshot description">
                                </label>
                                <label class="editor-grid__full">
                                    <span>Tags</span>
                                    <input type="text" name="tags" value="${escapeAttribute(project.tags.join(", "))}" placeholder="Shopify, UX, Front end">
                                </label>
                                <label class="editor-grid__full">
                                    <span>Image URL or relative path</span>
                                    <input type="text" name="image" value="${escapeAttribute(project.image)}" placeholder="media/projects/example.jpg or https://...">
                                </label>
                                <label class="editor-grid__full">
                                    <span>Upload image from this device</span>
                                    <input type="file" accept="image/*" data-upload-kind="project" data-item-id="${escapeAttribute(project.id)}">
                                    <small class="upload-meta">${escapeHtml(describeUploadState(pendingUpload, project.image))}</small>
                                </label>
                            </div>
                        </div>
                    `;
                })
                .join("")}
        </div>
    `;
}

function renderPhotoEditors(photos) {
    return `
        <div class="editor-card-list">
            ${photos
                .map((photo) => {
                    const pendingUpload = state.uploads.photo.get(photo.id);

                    return `
                        <div class="editor-card" data-item-type="photo" data-item-id="${escapeAttribute(photo.id)}">
                            <div class="editor-card__header">
                                <h4>${escapeHtml(photo.title || "New photo entry")}</h4>
                                <button class="button button--danger" type="button" data-remove-item="photo" data-item-id="${escapeAttribute(photo.id)}">Remove</button>
                            </div>
                            <div class="editor-grid">
                                <label>
                                    <span>Title</span>
                                    <input type="text" name="title" value="${escapeAttribute(photo.title)}">
                                </label>
                                <label>
                                    <span>Accent label</span>
                                    <input type="text" name="accent" value="${escapeAttribute(photo.accent)}" placeholder="Blue hour">
                                </label>
                                <label>
                                    <span>Location</span>
                                    <input type="text" name="location" value="${escapeAttribute(photo.location)}" placeholder="Location or scene">
                                </label>
                                <label>
                                    <span>Image alt text</span>
                                    <input type="text" name="imageAlt" value="${escapeAttribute(photo.imageAlt)}" placeholder="Photo description">
                                </label>
                                <label class="editor-grid__full">
                                    <span>Caption</span>
                                    <textarea name="caption">${escapeHtml(photo.caption)}</textarea>
                                </label>
                                <label class="editor-grid__full">
                                    <span>Image URL or relative path</span>
                                    <input type="text" name="image" value="${escapeAttribute(photo.image)}" placeholder="media/photos/example.jpg or https://...">
                                </label>
                                <label class="editor-grid__full">
                                    <span>Upload image from this device</span>
                                    <input type="file" accept="image/*" data-upload-kind="photo" data-item-id="${escapeAttribute(photo.id)}">
                                    <small class="upload-meta">${escapeHtml(describeUploadState(pendingUpload, photo.image))}</small>
                                </label>
                            </div>
                        </div>
                    `;
                })
                .join("")}
        </div>
    `;
}

function renderSocialEditors(socials) {
    return `
        <div class="editor-card-list">
            ${socials
                .map(
                    (social) => `
                        <div class="editor-card" data-item-type="social" data-item-id="${escapeAttribute(social.id)}">
                            <div class="editor-card__header">
                                <h4>${escapeHtml(social.label || "New social link")}</h4>
                                <button class="button button--danger" type="button" data-remove-item="social" data-item-id="${escapeAttribute(social.id)}">Remove</button>
                            </div>
                            <div class="editor-grid">
                                <label>
                                    <span>Label</span>
                                    <input type="text" name="label" value="${escapeAttribute(social.label)}" placeholder="GitHub">
                                </label>
                                <label>
                                    <span>Handle or text</span>
                                    <input type="text" name="value" value="${escapeAttribute(social.value)}" placeholder="Anders-Brodd">
                                </label>
                                <label class="editor-grid__full">
                                    <span>URL</span>
                                    <input type="url" name="url" value="${escapeAttribute(social.url)}" placeholder="https://...">
                                </label>
                            </div>
                        </div>
                    `
                )
                .join("")}
        </div>
    `;
}

function openAdmin() {
    dom.adminModal.hidden = false;
    document.body.classList.add("modal-open");
}

function closeAdmin() {
    dom.adminModal.hidden = true;
    document.body.classList.remove("modal-open");
}

async function handleAdminAuth(event) {
    event.preventDefault();

    const token = dom.githubToken.value.trim();

    if (!token) {
        setStatus(dom.adminAuthStatus, "Enter a GitHub personal access token first.", true);
        return;
    }

    setStatus(dom.adminAuthStatus, "Checking GitHub access...");

    try {
        const user = await githubRequest("https://api.github.com/user", {
            method: "GET",
            token
        });

        state.githubToken = token;
        state.githubUser = user;
        dom.githubToken.value = "";
        dom.adminEditor.hidden = false;
        dom.adminToggle.textContent = `Admin connected: ${user.login}`;
        setStatus(dom.adminAuthStatus, `Connected as ${user.login}. The token stays in memory for this tab only.`);
    } catch (error) {
        setStatus(dom.adminAuthStatus, error.message || "Could not connect to GitHub with that token.", true);
    }
}

function handleEditorClick(event) {
    const addKind = event.target.dataset.addItem;
    const removeKind = event.target.dataset.removeItem;
    const itemId = event.target.dataset.itemId;

    if (addKind) {
        state.adminDraft = collectDraftFromEditor();
        addDraftItem(addKind);
        renderAdminEditor();
        setStatus(dom.adminSaveStatus, `Added a new ${addKind} block. Preview or publish when ready.`);
        return;
    }

    if (removeKind && itemId) {
        state.adminDraft = collectDraftFromEditor();
        removeDraftItem(removeKind, itemId);
        renderAdminEditor();
        setStatus(dom.adminSaveStatus, `Removed the ${removeKind} entry. Preview or publish when ready.`);
    }
}

function handleEditorChange(event) {
    const uploadKind = event.target.dataset.uploadKind;
    const itemId = event.target.dataset.itemId;

    if (!uploadKind || !itemId) {
        return;
    }

    const selectedFile = event.target.files && event.target.files[0] ? event.target.files[0] : null;

    if (selectedFile) {
        state.uploads[uploadKind].set(itemId, selectedFile);
        setStatus(dom.adminSaveStatus, `${selectedFile.name} is queued for upload. Publish to commit it to GitHub.`);
    } else {
        state.uploads[uploadKind].delete(itemId);
        setStatus(dom.adminSaveStatus, "Cleared the pending upload for that entry.");
    }

    const uploadMeta = event.target.parentElement.querySelector(".upload-meta");
    const existingPath = event.target.parentElement.parentElement.querySelector("input[name='image']").value;

    if (uploadMeta) {
        uploadMeta.textContent = describeUploadState(selectedFile, existingPath);
    }
}

function previewDraft() {
    state.adminDraft = collectDraftFromEditor();
    renderSite(state.adminDraft);
    setStatus(dom.adminSaveStatus, "Preview updated with your unpublished changes.");
}

async function publishDraft(event) {
    event.preventDefault();

    if (!state.githubToken) {
        setStatus(dom.adminSaveStatus, "Connect to GitHub before publishing changes.", true);
        return;
    }

    dom.publishContent.disabled = true;
    dom.previewContent.disabled = true;
    setStatus(dom.adminSaveStatus, "Preparing content and uploading any queued images...");

    try {
        const draft = collectDraftFromEditor();
        const preparedDraft = await uploadPendingAssets(draft);
        const path = buildGitHubContentsUrl(REPO_CONFIG.contentPath);
        let sha = "";

        try {
            const currentFile = await githubRequest(buildGitHubContentsUrl(REPO_CONFIG.contentPath, true), {
                method: "GET",
                token: state.githubToken
            });
            sha = currentFile.sha || "";
        } catch (error) {
            if (error.status !== 404) {
                throw error;
            }
        }

        await githubRequest(path, {
            method: "PUT",
            token: state.githubToken,
            body: JSON.stringify({
                message: `Update site content via admin editor (${state.githubUser ? state.githubUser.login : "admin"})`,
                content: utf8ToBase64(JSON.stringify(preparedDraft, null, 2)),
                branch: REPO_CONFIG.branch,
                sha: sha || undefined
            })
        });

        state.content = normalizeContent(preparedDraft);
        state.adminDraft = deepClone(state.content);
        renderSite(state.content);
        renderAdminEditor();
        setStatus(dom.adminSaveStatus, "Published to GitHub. The live content file is updated.");
    } catch (error) {
        setStatus(dom.adminSaveStatus, error.message || "Publish failed.", true);
    } finally {
        dom.publishContent.disabled = false;
        dom.previewContent.disabled = false;
    }
}

async function uploadPendingAssets(draft) {
    const nextDraft = normalizeContent(draft);

    for (const project of nextDraft.projects) {
        const queuedFile = state.uploads.project.get(project.id);

        if (!queuedFile) {
            continue;
        }

        project.image = await uploadAsset(queuedFile, REPO_CONFIG.projectAssetDir, project.title || project.id);
        if (!project.imageAlt) {
            project.imageAlt = `${project.title} preview`;
        }
        state.uploads.project.delete(project.id);
    }

    for (const photo of nextDraft.photos) {
        const queuedFile = state.uploads.photo.get(photo.id);

        if (!queuedFile) {
            continue;
        }

        photo.image = await uploadAsset(queuedFile, REPO_CONFIG.photoAssetDir, photo.title || photo.id);
        if (!photo.imageAlt) {
            photo.imageAlt = `${photo.title} image`;
        }
        state.uploads.photo.delete(photo.id);
    }

    return nextDraft;
}

async function uploadAsset(file, directory, label) {
    const safeLabel = slugify(label || file.name || "asset") || "asset";
    const extension = getFileExtension(file.name || file.type || "image");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const relativePath = `${directory}/${timestamp}-${safeLabel}.${extension}`;
    const fileContent = arrayBufferToBase64(await file.arrayBuffer());

    await githubRequest(buildGitHubContentsUrl(relativePath), {
        method: "PUT",
        token: state.githubToken,
        body: JSON.stringify({
            message: `Upload ${relativePath}`,
            content: fileContent,
            branch: REPO_CONFIG.branch
        })
    });

    return relativePath;
}

function addDraftItem(kind) {
    if (kind === "project") {
        state.adminDraft.projects.push({
            id: createId("project"),
            title: "",
            summary: "",
            details: "",
            url: "",
            cta: "Visit project",
            image: "",
            imageAlt: "",
            tags: []
        });
        return;
    }

    if (kind === "photo") {
        state.adminDraft.photos.push({
            id: createId("photo"),
            title: "",
            caption: "",
            location: "",
            accent: "",
            image: "",
            imageAlt: ""
        });
        return;
    }

    if (kind === "social") {
        state.adminDraft.socials.push({
            id: createId("social"),
            label: "",
            value: "",
            url: ""
        });
    }
}

function removeDraftItem(kind, itemId) {
    if (kind === "project") {
        state.uploads.project.delete(itemId);
        state.adminDraft.projects = state.adminDraft.projects.filter((item) => item.id !== itemId);
        return;
    }

    if (kind === "photo") {
        state.uploads.photo.delete(itemId);
        state.adminDraft.photos = state.adminDraft.photos.filter((item) => item.id !== itemId);
        return;
    }

    if (kind === "social") {
        state.adminDraft.socials = state.adminDraft.socials.filter((item) => item.id !== itemId);
    }
}

function collectDraftFromEditor() {
    const projects = Array.from(dom.adminProjects.querySelectorAll("[data-item-type='project']")).map((card) => ({
        id: card.dataset.itemId,
        title: getFieldValue(card, "title"),
        summary: getFieldValue(card, "summary"),
        details: getFieldValue(card, "details"),
        url: getFieldValue(card, "url"),
        cta: getFieldValue(card, "cta") || "Visit project",
        image: getFieldValue(card, "image"),
        imageAlt: getFieldValue(card, "imageAlt"),
        tags: splitCommaList(getFieldValue(card, "tags"))
    })).filter((project) => hasContent(project.title, project.summary, project.details, project.url, project.image));

    const photos = Array.from(dom.adminPhotos.querySelectorAll("[data-item-type='photo']")).map((card) => ({
        id: card.dataset.itemId,
        title: getFieldValue(card, "title"),
        caption: getFieldValue(card, "caption"),
        location: getFieldValue(card, "location"),
        accent: getFieldValue(card, "accent"),
        image: getFieldValue(card, "image"),
        imageAlt: getFieldValue(card, "imageAlt")
    })).filter((photo) => hasContent(photo.title, photo.caption, photo.location, photo.image));

    const socials = Array.from(dom.adminSocials.querySelectorAll("[data-item-type='social']")).map((card) => ({
        id: card.dataset.itemId,
        label: getFieldValue(card, "label"),
        value: getFieldValue(card, "value"),
        url: getFieldValue(card, "url")
    })).filter((social) => hasContent(social.label, social.value, social.url));

    return normalizeContent({
        profile: {
            introHeading: dom.adminEditor.elements.introHeading.value.trim(),
            introText: dom.adminEditor.elements.introText.value.trim()
        },
        sections: {
            development: dom.adminEditor.elements.sectionDevelopment.checked,
            photography: dom.adminEditor.elements.sectionPhotography.checked,
            socials: dom.adminEditor.elements.sectionSocials.checked,
            contact: dom.adminEditor.elements.sectionContact.checked
        },
        projects,
        photos,
        socials,
        contact: {
            heading: dom.adminEditor.elements.contactHeading.value.trim(),
            email: dom.adminEditor.elements.contactEmail.value.trim(),
            note: dom.adminEditor.elements.contactNote.value.trim(),
            location: dom.adminEditor.elements.contactLocation.value.trim(),
            availability: dom.adminEditor.elements.contactAvailability.value.trim()
        }
    });
}

function getFieldValue(scope, name) {
    const field = scope.querySelector(`[name='${name}']`);
    return field ? field.value.trim() : "";
}

function normalizeContent(content) {
    const normalized = {
        profile: normalizeProfile(content && content.profile ? content.profile : DEFAULT_CONTENT.profile),
        sections: normalizeSections(content && content.sections ? content.sections : DEFAULT_CONTENT.sections),
        projects: Array.isArray(content && content.projects) ? content.projects.map(normalizeProject) : deepClone(DEFAULT_CONTENT.projects),
        photos: Array.isArray(content && content.photos) ? content.photos.map(normalizePhoto) : deepClone(DEFAULT_CONTENT.photos),
        socials: Array.isArray(content && content.socials) ? content.socials.map(normalizeSocial) : deepClone(DEFAULT_CONTENT.socials),
        contact: normalizeContact(content && content.contact ? content.contact : DEFAULT_CONTENT.contact)
    };

    return normalized;
}

function normalizeProfile(profile = {}) {
    return {
        introHeading: String(profile.introHeading || DEFAULT_CONTENT.profile.introHeading),
        introText: String(profile.introText || DEFAULT_CONTENT.profile.introText)
    };
}

function normalizeSections(sections = {}) {
    return {
        development: sections.development !== false,
        photography: sections.photography !== false,
        socials: sections.socials !== false,
        contact: sections.contact !== false
    };
}

function normalizeProject(project = {}, index = 0) {
    return {
        id: String(project.id || createDeterministicId("project", project.title, index)),
        title: String(project.title || ""),
        summary: String(project.summary || ""),
        details: String(project.details || ""),
        url: String(project.url || ""),
        cta: String(project.cta || "Visit project"),
        image: String(project.image || ""),
        imageAlt: String(project.imageAlt || ""),
        tags: Array.isArray(project.tags) ? project.tags.map((tag) => String(tag).trim()).filter(Boolean) : []
    };
}

function normalizePhoto(photo = {}, index = 0) {
    return {
        id: String(photo.id || createDeterministicId("photo", photo.title, index)),
        title: String(photo.title || ""),
        caption: String(photo.caption || ""),
        location: String(photo.location || ""),
        accent: String(photo.accent || "Winter light"),
        image: String(photo.image || ""),
        imageAlt: String(photo.imageAlt || "")
    };
}

function normalizeSocial(social = {}, index = 0) {
    return {
        id: String(social.id || createDeterministicId("social", social.label || social.value, index)),
        label: String(social.label || ""),
        value: String(social.value || ""),
        url: String(social.url || "")
    };
}

function normalizeContact(contact = {}) {
    return {
        heading: String(contact.heading || DEFAULT_CONTENT.contact.heading),
        email: String(contact.email || DEFAULT_CONTENT.contact.email),
        note: String(contact.note || DEFAULT_CONTENT.contact.note),
        location: String(contact.location || DEFAULT_CONTENT.contact.location),
        availability: String(contact.availability || DEFAULT_CONTENT.contact.availability)
    };
}

function buildGitHubContentsUrl(path, includeRef = false) {
    const encodedPath = path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");

    const baseUrl = `https://api.github.com/repos/${REPO_CONFIG.owner}/${REPO_CONFIG.repo}/contents/${encodedPath}`;
    return includeRef ? `${baseUrl}?ref=${encodeURIComponent(REPO_CONFIG.branch)}` : baseUrl;
}

async function githubRequest(url, options = {}) {
    const response = await fetch(url, {
        method: options.method || "GET",
        headers: {
            Accept: "application/vnd.github+json",
            ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(options.headers || {})
        },
        body: options.body || undefined
    });

    const payload = response.status === 204 ? null : await safeParseJson(response);

    if (!response.ok) {
        const error = new Error((payload && payload.message) || `GitHub request failed with ${response.status}.`);
        error.status = response.status;
        throw error;
    }

    return payload;
}

function safeParseJson(response) {
    return response.text().then((text) => {
        if (!text) {
            return null;
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            return { message: text };
        }
    });
}

function setupRevealObserver() {
    if (state.revealObserver) {
        state.revealObserver.disconnect();
    }

    const targets = document.querySelectorAll("[data-reveal]");
    const scrollCards = document.querySelectorAll("[data-scroll-card]");
    const photoCards = document.querySelectorAll("[data-photo-stack-card]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
        targets.forEach((element) => element.classList.add("is-visible"));
        scrollCards.forEach((element) => element.classList.add("is-in-view"));
        photoCards.forEach((element) => element.style.setProperty("--stack-progress", "0"));
        return;
    }

    state.revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    state.revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    targets.forEach((element) => state.revealObserver.observe(element));
    updateScrollCards();
    updatePhotoStack();
    window.removeEventListener("scroll", updateScrollCards);
    window.addEventListener("scroll", updateScrollCards, { passive: true });
    window.removeEventListener("scroll", updatePhotoStack);
    window.addEventListener("scroll", updatePhotoStack, { passive: true });
    window.removeEventListener("resize", updateScrollCards);
    window.addEventListener("resize", updateScrollCards);
    window.removeEventListener("resize", updatePhotoStack);
    window.addEventListener("resize", updatePhotoStack);
}

function updateScrollCards() {
    const cards = document.querySelectorAll("[data-scroll-card]");
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const inView = midpoint < viewportHeight * 0.86 && rect.bottom > viewportHeight * 0.14;
        card.classList.toggle("is-in-view", inView);
    });
}

function updatePhotoStack() {
    const cards = document.querySelectorAll("[data-photo-stack-card]");
    const stickyTop = window.innerWidth < 720 ? 88 : 112;

    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const progress = clamp((stickyTop - rect.top) / 260, 0, 1);
        const fadeAmount = index === cards.length - 1 ? 0 : progress;
        card.style.setProperty("--stack-progress", fadeAmount.toFixed(3));
        card.classList.toggle("is-active", rect.top <= stickyTop + 28 && rect.bottom > stickyTop + 80);
    });
}

function getSectionVisibility(content) {
    const sections = normalizeSections(content.sections);
    const showDevelopment = sections.development && hasProjectContent(content.projects);
    const showPhotography = sections.photography && hasPhotoContent(content.photos);
    const showSocials = sections.socials && hasSocialContent(content.socials);
    const showContact = sections.contact && hasContactContent(content.contact);

    return {
        showDevelopment,
        showPhotography,
        showSocials,
        showContact,
        showConnect: showSocials || showContact
    };
}

function applySectionVisibility(visibility) {
    setHidden(dom.developmentSection, !visibility.showDevelopment);
    setHidden(dom.photographySection, !visibility.showPhotography);
    setHidden(dom.connectSection, !visibility.showConnect);
    setHidden(dom.sectionCards.contact, !visibility.showContact);
    setHidden(dom.sectionCards.socials, !visibility.showSocials);

    dom.navLinks.forEach((link) => {
        const section = link.dataset.navLink;
        const shouldShow = section === "development"
            ? visibility.showDevelopment
            : section === "photography"
                ? visibility.showPhotography
                : visibility.showConnect;
        setHidden(link, !shouldShow);
    });

    dom.connectGrid.classList.toggle("connect-grid--single", visibility.showConnect && (visibility.showSocials !== visibility.showContact));
}

function setHidden(element, hidden) {
    if (!element) {
        return;
    }

    element.hidden = Boolean(hidden);
}

function hasProjectContent(projects) {
    return Array.isArray(projects) && projects.some((project) => hasContent(project.title, project.summary, project.details, project.url, project.image));
}

function hasPhotoContent(photos) {
    return Array.isArray(photos) && photos.some((photo) => hasContent(photo.title, photo.caption, photo.location, photo.image));
}

function hasSocialContent(socials) {
    return Array.isArray(socials) && socials.some((social) => hasContent(social.label, social.value, social.url));
}

function hasContactContent(contact) {
    return Boolean(contact) && hasContent(contact.heading, contact.email, contact.note, contact.location, contact.availability);
}

function seedSnow(slot, count) {
    const container = document.querySelector(`[data-snow='${slot}']`);

    if (!container) {
        return;
    }

    const travel = slot === "hero" ? 760 : 210;
    container.innerHTML = "";

    for (let index = 0; index < count; index += 1) {
        const flake = document.createElement("span");
        flake.className = "snowflake";
        flake.style.setProperty("--left", random(2, 98));
        flake.style.setProperty("--size", random(slot === "hero" ? 5 : 4, slot === "hero" ? 12 : 9));
        flake.style.setProperty("--opacity", (random(30, 78) / 100).toFixed(2));
        flake.style.setProperty("--blur", (random(0, 12) / 10).toFixed(1));
        flake.style.setProperty("--duration", random(slot === "hero" ? 18 : 12, slot === "hero" ? 32 : 20));
        flake.style.setProperty("--delay", random(0, 26));
        flake.style.setProperty("--drift", random(-52, 58));
        flake.style.setProperty("--travel", travel);
        container.appendChild(flake);
    }
}

function setStatus(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("is-error", Boolean(isError));
}

function describeUploadState(file, existingPath) {
    if (file) {
        return `Queued upload: ${file.name}`;
    }

    if (existingPath) {
        return `Current asset: ${existingPath}`;
    }

    return "No image selected yet.";
}

function splitCommaList(value) {
    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function hasContent(...values) {
    return values.some((value) => String(value || "").trim().length > 0);
}

function sanitizeEmail(value) {
    const email = String(value || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function sanitizeUrl(value, options = {}) {
    const rawValue = String(value || "").trim();
    const allowRelative = options.allowRelative !== false;
    const allowMailto = Boolean(options.allowMailto);

    if (!rawValue) {
        return "";
    }

    if (allowRelative && !/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(rawValue)) {
        if (rawValue.startsWith("//")) {
            return "";
        }

        return rawValue;
    }

    try {
        const parsed = new URL(rawValue, window.location.origin);
        const allowedProtocols = allowMailto ? ["http:", "https:", "mailto:"] : ["http:", "https:"];
        return allowedProtocols.includes(parsed.protocol) ? parsed.href : "";
    } catch (error) {
        return "";
    }
}

function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDeterministicId(prefix, seed, index) {
    return `${prefix}-${slugify(seed || `${prefix}-${index + 1}`) || `${prefix}-${index + 1}`}`;
}

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getFileExtension(source) {
    const match = String(source || "").toLowerCase().match(/\.([a-z0-9]+)$/);

    if (match) {
        return match[1];
    }

    if (String(source || "").includes("png")) {
        return "png";
    }

    if (String(source || "").includes("webp")) {
        return "webp";
    }

    if (String(source || "").includes("gif")) {
        return "gif";
    }

    return "jpg";
}

function utf8ToBase64(value) {
    const bytes = new TextEncoder().encode(value);
    return bytesToBase64(bytes);
}

function arrayBufferToBase64(buffer) {
    return bytesToBase64(new Uint8Array(buffer));
}

function bytesToBase64(bytes) {
    let binary = "";
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
        const chunk = bytes.subarray(index, index + chunkSize);
        binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
}
