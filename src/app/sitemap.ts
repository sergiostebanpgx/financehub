import type { MetadataRoute } from "next";

const siteUrl = "https://financehub-nemeziz.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/login`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/registro`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
