/**
 * @file Scene selection for image generation
 * @module sceneSelector
 * @requires openai
 * @exports selectSceneForImage
 *
 * @description This module uses ChatGPT to analyze chapter text and select
 * the most visually interesting scene for image generation.
 *
 * @functions
 * - selectSceneForImage: Analyzes text and returns a scene description
 *
 * @flow
 * 1. Send chapter text to ChatGPT
 * 2. Get scene selection and summary
 * 3. Return formatted scene description
 *
 * @error Handling
 * - API errors: Passed through to caller
 * - Empty text: Returns null
 */

import OpenAI from "openai";
import { logRequest, logResponse, logError } from "./utils/logger.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @function selectSceneForImage
 * @async
 * @description Analyzes chapter text to select and summarize a scene for image generation
 *
 * @param {string} chapterText - The full chapter text to analyze
 * @param {string} topic - The chapter's topic
 * @param {Object} [config] - Optional configuration
 * @param {string} [config.model="gpt-4"] - GPT model to use
 * @param {number} [config.temperature=0.7] - Temperature for generation
 *
 * @returns {Promise<Object>} Selected scene information
 * @property {string} scene - The selected scene description
 * @property {string} summary - A concise summary for image generation
 * @throws {Error} If the API call fails
 *
 * @example
 * const scene = await selectSceneForImage(
 *   chapterText,
 *   "Saving Money",
 *   { model: "gpt-4", temperature: 0.7 }
 * );
 */
async function selectSceneForImage(
  chapterText,
  topic,
  config = { model: "gpt-4", temperature: 0.7 }
) {
  if (!chapterText) return null;

  const messages = [
    {
      role: "system",
      content:
        "You are a visual storytelling assistant. Your job is to read the input chapter and identify the most visually compelling moment that illustrates its main idea. You must focus on choosing a moment with strong visual potential and emotional impact, not just importance in the narrative.",
    },
    {
      role: "user",
      content: `Please analyze this chapter about "${topic}" and:
1. Select the most visually compelling scene that reflects the main educational message.
2. Describe that scene vividly in 2–3 sentences, focusing on setting, characters, and actions, using sensory and visual language.
3. Write a final one-sentence description optimized for image generation (avoiding abstract concepts, using concrete visual terms, no text in image).

Chapter text:
${chapterText}`,
    },
  ];

  const requestDetails = {
    model: config.model,
    messages,
    temperature: config.temperature,
    max_tokens: 1000,
  };

  try {
    logRequest("scene-selection", requestDetails);

    const response = await openai.chat.completions.create(requestDetails);

    const content = response.choices[0].message.content;

    // Parse the response to extract scene and summary
    const lines = content.split("\n").filter((line) => line.trim());
    const scene = lines[0];
    const summary = lines[lines.length - 1];

    const responseDetails = {
      model: config.model,
      temperature: config.temperature,
      content,
      usage: response.usage,
    };
    logResponse("scene-selection", responseDetails);

    return {
      scene,
      summary,
    };
  } catch (error) {
    logError("scene-selection", error, requestDetails);
    throw error;
  }
}

export { selectSceneForImage };
