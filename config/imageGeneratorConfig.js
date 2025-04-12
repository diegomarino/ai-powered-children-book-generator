/**
 * @file Image generation configuration constants
 * @module imageGeneratorConfig
 * @requires none
 * @exports {IMAGE_PROVIDERS, OPENAI_CHAT_MODELS, OPENAI_IMAGE_MODELS, IMAGE_SIZES, MYSTIC_MODELS, MYSTIC_ENGINES}
 *
 * @description This module defines the available image generation providers and their configurations
 * used for generating book illustrations.
 *
 * @functions
 * - None
 *
 * @constants
 * - IMAGE_PROVIDERS: Available image generation providers
 * - OPENAI_CHAT_MODELS: Available text generation models with default parameters
 * - OPENAI_IMAGE_MODELS: Available OpenAI image generation models with default sizes
 * - IMAGE_SIZES: Available image sizes for each OpenAI model with aspect ratios
 * - MYSTIC_MODELS: Available Freepik Mystic models
 * - MYSTIC_ENGINES: Available Freepik Mystic engines
 *
 * @flow
 * 1. Define available image generation providers
 * 2. Define OpenAI-specific configurations
 * 3. Define Mystic-specific configurations
 *
 * @error Handling
 * - None, this is a static data module
 */

/**
 * @constant {Array<Object>}
 * @type {Array}
 * @description Available image generation providers
 * @property {string} name - Human-readable provider name with description
 * @property {string} value - Provider identifier
 */
export const IMAGE_PROVIDERS = [
  {
    name: "OpenAI DALL-E (Traditional illustration styles)",
    value: "openai",
  },
  {
    name: "Freepik Mystic (Modern and artistic styles)",
    value: "mystic",
  },
];

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

/**
 * @constant {Array<Object>}
 * @type {Array}
 * @description Available Freepik Mystic models
 * @property {string} name - Human-readable model name with description
 * @property {string} value - Model identifier
 * @property {string} description - Detailed description of model characteristics
 */
export const MYSTIC_MODELS = [
  {
    name: "Realism",
    value: "realism",
    description:
      "More realistic color palette, tries to give an extra boost of reality to images. Works well with photographs and illustrations.",
  },
  {
    name: "Fluid",
    value: "fluid",
    description:
      "Best prompt adherence and great average quality. Can generate creative images and will always follow your input.",
  },
  {
    name: "Zen",
    value: "zen",
    description:
      "Smoother, basic, and cleaner results. Fewer objects in the scene and less intricate details. Softer looking.",
  },
];

/**
 * @constant {Array<Object>}
 * @type {Array}
 * @description Available Freepik Mystic engines
 * @property {string} name - Human-readable engine name with description
 * @property {string} value - Engine identifier
 * @property {string} description - Detailed description of engine characteristics
 */
export const MYSTIC_ENGINES = [
  {
    name: "Automatic",
    value: "automatic",
    description:
      "Default choice that automatically selects the best engine for your prompt.",
  },
  {
    name: "Illusio",
    value: "magnific_illusio",
    description:
      "Better for smoother illustrations, landscapes, and nature. The softer looking one.",
  },
  {
    name: "Sharpy",
    value: "magnific_sharpy",
    description:
      "Better for realistic images and photographs. Provides the sharpest and most detailed images.",
  },
  {
    name: "Sparkle",
    value: "magnific_sparkle",
    description:
      "Good for realistic images. A middle ground between Illusio and Sharpy.",
  },
];
