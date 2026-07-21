import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-07-21",
  useCdn: true,
};

let _client: SanityClient | null = null;

export function getClient(): SanityClient {
  if (!_client) {
    if (!config.projectId) {
      throw new Error("SanityprojectId is not configured");
    }
    _client = createClient(config);
  }
  return _client;
}

export function urlFor(source: SanityImageSource) {
  return imageUrlBuilder({ projectId: config.projectId, dataset: config.dataset }).image(source).auto("format").fit("max");
}
