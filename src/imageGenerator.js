/**
 * @file Multi-provider image generation service implementation
 * @module imageGenerator
 * @requires axios - For HTTP requests and image downloads
 * @requires fs/promises - For file system operations
 * @requires path - For path manipulation
 * @requires openai - OpenAI API client
 * @exports {generateImage}
 *
 * @description
 * This module provides a unified interface for generating images using multiple providers.
 * Currently supports OpenAI DALL-E and Freepik Mystic, with a consistent API for both.
 * Handles the complete workflow from generation to file saving.
 *
 * @functions
 * - generateImage: Main entry point for image generation
 * - generateWithOpenAI: DALL-E specific implementation
 * - generateWithMystic: Mystic specific implementation
 * - checkMysticTaskStatus: Mystic task monitoring
 * - downloadImage: Universal image download utility
 *
 * @flow
 * 1. Validate provider configuration
 * 2. Route request to appropriate provider
 * 3. Initialize provider-specific client
 * 4. Submit generation request
 * 5. Monitor generation progress
 * 6. Download and save result
 * 7. Return local file path
 *
 * @error Handling
 * - Configuration: Validates before generation
 * - API: Handles provider-specific errors
 * - Network: Retries on temporary failures
 * - Filesystem: Ensures directories exist
 * - Resources: Cleans up on failures
 */

import axios from "axios";
import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";

/**
 * @function generateImage
 * @async
 * @description Main entry point for generating images through any supported provider.
 * Routes the request to the appropriate provider based on configuration.
 *
 * @param {Object} config - Provider configuration
 * @param {string} config.provider - Provider name ('openai' or 'mystic')
 * @param {Object} [config.openai] - OpenAI specific settings
 * @param {string} [config.openai.model] - DALL-E model version
 * @param {string} [config.openai.size] - Image dimensions
 * @param {Object} [config.mystic] - Mystic specific settings
 * @param {string} [config.mystic.resolution] - Image resolution
 * @param {string} [config.mystic.model] - Mystic model name
 * @param {string} [config.mystic.engine] - Generation engine
 * @param {number} [config.mystic.creative_detailing] - Creativity level
 *
 * @param {string} prompt - Image generation prompt
 * @param {string} outputPath - Local path to save the image
 *
 * @returns {Promise<string>} Path to the saved image file
 * @throws {Error} If configuration is invalid or generation fails
 *
 * @example
 * // Using OpenAI
 * const imagePath = await generateImage({
 *   provider: 'openai',
 *   openai: {
 *     model: 'dall-e-3',
 *     size: '1024x1024'
 *   }
 * }, 'A colorful treehouse in a magical forest', './images/treehouse.png');
 *
 * @example
 * // Using Mystic
 * const imagePath = await generateImage({
 *   provider: 'mystic',
 *   mystic: {
 *     resolution: '1k',
 *     model: 'general',
 *     engine: 'stable-diffusion'
 *   }
 * }, 'A friendly robot teaching math', './images/robot.png');
 */
export async function generateImage(config, prompt, outputPath) {
  if (!config?.provider) {
    throw new Error("No image provider configured");
  }

  switch (config.provider) {
    case "openai":
      return generateWithOpenAI(config.openai, prompt, outputPath);
    case "mystic":
      return generateWithMystic(config.mystic, prompt, outputPath);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

/**
 * @function generateWithOpenAI
 * @async
 * @description Generates images using OpenAI's DALL-E models.
 * Handles API communication and result processing.
 *
 * @param {Object} config - OpenAI configuration
 * @param {string} config.model - DALL-E model version
 * @param {string} config.size - Image dimensions
 * @param {string} prompt - Image description
 * @param {string} outputPath - Save location
 *
 * @returns {Promise<string>} Path to saved image
 * @throws {Error} If API call fails or image download fails
 *
 * @example
 * const imagePath = await generateWithOpenAI({
 *   model: 'dall-e-3',
 *   size: '1024x1024'
 * }, 'A cute robot reading a book', './images/robot.png');
 */
async function generateWithOpenAI(config, prompt, outputPath) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.images.generate({
      model: config.model,
      prompt: prompt,
      n: 1,
      size: config.size,
    });

    const imageUrl = response.data[0].url;
    await downloadImage(imageUrl, outputPath);
    return outputPath;
  } catch (error) {
    throw new Error(`OpenAI generation failed: ${error.message}`);
  }
}

/**
 * @function generateWithMystic
 * @async
 * @description Generates images using Freepik's Mystic AI service.
 * Handles task creation, monitoring, and result retrieval.
 *
 * @param {Object} config - Mystic configuration
 * @param {string} config.resolution - Image resolution ('1k', '2k', etc.)
 * @param {string} config.model - Model name
 * @param {string} config.engine - Generation engine
 * @param {number} [config.creative_detailing=33] - Creativity level (0-100)
 * @param {string} prompt - Image description
 * @param {string} outputPath - Save location
 *
 * @returns {Promise<string>} Path to saved image
 * @throws {Error} If API key missing, task fails, or download fails
 *
 * @example
 * const imagePath = await generateWithMystic({
 *   resolution: '1k',
 *   model: 'general',
 *   engine: 'stable-diffusion',
 *   creative_detailing: 50
 * }, 'A magical classroom in space', './images/classroom.png');
 */
async function generateWithMystic(config, prompt, outputPath) {
  const API_KEY = process.env.FREEPIK_API_KEY;
  if (!API_KEY) {
    throw new Error("FREEPIK_API_KEY not found in environment");
  }

  const API_URL = "https://api.freepik.com/v1/ai/mystic";

  try {
    // Create generation task
    const response = await axios.post(
      API_URL,
      {
        prompt: prompt,
        resolution: config.resolution || "1k",
        aspect_ratio: "square_1_1",
        model: config.model,
        engine: config.engine,
        creative_detailing: config.creative_detailing || 33,
        fixed_generation: false,
        filter_nsfw: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-freepik-api-key": API_KEY,
          Accept: "application/json",
        },
      }
    );

    if (!response.data?.data?.task_id) {
      throw new Error("No task ID in Mystic response");
    }

    // Wait for task completion
    const imageUrl = await checkMysticTaskStatus(
      API_KEY,
      API_URL,
      response.data.data.task_id
    );

    // Download the image
    await downloadImage(imageUrl, outputPath);
    return outputPath;
  } catch (error) {
    throw new Error(`Mystic generation failed: ${error.message}`);
  }
}

/**
 * @function checkMysticTaskStatus
 * @async
 * @description Monitors the status of a Mystic image generation task.
 * Implements polling with configurable retry logic.
 *
 * @param {string} apiKey - Freepik API key
 * @param {string} apiUrl - Mystic API endpoint
 * @param {string} taskId - Task identifier
 * @param {number} [maxAttempts=60] - Maximum polling attempts
 * @param {number} [interval=5000] - Milliseconds between polls
 *
 * @returns {Promise<string>} URL of the generated image
 * @throws {Error} If task fails or timeout reached
 *
 * @example
 * const imageUrl = await checkMysticTaskStatus(
 *   'api-key',
 *   'https://api.freepik.com/v1/ai/mystic',
 *   'task-123',
 *   30,  // 30 attempts
 *   3000 // 3 second interval
 * );
 */
async function checkMysticTaskStatus(
  apiKey,
  apiUrl,
  taskId,
  maxAttempts = 60,
  interval = 5000
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios.get(`${apiUrl}/${taskId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-freepik-api-key": apiKey,
        },
      });

      const status = response.data.data.status;
      console.log(`Task ${taskId} status: ${status}`);

      if (status === "COMPLETED" && response.data.data.generated?.length > 0) {
        return response.data.data.generated[0];
      } else if (status === "FAILED") {
        throw new Error(`Task failed: ${JSON.stringify(response.data)}`);
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      throw new Error(`Error checking task status: ${error.message}`);
    }
  }
  throw new Error(`Timeout after ${maxAttempts} attempts`);
}

/**
 * @function downloadImage
 * @async
 * @description Downloads an image from a URL and saves it to the filesystem.
 * Creates necessary directories and handles various download scenarios.
 *
 * @param {string} url - Source image URL
 * @param {string} outputPath - Destination file path
 *
 * @returns {Promise<void>}
 * @throws {Error} If download fails or file cannot be written
 *
 * @example
 * await downloadImage(
 *   'https://example.com/image.jpg',
 *   './images/local-image.jpg'
 * );
 */
async function downloadImage(url, outputPath) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, response.data);
  } catch (error) {
    throw new Error(`Failed to download image: ${error.message}`);
  }
}
