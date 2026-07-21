import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import postSchema from "./schemas/post";

export default defineConfig({
  name: "breezyair-blog",
  title: "Breezyair Blog",
  projectId: "v624lop9",
  dataset: "production",
  plugins: [structureTool()],
  schema: { types: [postSchema] },
});
