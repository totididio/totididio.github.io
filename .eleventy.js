export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/files": "assets/files" });
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/root": "/" });

  // Human-readable date, e.g. "25 August 2026"
  eleventyConfig.addFilter("readableDate", (value) => {
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    });
  });

  // A link is printed only when its page exists, so the site can be published
  // one page at a time without ever shipping a 404.
  eleventyConfig.addFilter("hasPage", (url, all) =>
    (all || []).some((p) => p.url === url));
  eleventyConfig.addFilter("existingPages", (items, all) =>
    (items || []).filter((i) => (all || []).some((p) => p.url === i.url)));

  // Placeholders are visible in development and refuse to ship in production.
  eleventyConfig.addShortcode("todo", function (note) {
    if (process.env.NODE_ENV === "production") {
      return "";
    }
    return `<mark class="todo" role="note">TO COMPLETE — ${note}</mark>`;
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
