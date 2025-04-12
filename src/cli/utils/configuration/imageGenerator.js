/**
 * @file Image generator configuration utilities
 * @module imageGeneratorConfiguration
 * @requires inquirer
 * @exports configureImageGenerator
 *
 * @description Handles image generation configuration prompts and validation
 *
 * @functions
 * - configureImageGenerator: Prompts for image provider and settings
 *
 * @constants
 * - Imported from config/imageGeneratorConfig.js and config/imageStyles.js
 *
 * @flow
 * 1. Prompt for provider selection
 * 2. Provider-specific configuration
 * 3. Style selection
 *
 * @error Handling
 * - Input validation for provider-specific parameters
 * - Fallback to default style if not selected
 */

import inquirer from "inquirer";
import display from "../display.js";
import {
  IMAGE_PROVIDERS,
  OPENAI_IMAGE_MODELS,
  MYSTIC_MODELS,
  MYSTIC_ENGINES,
} from "../../../../config/imageGeneratorConfig.js";
import { DEFAULT_IMAGE_STYLE_PROMPT } from "../../../../config/imageStyles.js";

/**
 * @function configureImageGenerator
 * @async
 * @description Prompts the user to select image generation provider and settings
 *
 * @returns {Promise<Object>} The selected image generation configuration
 * @property {string} provider - Selected provider (openai/mystic)
 * @property {Object} openai - OpenAI-specific settings (if selected)
 * @property {Object} mystic - Mystic-specific settings (if selected)
 * @property {string} imageStyle - Selected illustration style
 *
 * @example
 * const imageConfig = await configureImageGenerator();
 * // Returns: {
 * //   provider: "openai",
 * //   openai: {
 * //     model: "dall-e-3",
 * //     size: "1024x1024"
 * //   },
 * //   imageStyle: "watercolor"
 * // }
 * // Or:
 * // {
 * //   provider: "mystic",
 * //   mystic: {
 * //     model: "realism",
 * //     engine: "automatic",
 * //     resolution: "1k",
 * //     creative_detailing: 33
 * //   },
 * //   imageStyle: "watercolor"
 * // }
 */
export async function configureImageGenerator() {
  // First, select the provider
  const { provider } = await inquirer.prompt([
    {
      type: "list",
      name: "provider",
      message: "Select the image generation provider:",
      choices: IMAGE_PROVIDERS,
    },
  ]);

  let config = { provider };

  if (provider === "openai") {
    // Configure OpenAI settings
    const { model } = await inquirer.prompt([
      {
        type: "list",
        name: "model",
        message: "Select the DALL-E model to use:",
        choices: OPENAI_IMAGE_MODELS,
      },
    ]);

    const selectedModel = OPENAI_IMAGE_MODELS.find((m) => m.value === model);
    config.openai = {
      model,
      size: selectedModel.defaultSize,
    };
  } else {
    // Configure Mystic settings
    const { model, engine, resolution, creative_detailing } =
      await inquirer.prompt([
        {
          type: "list",
          name: "model",
          message: "Select the Mystic model to use:",
          choices: MYSTIC_MODELS.map((m) => ({
            name: `${m.name} - ${m.description}`,
            value: m.value,
          })),
        },
        {
          type: "list",
          name: "engine",
          message: "Select the Mystic engine to use:",
          choices: MYSTIC_ENGINES.map((e) => ({
            name: `${e.name} - ${e.description}`,
            value: e.value,
          })),
        },
        {
          type: "list",
          name: "resolution",
          message: "Select the image resolution:",
          choices: [
            { name: "1K (Faster, less expensive)", value: "1k" },
            { name: "2K (Better quality, more expensive)", value: "2k" },
            { name: "4K (Highest quality, most expensive)", value: "4k" },
          ],
          default: "1k",
        },
        {
          type: "number",
          name: "creative_detailing",
          message: "Set the creative detailing level (0-100):",
          default: 33,
          validate: (input) => {
            if (input >= 0 && input <= 100) return true;
            return "Creative detailing must be between 0 and 100";
          },
        },
      ]);

    config.mystic = {
      model,
      engine,
      resolution,
      creative_detailing,
    };
  }

  // Select illustration style
  const { imageStyle } = await inquirer.prompt([
    {
      type: "list",
      name: "imageStyle",
      message: "Select the default illustration style:",
      choices: DEFAULT_IMAGE_STYLE_PROMPT.map((style) => ({
        name: `${style.name} - ${style.prompt.slice(0, 60)}...`,
        value: style.name,
      })),
      default: "storybook",
    },
  ]);

  config.imageStyle = imageStyle;
  return config;
}
