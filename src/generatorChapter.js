/**
 * @file Chapter generation implementation using OpenAI GPT models
 * @module generatorChapter
 * @requires dotenv - For environment variable management
 * @requires openai - OpenAI API client
 * @requires ./promptBuilder - For generating and personalizing prompts
 * @requires ./utils/logger - For request/response logging
 * @exports generateChapter
 *
 * @description
 * This module provides functionality for generating children's book chapters about economics
 * using OpenAI's GPT models. It handles prompt construction, API communication, and content
 * generation with support for personalization and context awareness.
 *
 * @functions
 * - generateChapter: Generates chapter content with topic, subtopics, and story variables
 *
 * @constants
 * - openai: OpenAI - Configured API client instance
 *
 * @flow
 * 1. Load environment configuration
 * 2. Initialize OpenAI client with API key
 * 3. Build chapter prompt with topic and variables
 * 4. Send prompt to OpenAI API
 * 5. Log request/response details
 * 6. Process and return generated content
 *
 * @error Handling
 * - API errors: Logged and re-thrown with context
 * - Authentication: Validates API key before requests
 * - Rate limits: Handled by OpenAI client
 * - Token limits: Managed through max_tokens parameter
 */

import dotenv from "dotenv";
import OpenAI from "openai";
import {
  buildChapterPrompt,
  personalizeChapterContent,
} from "./promptBuilder.js";
import { logRequest, logResponse, logError } from "./utils/logger.js";

dotenv.config();

/**
 * @constant
 * @type {OpenAI}
 * @description OpenAI client instance configured with API key from environment.
 * Used for all API communications in this module.
 * @readonly
 * @private
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @function generateChapter
 * @async
 * @description Generates an educational book chapter about economics for children.
 * The function can operate in two modes:
 * 1. Initial generation: Creates new content from topic and subtopics
 * 2. Personalization: Adapts existing content using story variables
 *
 * @param {string} topic - Main topic of the chapter (e.g., "Saving Money")
 * @param {string[]} subtopics - Array of subtopics to cover in the chapter
 * @param {Object} storyVariables - Story personalization variables
 * @param {string} storyVariables.protagonist - Main character name
 * @param {string} storyVariables.setting - Story setting/location
 * @param {Object} storyVariables.characters - Supporting characters
 * @param {string} [previousContext=""] - Previous content or personalization prompt
 * @param {string} [model="gpt-4"] - GPT model to use
 * @param {number} [temperature=0.7] - Creativity level (0.0-1.0)
 *
 * @returns {Promise<string>} Generated chapter content
 * @throws {Error} If API call fails or invalid parameters provided
 *
 * @example
 * // Initial chapter generation
 * const storyVars = {
 *   protagonist: "Luna",
 *   setting: "Magical Forest",
 *   characters: {
 *     friend: "Oliver",
 *     mentor: "Wise Owl"
 *   }
 * };
 *
 * const chapter = await generateChapter(
 *   "Saving Money",
 *   ["Piggy Banks", "Setting Goals"],
 *   storyVars
 * );
 *
 * @example
 * // Content personalization
 * const personalizedChapter = await generateChapter(
 *   "Saving Money",
 *   [],
 *   storyVars,
 *   "Please review and adapt...", // Personalization prompt
 *   "gpt-4",
 *   0.5
 * );
 */
async function generateChapter(
  topic,
  subtopics,
  storyVariables,
  previousContext = "",
  model = "gpt-4",
  temperature = 0.7
) {
  // If previousContext is a complete prompt (for personalization step), use it directly
  const fullPrompt = previousContext.includes("Please review and adapt")
    ? previousContext
    : buildChapterPrompt(topic, subtopics, storyVariables);

  const messages = [
    {
      role: "system",
      content: previousContext.includes("Please review and adapt")
        ? "You are an expert editor specializing in children's literature. Your task is to naturally incorporate character and story details while preserving the educational content and narrative flow."
        : "You are a successful children's book author writing. Use a friendly and engaging tone, practical examples that children can relate to, and maintain consistency with the provided characters and situations throughout the story.",
    },
    {
      role: "user",
      content: fullPrompt,
    },
  ];

  const requestDetails = {
    model,
    messages,
    max_tokens: 4000,
    temperature,
  };

  try {
    logRequest("chat", requestDetails);

    const response = await openai.chat.completions.create(requestDetails);

    const responseDetails = {
      model,
      temperature,
      content: response.choices[0].message.content,
      usage: response.usage,
    };
    logResponse("chat", responseDetails);

    return response.choices[0].message.content.trim();
  } catch (error) {
    logError("chat", error, requestDetails);
    throw error;
  }
}

export { generateChapter };
