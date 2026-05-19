# Adapter

Adapter é um tradutor entre seu sistema e serviços externos.

No seu código, cada IA fala uma "língua" diferente, mas seu sistema quer falar sempre do mesmo jeito. O adapter resolve isso.

## Sem adapter

Imagina se seu código fosse assim:

```js
async function generate(prompt, provider) {
  if (provider === "openai") {
    // chamada OpenAI
  }

  if (provider === "gemini") {
    // chamada Gemini
  }

  if (provider === "groq") {
    // chamada Groq
  }
}
```

### Problemas

- cheio de `if`
- código gigante
- difícil manter
- toda IA nova exige mexer na lógica principal

## Com adapter

Cada provider ganha seu próprio "tradutor".

### OpenAI

```js
class OpenAIAdapter {
  async generateContent(prompt) {
    // conversa com OpenAI
  }
}
```

### Gemini

```js
class GeminiAdapter {
  async generateContent(prompt) {
    // conversa com Gemini
  }
}
```

### Groq

```js
class GroqAdapter {
  async generateContent(prompt) {
    // conversa com Groq
  }
}
```

Perceba:

Mesmo que por baixo cada API seja diferente, todas expõem o mesmo método:

```js
generateContent(prompt)
```

Isso é o ponto principal.

## Analogia real

Pensa em tomada.

Seu notebook precisa de energia.

Mas cada país tem tomada diferente:

- Brasil
- EUA
- Europa

Seu notebook não quer saber disso.

Você usa um adapter.

A interface continua a mesma:

- ligar energia

Mas o adapter traduz pro padrão correto.

## Aplicando no seu código

A factory escolhe o adapter:

```js
AiProviderFactory.create(config)
```

Se for OpenAI:

```js
return new OpenAIAdapter(...)
```

Se for Gemini:

```js
return new GeminiAdapter(...)
```

Se for Groq:

```js
return new GroqAdapter(...)
```

Depois quem usa nem precisa saber qual IA está por trás:

```js
const ai = AiProviderFactory.create(config);

await ai.generateContent("crie um commit message");
```

Repara:

O código consumidor só conhece:

- `generateContent()`

Ele não conhece:

- URL da API
- headers
- auth
- body específico
- formato da resposta

Tudo isso fica escondido no adapter.

## Em 1 frase

Adapter pega sistemas diferentes e faz todos parecerem iguais para o seu código.

Ou mais simples:

"É um tradutor entre seu sistema e uma implementação externa."