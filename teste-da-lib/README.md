# ⚖️ TJ Scrap Analysis

Este projeto é uma ferramenta de automação para coleta (web scraping) e
análise inteligente de notícias e movimentações de Tribunais de Justiça
(TJs). O sistema captura dados diretamente dos portais dos tribunais e
utiliza Inteligência Artificial para analisar as informações,
identificando mudanças relevantes em sistemas e infraestrutura.

------------------------------------------------------------------------

## 🏗️ Arquitetura e Fluxo de Dados

O projeto foi estruturado pensando em duas abordagens principais para a
**Coleta de Dados**:

### 1. Scraping Direto nos Sites (Implementação Atual)

Esta abordagem foi testada e validada com sucesso nos seguintes
tribunais: **TJ-SP, TJ-MG, TJ-PR e TJ-RJ**.

-   **Como é feito:** Como cada tribunal possui um site único, o
    scraping é personalizado para cada domínio. A extração é feita de
    maneira rápida utilizando IDs e análise via DevTools.
-   **Atenção (Manutenção):** Alterações na estrutura HTML dos sites
    podem quebrar o scraping, exigindo manutenção do desenvolvedor.
-   **Tratamento de Erros:** O código possui um campo de `warning` para
    avisar exatamente onde ocorreu um erro durante as análises,
    facilitando o debug.

### 2. Pesquisa via Motor do Google (Alternativa em Estudo)

Devido aos bloqueadores de robôs do Google, a estratégia de busca direta
pode falhar. Foram mapeadas duas soluções para esta via:

-   **Solução 1: Utilizar APIs de Busca.** Elas lidam com os problemas
    de scraping internamente e retornam os dados em JSON.
    -   *Vantagem:* Código limpo e muito performático.
    -   *Desvantagem:* Inflexível para personalizações.
-   **Solução 2: Utilizar bibliotecas com simulação de navegador (ex:
    Puppeteer).**
    -   *Vantagem:* Código padronizado para todas as buscas, alterando
        apenas o texto buscado.\
    -   *Desvantagem:* Menos performático e implementação levemente mais
        complexa.

------------------------------------------------------------------------

## ⚙️ Pipeline de Processamento

### Passo 1: Salvamento dos Dados

Os dados extraídos das páginas de notícias são filtrados por data e
estruturados para padronização. Para CADA site, salva-se um conjunto
contendo:

-   `data da notícia`
-   `url`
-   `título`
-   `resumo`

> **Nota sobre o Resumo:** Alguns sites (como o TJ-SP) fornecem um
> resumo pronto. Para os que não possuem, o sistema captura os primeiros
> 500 caracteres do corpo da notícia para atuar como resumo.

### Passo 2: Análise dos Dados com IA

Com o conjunto de dados filtrado, as informações são enviadas para uma
Inteligência Artificial realizar a análise técnica.

-   **Fatores de Custo:** Quanto mais informação por notícia ou maior o
    volume de notícias, maior a necessidade de processamento (o que
    encarece a requisição).
-   **Engenharia de Prompt:** O prompt influencia 100% no resultado da
    análise. Foi desenvolvido um prompt específico instruindo a IA a
    agir como Analista de Monitoramento de Sistemas, buscando
    identificar manutenções programadas, falhas, atualizações ou
    mudanças em APIs.

### Passo 3: Resultado (Output)

A IA processa os dados e retorna um objeto JSON estruturado por
tribunal, indicando se houve validação e se existem notícias
preocupantes para a infraestrutura.

**Exemplo de Resposta da IA:**

``` json
{
  "data": [
    {
      "source": "TJ-MS",
      "fonte_verificada_integralmente_nesta_data": true,
      "mudanca_relevante_exposta": false,
      "noticias_preocupantes": [],
      "justificativa_e_impacto": ""
    },
    {
      "source": "TJ-PR",
      "fonte_verificada_integralmente_nesta_data": true,
      "mudanca_relevante_exposta": false,
      "noticias_preocupantes": [],
      "justificativa_e_impacto": ""
    }
  ]
}
```

------------------------------------------------------------------------

## Resumo Operacional

A API tambem oferece um endpoint compacto para montar dashboards ou checagens
rapidas sem chamar a analise de IA:

```http
GET /data-collection/summary?limit=8
x-api-key: sua-chave
```

Esse retorno consolida totais por fonte, quantidade de noticias, fontes com
conteudo recente, avisos de coleta e uma lista curta de destaques.

------------------------------------------------------------------------

# 🚀 Roadmap e Melhorias Futuras

-   [ ] Implementar Fila de Mensageria: Rodar a análise de IA em segundo
    plano (background). Como a resposta da IA demora, isso evita que o
    usuário sofra com Timeout ao aguardar a requisição.

-   [ ] Persistência de Dados: Salvar os dados processados em planilhas
    (Excel/Google Sheets) ou em um Banco de Dados estruturado.

-   [ ] Refinamento de Entrada: Melhorar o prompt e o conjunto de
    informações de entrada para aumentar a qualidade e precisão do
    output da IA.

-   [ ] Análise Preditiva: Utilizar o conjunto de dados de saída
    (histórico) para gerar análises e previsões futuras sobre o
    comportamento dos sistemas dos tribunais.

------------------------------------------------------------------------

# 🚀 Visualização via Fluxograma

<img width="2385" height="2969" alt="image" src="https://github.com/user-attachments/assets/c7009724-b2f0-4d83-abab-6e822936ed01" />
