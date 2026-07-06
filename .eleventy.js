module.exports = function (eleventyConfig) {
  // Tag di sistema da non mostrare come badge
  const SYSTEM_TAGS = ["post"];

  // Tag riservato alla serie principale: serve per filtrare nelle due colonne della home
  const SERIES_CODEINTEL_TAG = "serie-codeintel";

  // Filtro per ottenere solo i tag visibili (esclusi quelli di sistema)
  eleventyConfig.addFilter("displayTags", (tags) => {
    if (!tags) return [];
    return tags.filter(t => !SYSTEM_TAGS.includes(t));
  });

  // Filtro per recuperare un post da una collection tramite il suo fileSlug
  eleventyConfig.addFilter("findBySlug", (collection, slug) => {
    if (!collection) return null;
    return collection.find(item => item.fileSlug === slug) || null;
  });

  // Filtro per assegnare un colore CSS a ogni tag
  eleventyConfig.addFilter("tagColor", (tag) => {
    const palette = {
      "serie-codeintel": "tag-serie-codeintel",
      "serie-aether":    "tag-serie-aether",
      "ai-pratica":      "tag-ai-pratica",
      "ai-filosofia":    "tag-ai-filosofia",
      "tutorial":        "tag-tutorial",
      "personale":       "tag-personale",
    };
    return palette[tag] || "tag-default";
  });

  // Collection per ogni tag (usata dalle pagine filtro)
  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tagsSet = new Set();
    collectionApi.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (!SYSTEM_TAGS.includes(tag)) tagsSet.add(tag);
      });
    });
    return [...tagsSet].sort();
  });

  // Copia asset statici (immagini, js) — CSS è gestito da Tailwind CLI
  eleventyConfig.addPassthroughCopy({ "src/assets/avatar.png": "assets/avatar.png" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });

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

  // Collection: solo post della serie CodeIntel (ordinati cronologicamente)
  eleventyConfig.addCollection("serieCodeintel", function(collectionApi) {
    return collectionApi.getFilteredByTag("post")
      .filter(p => (p.data.tags || []).includes(SERIES_CODEINTEL_TAG))
      .sort((a, b) => a.date - b.date);
  });

  // Collection: tutti gli altri post (note dal mestiere), più recenti prima
  eleventyConfig.addCollection("noteDalMestiere", function(collectionApi) {
    return collectionApi.getFilteredByTag("post")
      .filter(p => !(p.data.tags || []).includes(SERIES_CODEINTEL_TAG))
      .sort((a, b) => b.date - a.date);
  });

  // Collection per ogni singolo tag — usata per le pagine /tags/<tag>/
  eleventyConfig.addCollection("postsByTag", function (collectionApi) {
    const result = {};
    collectionApi.getFilteredByTag("post").forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (!SYSTEM_TAGS.includes(tag)) {
          if (!result[tag]) result[tag] = [];
          result[tag].push(item);
        }
      });
    });
    return result;
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

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
