import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Asad Khan",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "AC Repair", value: "AC Repair" },
          { title: "Maintenance", value: "Maintenance" },
          { title: "Buying Guide", value: "Buying Guide" },
          { title: "Tips", value: "Tips" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      initialValue: "4 min read",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "object",
          name: "blockP",
          title: "Paragraph",
          fields: [
            defineField({ name: "text", title: "Text", type: "text", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "text" } },
        },
        {
          type: "object",
          name: "blockH2",
          title: "Heading",
          fields: [
            defineField({ name: "text", title: "Text", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "text" } },
        },
        {
          type: "object",
          name: "blockUl",
          title: "Bullet List",
          fields: [
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [{ type: "string" }],
              validation: (r) => r.min(1),
            }),
          ],
          preview: { select: { title: "items" }, prepare: (s: Record<string, string>) => ({ title: (s.title as unknown as string[])?.join(", ") ?? "" }) },
        },
        {
          type: "object",
          name: "blockQuote",
          title: "Quote",
          fields: [
            defineField({ name: "text", title: "Text", type: "text", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "text" } },
        },
        {
          type: "object",
          name: "blockImage",
          title: "Image",
          fields: [
            defineField({ name: "src", title: "Image", type: "image", validation: (r) => r.required() }),
            defineField({ name: "alt", title: "Alt text", type: "string", initialValue: "" }),
          ],
          preview: { select: { title: "alt" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
    prepare: (s: Record<string, string>) => ({ title: s.title, subtitle: s.subtitle, media: s.media }),
  },
});
