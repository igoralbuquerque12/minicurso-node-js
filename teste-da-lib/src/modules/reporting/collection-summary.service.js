function getNewsList(entry) {
  return Array.isArray(entry?.news) ? entry.news : [];
}

function getNewsTitle(news) {
  return news.title || news.heading || "Untitled news";
}

function createCollectionSummary(results, warnings = [], options = {}) {
  const headlineLimit = options.headlineLimit ?? 8;
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const allNews = results.flatMap((entry) =>
    getNewsList(entry).map((news) => ({
      source: entry.source,
      date: news.date || null,
      title: getNewsTitle(news),
      url: news.url || null,
      summary: news.summary || "",
    }))
  );

  const bySource = results.map((entry) => {
    const news = getNewsList(entry);

    return {
      source: entry.source,
      totalNews: news.length,
      hasNews: news.length > 0,
      latestDate: news[0]?.date || null,
    };
  });

  return {
    generatedAt,
    totals: {
      sources: results.length,
      news: allNews.length,
      sourcesWithNews: bySource.filter((source) => source.hasNews).length,
      warnings: warnings.length,
    },
    bySource,
    highlights: allNews.slice(0, headlineLimit),
    warnings,
  };
}

module.exports = { createCollectionSummary };
