import type { NextConfig } from "next";

// Branch previews are served through the Dropsheet preview router at
// https://preview.dropsheet.ai/demo-shop/<slug>/, which proxies to Vercel's branch alias
// demo-shop-git-<slug>-dropsheet.vercel.app. A preview build therefore mounts the app under /demo-shop/<slug>.
// Production and local builds stay at the root. NEXT_BASE_PATH overrides both (the CI smoke builds with one).
const ALIAS = /^demo-shop-git-([a-z0-9-]+)-dropsheet\.vercel\.app$/;

function basePath(env: NodeJS.ProcessEnv): string {
  if (env.NEXT_BASE_PATH !== undefined) return env.NEXT_BASE_PATH.replace(/\/+$/, "");
  if (env.VERCEL_ENV !== "preview") return "";
  // Vercel's own branch alias, so the slug matches it even when Vercel shortens a long branch name
  const alias = ALIAS.exec(env.VERCEL_BRANCH_URL ?? "");
  if (alias) return `/demo-shop/${alias[1]}`;
  // Same slug rule as Vercel, for a build where the alias is not exposed: lowercase, runs of other characters to '-'
  const slug = (env.VERCEL_GIT_COMMIT_REF ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!slug || `demo-shop-git-${slug}-dropsheet`.length > 63) {
    throw new Error(`preview base path: VERCEL_BRANCH_URL is '${env.VERCEL_BRANCH_URL ?? ""}' and branch '${env.VERCEL_GIT_COMMIT_REF ?? ""}' has no unshortened alias`);
  }
  return `/demo-shop/${slug}`;
}

const nextConfig: NextConfig = { basePath: basePath(process.env) };

export default nextConfig;
