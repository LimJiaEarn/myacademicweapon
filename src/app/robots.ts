import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Profiles, auth and edit pages rely on a noindex meta tag (they must stay
      // crawlable for Google to see it) — only truly private surfaces are disallowed.
      disallow: ["/contribute/admin", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
