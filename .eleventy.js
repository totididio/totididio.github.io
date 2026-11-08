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
  // External links open in a new tab, and say so to screen readers. Video facades are
  // skipped: their script turns them into a player in place. trafficO2 always gets its subscript.
  eleventyConfig.addTransform("links-and-chemistry", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const i = content.indexOf("<body");
    if (i < 0) return content;
    let body = content.slice(i);
    body = body.replace(/<a ([^>]*?href="https?:\/\/(?!(?:www\.)?salvatoredidio\.com)[^"]*"[^>]*)>([\s\S]*?)<\/a>/g,
      (m, attrs, inner) => attrs.includes("data-embed") || attrs.includes("target=") ? m
        : `<a ${attrs} target="_blank" rel="noopener">${inner}<span class="visually-hidden"> (opens in a new tab)</span></a>`);
    let prev;
    do { prev = body; body = body.replace(/(>[^<]*?\b[Tt]rafficO)2\b/g, "$1<sub>2</sub>"); } while (body !== prev);
    return content.slice(0, i) + body;
  });

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
