# Portfolio

Personal portfolio site  — narrow single-column layout, collapsible sections, light/dark theme, JetBrains Mono throughout.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Filling in content

Placeholders are marked with `[brackets]` and highlighted with a dashed underline in the UI.

Replace in `index.html`:

- Name, initials (`[YN]`), tagline, bio
- Experience rows (dates, titles, companies, blurbs)
- Selected work + side projects (links + descriptions)
- How I Work / help-panel copy
- Reading list
- Footer links + email (`mailto:[you@email.com]`)

Optional: drop a photo at `public/avatar.png` and swap the `.avatar-placeholder` div for an `<img>`.

Help-panel topic blurbs live in `src/main.js` (`HELP_COPY`).
