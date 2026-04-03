# anders-brodd.github.io

This site is now a static GitHub Pages portfolio with a built-in admin editor.

## How content works

- Public content lives in `content.json`.
- The page loads projects, photography entries, socials, and contact info from that file.
- The footer has an `Admin sign in` button that opens a GitHub-backed editor.

## How admin publishing works

Because GitHub Pages is a static host, there is no private server-side login. The admin flow uses a GitHub personal access token entered in the browser and publishes directly to this repository through the GitHub API.

What the admin editor can do:

- Add, remove, and edit development projects.
- Add, remove, and edit photography entries.
- Update socials.
- Update contact info.
- Edit the short intro and about section.
- Toggle major sections on or off.
- Upload local images for projects and photography. Uploaded files are committed into the repo under `media/projects` and `media/photos`.

## Token setup

Use a GitHub token that can write repository contents for `Anders-Brodd/anders-brodd.github.io`.

Recommended option:

1. Create a fine-grained personal access token in GitHub.
2. Give it access to this repository only.
3. Grant `Contents: Read and write`.
4. Paste that token into the site admin dialog when you want to publish changes.

## Notes

- The token is kept in memory for the current browser tab only.
- Enabled sections still hide automatically when they have no content.
- Removing an item from the editor does not automatically delete previously uploaded image files from the repository.
- If you want to change the repository target later, update the `REPO_CONFIG` object in `script.js`.