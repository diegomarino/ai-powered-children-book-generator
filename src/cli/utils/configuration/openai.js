/**
 * @file OpenAI chat configuration utilities
 * @module openaiChatConfiguration
 * @requires inquirer
 * @exports configureOpenAI
 *
 * @description Handles OpenAI chat model configuration prompts and validation
 *
 * @functions
 * - configureOpenAI: Prompts for chat model and parameter settings
 *
 * @constants
 * - Imported from config/openaiConfig.js
 *
 * @flow
 * 1. Prompt for chat model selection
 * 2. Show default parameters
 * 3. Optionally customize parameters
 *
 * @error Handling
 * - Input validation for temperature range
 */

import inquirer from "inquirer";
import display from "../display.js";
import { OPENAI_CHAT_MODELS } from "../../../../config/imageGeneratorConfig.js";

/**
 * @function configureOpenAI
 * @async
 * @description Prompts the user to select OpenAI chat model settings
 *
 * @returns {Promise<Object>} The selected OpenAI chat configuration
 * @property {string} chatModel - Selected chat model ID
 * @property {number} temperature - Temperature setting for text generation
 * @property {number} top_p - Top P setting for text generation
 * @property {number} frequency_penalty - Frequency penalty for text generation
 * @property {number} presence_penalty - Presence penalty for text generation
 *
 * @example
 * const chatConfig = await configureOpenAI();
 * // Returns: {
 * //   chatModel: "gpt-4",
 * //   temperature: 0.7,
 * //   top_p: 1.0,
 * //   frequency_penalty: 0.4,
 * //   presence_penalty: 0.4,
 * // }
 */
export async function configureOpenAI() {
  // First, select the chat model
  const { chatModel } = await inquirer.prompt([
    {
      type: "list",
      name: "chatModel",
      message: "Select the chat model to use for generating text:",
      choices: OPENAI_CHAT_MODELS,
    },
  ]);

  // Get the selected model's defaults
  const selectedModel = OPENAI_CHAT_MODELS.find((m) => m.value === chatModel);
  const modelDefaults = selectedModel.defaults;

  // Display current default parameters
  display.title(`Default generation parameters for ${selectedModel.name}:`);
  display.listItem(
    display.withExplanation(
      `temperature: ${modelDefaults.temperature}`,
      "0.0-2.0, higher = more creative"
    )
  );
  display.listItem(
    display.withExplanation(
      `top_p: ${modelDefaults.top_p}`,
      "0.0-1.0, lower = more focused"
    )
  );
  display.listItem(
    display.withExplanation(
      `frequency_penalty: ${modelDefaults.frequency_penalty}`,
      "0.0-2.0, higher = less repetition"
    )
  );
  display.listItem(
    display.withExplanation(
      `presence_penalty: ${modelDefaults.presence_penalty}`,
      "0.0-2.0, higher = more topic diversity"
    )
  );
  display.blank();

  // Ask if user wants to customize parameters
  const { customizeParams } = await inquirer.prompt([
    {
      type: "confirm",
      name: "customizeParams",
      message: "Would you like to customize these generation parameters?",
      default: false,
    },
  ]);

  let generationParams;
  if (customizeParams) {
    generationParams = await inquirer.prompt([
      {
        type: "number",
        name: "temperature",
        message: "Set the temperature (0.0 to 2.0, higher = more creative):",
        default: modelDefaults.temperature,
        validate: (input) => {
          if (input >= 0 && input <= 2) return true;
          return "Temperature must be between 0 and 2";
        },
      },
      {
        type: "number",
        name: "top_p",
        message: "Set the top P (0.0 to 1.0, lower = more focused):",
        default: modelDefaults.top_p,
        validate: (input) => {
          if (input >= 0 && input <= 1) return true;
          return "Top P must be between 0 and 1";
        },
      },
      {
        type: "number",
        name: "frequency_penalty",
        message:
          "Set the frequency penalty (0.0 to 2.0, higher = less repetition):",
        default: modelDefaults.frequency_penalty,
        validate: (input) => {
          if (input >= 0 && input <= 2) return true;
          return "Frequency penalty must be between 0 and 2";
        },
      },
      {
        type: "number",
        name: "presence_penalty",
        message:
          "Set the presence penalty (0.0 to 2.0, higher = more topic diversity):",
        default: modelDefaults.presence_penalty,
        validate: (input) => {
          if (input >= 0 && input <= 2) return true;
          return "Presence penalty must be between 0 and 2";
        },
      },
    ]);
  } else {
    generationParams = modelDefaults;
  }

  return {
    chatModel,
    ...generationParams,
  };
}
