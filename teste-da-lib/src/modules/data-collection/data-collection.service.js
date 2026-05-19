const { scrapeTJMG } = require("../scrapping/tj-MG.service");
const { scrapeTJPR } = require("../scrapping/tj-PR.service");
const { scrapeTJRJ } = require("../scrapping/tj-RJ.service");
const { scrapeTJSP } = require("../scrapping/tj-SP.service");
const { chat } = require("../openai/openai.service");
const { createCollectionSummary } = require("../reporting/collection-summary.service");
const { ANALYSIS_SYSTEM_PROMPT, SUMMARY_HEADLINE_LIMIT } = require("./config");

const scrapers = [
  { name: "TJ-MG", fn: scrapeTJMG },
  { name: "TJ-PR", fn: scrapeTJPR },
  { name: "TJ-RJ", fn: scrapeTJRJ },
  { name: "TJ-SP", fn: scrapeTJSP },
];


/**
 * Executes all scrapers sequentially.
 * If one fails, it logs a warning and proceeds to the next.
 * @returns {Promise<{results: Array, warnings: string[]}>}
 */
async function collectAll() {
  const results = [];
  const warnings = [];

  for (const scraper of scrapers) {
    try {
      console.log(`[data-collection] Collecting data from ${scraper.name}...`);
      const data = await scraper.fn();
      results.push({ source: scraper.name, news: data });
    } catch (error) {
      const message = `Failed to collect data from ${scraper.name}: ${error.message}`;
      console.warn(`[data-collection] WARNING: ${message}`);
      warnings.push(message);
    }
  }

  const summary = createCollectionSummary(results, warnings, {
    headlineLimit: SUMMARY_HEADLINE_LIMIT,
  });

  return { results, warnings, summary };
}

/**
 * Executes all scrapers and returns a compact monitoring summary.
 * @param {Object} options
 * @param {number} [options.headlineLimit] - Maximum number of highlighted news.
 * @returns {Promise<{summary: Object, warnings: string[]}>}
 */
async function collectSummary(options = {}) {
  const { results, warnings } = await collectAll();
  const summary = createCollectionSummary(results, warnings, {
    headlineLimit: options.headlineLimit ?? SUMMARY_HEADLINE_LIMIT,
  });

  return { summary, warnings };
}

/**
 * Collects data from all courts and sends it to OpenAI to analyze
 * possible impacts on automations and scrapers.
 *
 * @returns {Promise<{analysis: Array, warnings: string[], usage: Object}>}
 * @throws {Error} If the call to OpenAI fails.
 */
async function collectAndAnalyze() {
  const { results, warnings, summary } = await collectAll();

  console.log(
    "[data-collection] Sending collected data for analysis via OpenAI..."
  );

  const response = await chat({
    systemPrompt: ANALYSIS_SYSTEM_PROMPT,
    userMessage: JSON.stringify(results),
  });

  let analysis;
  try {
    analysis = JSON.parse(response.content);
  } catch {
    console.warn(
      "[data-collection] OpenAI response is not valid JSON. Returning as text."
    );
    analysis = response.content;
  }

  return {
    analysis,
    summary,
    warnings,
    usage: response.usage,
  };
}

module.exports = { collectAll, collectSummary, collectAndAnalyze };
