// Draft until the commentaries are written: built in development, never in production.
export default {
  eleventyComputed: {
    permalink: (data) => (data.env.production ? false : "/research/"),
  },
};
