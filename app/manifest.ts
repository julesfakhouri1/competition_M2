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
        src: "/enchanted_tools.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["utilities", "entertainment"],
    lang: "fr",
  };
}
