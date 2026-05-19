import { OpenAIAdapter } from "./adapters/openai.adapter.js";
import { GeminiAdapter} from "./adapters/gemini.adapter.js";
import { GroqAdapter } from "./adapters/groq.adapter.js";

export class AiProvider {
    static create(config) {
        const provider = config.aiProvider.toLowerCase();

        switch (provider) {
            case "gemini": {
                const apiKey = getAIApiKey("GEMINI_API_KEY");
                return new GeminiAdapter(apiKey, config.modelName);
            }

            case "openai": {
                const apiKey = getAIApiKey("OPENAI_API_KEY");
                return new OpenAIAdapter(apiKey, config.modelName);
            }

            case "groq": {
                const apiKey = getAIApiKey("GROQ_API_KEY");
                return new GroqAdapter(apiKey, config.modelName);
            }
        } 
    }
}

function getAIApiKey(envVar) {
    const apiKey = process.env[envVar];
    if (!apiKey) {
        throw new Error(`API key for ${envVar} is not set. Please set the environment variable.`);
    }
    return apiKey;
}