/**
 * @file OpenAI configuration constants
 * @module openaiConfig
 * @requires none
 * @exports {OPENAI_CHAT_MODELS, OPENAI_IMAGE_MODELS, IMAGE_SIZES}
 *
 * @description This module defines the available OpenAI models and configurations
 * used for generating book content and illustrations.
 *
 * @functions
 * - None
 *
 * @constants
 * - OPENAI_CHAT_MODELS: Available text generation models with default parameters
 * - OPENAI_IMAGE_MODELS: Available image generation models with default sizes
 * - IMAGE_SIZES: Available image sizes for each model with aspect ratios
 *
 * @flow
 * 1. Define available chat models with default parameters
 * 2. Define available image models with default sizes
 * 3. Define image size options per model with aspect ratios
 *
 * @error Handling
 * - None, this is a static data module
 */

/**
 * @constant {Array<Object>}
 * @type {Array}
 * @description Available OpenAI chat models for text generation
 * @property {string} name - Human-readable model name with description
 * @property {string} value - API model identifier
 * @property {Object} defaults - Default generation parameters
 */
export const OPENAI_CHAT_MODELS = [
  {
    name: "GPT-4 (Most capable, slower, more expensive)",
    value: "gpt-4",
    defaults: {
      temperature: 0.7, // [0.0-2.0] randomness of output
      top_p: 1.0, // [0.0-1.0] nucleus sampling scope
      frequency_penalty: 0.4, // [0.0-2.0] discourages word repetition
      presence_penalty: 0.4, // [0.0-2.0] encourages topic diversity
    },
  },
  {
    name: "GPT-4 Turbo (Faster, slightly less accurate)",
    value: "gpt-4-turbo-preview",
    defaults: {
      temperature: 0.7,
      top_p: 1.0,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
    },
  },
  {
    name: "GPT-3.5 Turbo (Fast, less expensive)",
    value: "gpt-3.5-turbo",
    defaults: {
      temperature: 0.7,
      top_p: 1.0,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
    },
  },
];

/**
 * @constant {Array<Object>}
 * @type {Array}
 * @description Available OpenAI image models for illustration generation
 * @property {string} name - Human-readable model name with description
 * @property {string} value - API model identifier
 * @property {string} defaultSize - Default image size for this model
 */
export const OPENAI_IMAGE_MODELS = [
  {
    name: "DALL-E 3 (Highest quality, most accurate)",
    value: "dall-e-3",
    defaultSize: "1024x1024",
  },
  {
    name: "DALL-E 2 (Faster, less expensive)",
    value: "dall-e-2",
    defaultSize: "1024x1024",
  },
];

/**
 * @constant {Object}
 * @type {Object}
 * @description Available image sizes for each OpenAI image model
 * @property {Array} model - Array of size options for each model
 * @property {string} model[].name - Human-readable size name
 * @property {string} model[].value - Size dimensions (e.g., "1024x1024")
 * @property {string} model[].aspect - Aspect ratio type (square, landscape, portrait)
 */
export const IMAGE_SIZES = {
  "dall-e-3": [
    { name: "1024x1024 (Square)", value: "1024x1024", aspect: "square" },
    { name: "1792x1024 (Landscape)", value: "1792x1024", aspect: "landscape" },
    { name: "1024x1792 (Portrait)", value: "1024x1792", aspect: "portrait" },
  ],
  "dall-e-2": [
    { name: "256x256 (Small)", value: "256x256", aspect: "square" },
    { name: "512x512 (Medium)", value: "512x512", aspect: "square" },
    { name: "1024x1024 (Large)", value: "1024x1024", aspect: "square" },
  ],
};
