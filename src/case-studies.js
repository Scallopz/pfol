/**
 * CASE STUDIES — edit this file to change titles, blurbs, links, or tags.
 *
 * tags: short labels shown next to the title on the homepage.
 * Example: tags: ["Brand", "Marketing"]
 *
 * After editing on GitHub, commit to main and Vercel will redeploy.
 */
export const CASE_STUDIES = [
  {
    id: "winning-100cr-order",
    href: "/work/winning-100cr-order.html",
    title: "Winning a ₹100Cr order with no paid marketing",
    blurb:
      "Raised Armory’s marketing from 0 to present day — field evangelism, narrative, and assets that helped land Ministry of Defence procurement.",
    tags: ["Brand", "Marketing"],
  },
  {
    id: "surge-operator-interface",
    href: "/work/surge-operator-interface.html",
    title: "Designing an interface for war",
    blurb:
      "Designed SURGE’s operator interface from first principles — altitude on a 2D screen, wartime offsets, and in-app tutorials for soldiers.",
    tags: ["ProductDesign"],
  },
  {
    id: "vida-self-serve",
    href: "/work/vida-self-serve.html",
    title: "Turning a service into a product enterprises actually use",
    blurb:
      "Redesigned VIDA’s verification into a Solutions Builder Platform. Top 1,100 enterprises now use it.",
    tags: ["ProductDesign"],
  },
  {
    id: "slice-credit-card",
    href: "/work/slice-credit-card.html",
    title: "Turning a credit card into a shareable product experience",
    blurb:
      "Launched Slice’s credit card with an organic viral unboxing strategy — and killed the shipping envelope forever.",
    tags: ["Brand", "Marketing"],
  },
  {
    id: "slice-trust-activation",
    href: "/work/slice-trust-activation.html",
    title: "Designing Trust & Activation in a Credit Product",
    blurb:
      "Research-driven overhaul of Slice’s onboarding and core UX — 50k → 1M users in a year post launch.",
    tags: ["ProductDesign"],
  },
  {
    id: "prodigy-authoring",
    href: "/work/prodigy-authoring.html",
    title: "Cutting math question production time from 5 minutes to 1",
    blurb:
      "Redesigned Prodigy’s authoring tool so content teams could ship curriculum-aligned questions in under a minute — 12 → 50+ per week.",
    tags: ["ProductDesign"],
  },
];

export function formatTags(tags = []) {
  return tags.map((tag) => tag.replace(/^#/, "")).filter(Boolean);
}

export function tagsMarkup(tags = []) {
  const clean = formatTags(tags);
  if (!clean.length) return "";
  return `<span class="case-tags">${clean
    .map((tag) => `<span class="case-tag">#${tag}</span>`)
    .join("")}</span>`;
}
