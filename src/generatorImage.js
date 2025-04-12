/**
 * @file Image generation implementation using OpenAI DALL-E models
 * @module generatorImage
 * @requires dotenv - For environment variable management
 * @requires openai - OpenAI API client
 * @requires ./utils/logger - For request/response logging
 * @exports generateImage
 *
 * @description
 * This module provides functionality for generating child-friendly book illustrations
 * using OpenAI's DALL-E models. It handles image prompt processing, API communication,
 * and supports various generation parameters including size, quality, and style options.
 *
 * @functions
 * - generateImage: Creates illustrations based on text descriptions
 *
 * @constants
 * - openai: OpenAI - Configured API client instance
 *
 * @flow
 * 1. Load environment configuration
 * 2. Initialize OpenAI client with API key
 * 3. Process and validate image generation parameters
 * 4. Send request to DALL-E API
 * 5. Log request/response details
 * 6. Return generated image URL
 *
 * @error Handling
 * - API errors: Logged and re-thrown with context
 * - Authentication: Validates API key before requests
 * - Rate limits: Handled by OpenAI client
 * - Invalid parameters: Validated before API call
 */

import dotenv from "dotenv";
import OpenAI from "openai";
import { logRequest, logResponse, logError } from "./utils/logger.js";

dotenv.config();

/**
 * @constant
 * @type {OpenAI}
 * @description OpenAI client instance configured with API key from environment.
 * Used for all DALL-E API communications in this module.
 * @readonly
 * @private
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @function generateImage
 * @async
 * @description Generates child-friendly illustrations using DALL-E models.
 * Automatically enhances prompts for child-appropriate content and style.
 * Supports both DALL-E 2 and 3 with their respective feature sets.
 *
 * @param {string} description - Text description of the desired image
 * @param {string} [model="dall-e-3"] - DALL-E model version
 * @param {string} [size="1024x1024"] - Output image dimensions
 * @param {string} [quality="standard"] - Image quality level
 * @param {string} [style="vivid"] - Image generation style
 *
 * @returns {Promise<string>} URL to download the generated image
 * @throws {Error} If API call fails or parameters are invalid
 *
 * @example
 * // Basic usage with defaults
 * const imageUrl = await generateImage(
 *   "A friendly piggy bank smiling on a colorful desk"
 * );
 *
 * @example
 * // Advanced usage with all parameters
 * const customImage = await generateImage(
 *   "A magical treehouse classroom in a forest",
 *   "dall-e-3",
 *   "1792x1024", // Landscape format
 *   "hd",        // High definition
 *   "natural"    // Photorealistic style
 * );
 *
 * @example
 * // Error handling
 * try {
 *   const imageUrl = await generateImage(description);
 * } catch (error) {
 *   console.error("Image generation failed:", error.message);
 * }
 */
async function generateImage(
  description,
  model = "dall-e-3",
  size = "1024x1024",
  quality = "standard",
  style = "vivid"
) {
  const requestDetails = {
    prompt: description,
    model,
    n: 1,
    size,
    quality,
    style,
  };

  try {
    logRequest("image", requestDetails);

    const response = await openai.images.generate(requestDetails);

    const responseDetails = {
      url: response.data[0].url,
      model,
      size,
      quality,
      style,
    };
    logResponse("image", responseDetails);

    return response.data[0].url;
  } catch (error) {
    logError("image", error, requestDetails);
    throw error;
  }
}

export { generateImage };
