# Upload Life RPG to GitHub

## What to upload

This folder is the GitHub repository content for Life RPG.

Important: in the GitHub upload screen, upload the contents of this folder so that these files appear in the repository root:

- `manifest.json`
- `main.js`
- `styles.css`
- `README.md`
- `LICENSE`
- `versions.json`
- `package.json`
- `package-lock.json`
- `src/`

Do not upload `data.json`. It is not included here.

## GitHub steps

1. Create or log in to a GitHub account.
2. Create a new public repository named:

```text
life-rpg
```

3. Upload all files from this folder.
4. Commit the upload.
5. Create a new GitHub Release.
6. Use this tag:

```text
0.1.0
```

7. Attach these three files from this same folder to the release:

- `main.js`
- `manifest.json`
- `styles.css`

The release tag must match `manifest.json` version.

## After that

People can test the plugin through BRAT using your GitHub repository URL.

