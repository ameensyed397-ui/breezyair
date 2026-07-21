import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import postSchema from "./schemas/post";

export default defineConfig({
  name: "breezyair-blog",
  title: "Breezyair Blog",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [structureTool()],
  schema: { types: [postSchema] },
});
