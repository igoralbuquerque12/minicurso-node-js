const { Router } = require("express");
const { authMiddleware } = require("../auth/auth.service");
const {
  collectAll,
  collectSummary,
  collectAndAnalyze,
} = require("./data-collection.service");

const router = Router();

/**
 * GET /data-collection
 * Executa a coleta de todas as fontes e retorna os resultados.
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { results, warnings, summary } = await collectAll();

    return res.json({
      success: true,
      warnings,
      summary,
      data: results,
    });
  } catch (error) {
    console.error("[data-collection] Erro inesperado:", error.message);
    return res.status(500).json({
      success: false,
      error: "Erro interno ao coletar dados.",
    });
  }
});

/**
 * GET /data-collection/summary
 * Executa a coleta e retorna um painel compacto por tribunal.
 */
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10);
    const { summary, warnings } = await collectSummary({
      headlineLimit: Number.isNaN(limit) ? undefined : limit,
    });

    return res.json({
      success: true,
      warnings,
      data: summary,
    });
  } catch (error) {
    console.error("[data-collection] Erro no resumo:", error.message);
    return res.status(500).json({
      success: false,
      error: "Erro interno ao resumir dados.",
    });
  }
});

/**
 * GET /data-collection/analyze
 * Coleta dados de todos os tribunais e envia para a OpenAI analisar
 * possíveis impactos em automações e scrapers.
 */
router.get("/analyze", authMiddleware, async (req, res) => {
  try {
    const { analysis, summary, warnings, usage } = await collectAndAnalyze();

    return res.json({
      success: true,
      warnings,
      summary,
      usage,
      data: analysis,
    });
  } catch (error) {
    console.error("[data-collection] Erro na análise:", error.message);
    return res.status(500).json({
      success: false,
      error: "Erro interno ao analisar dados.",
    });
  }
});

module.exports = router;
