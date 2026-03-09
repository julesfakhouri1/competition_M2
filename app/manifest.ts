import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Enchanted Tools",
    short_name: "Enchanted",
    description: "Explorez l'espace Enchanted Tools — plan interactif et modules créatifs",
    start_url: "/",
    display: "standalone",
    background_color: "#080810",
    theme_color: "#C6A55C",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["utilities", "entertainment"],
    lang: "fr",
  };
}
