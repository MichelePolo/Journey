module.exports = function (eleventyConfig) {
  // Copia asset statici (css, immagini, js)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Filtri per le date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateObj).toLocaleDateString('it-IT', options);
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split('T')[0];
  });

  // Ordina i post per data (più recenti prima)
  eleventyConfig.addCollection("post", function(collectionApi) {
    return collectionApi.getFilteredByTag("post").sort((a, b) => {
      return b.date - a.date;
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    // Se il sito è su username.github.io/Journey/ decommentare:
    pathPrefix: "/Journey/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
