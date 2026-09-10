import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          pt: site.url,
          en: `${site.url}/en`,
        },
      },
    },
    {
      url: `${site.url}/en`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          pt: site.url,
          en: `${site.url}/en`,
        },
      },
    },
  ];
}
