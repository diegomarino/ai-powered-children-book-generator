/**
 * @file Book configuration command
 * @module configureBook
 * @requires inquirer
 * @requires chalk
 * @requires fs/promises
 * @requires path
 * @exports configureNewBook
 *
 * @description This module orchestrates the configuration of a new book,
 * delegating to specialized modules for image generation and story variable configuration.
 *
 * @functions
 * - configureNewBook: Main configuration orchestrator for new books
 *
 * @flow
 * 1. Configure chat model settings
 * 2. Configure image generation settings
 * 3. Configure story variables
 * 4. Save configuration to book state file
 *
 * @error Handling
 * - File system errors when saving configuration
 */

import fs from "fs/promises";
import display from "../utils/display.js";
import path from "path";
import { configureOpenAI } from "../utils/configuration/openai.js";
import { configureImageGenerator } from "../utils/configuration/imageGenerator.js";
import { configureStoryVariables } from "../utils/configuration/storyVariables.js";

/**
 * @function configureNewBook
 * @async
 * @description Main function to configure a new book with model settings and story variables
 *
 * @param {string} bookPath - Path to the book directory
 *
 * @returns {Promise<boolean>} Whether configuration was successful
 * @throws {Error} If there are issues reading or writing state files
 *
 * @example
 * const success = await configureNewBook('/path/to/book');
 */
export async function configureNewBook(bookPath) {
  display.header("Let's configure your new book!");

  try {
    // Step 1: Configure chat model settings
    display.title("First, let's set up the chat model configuration:");
    const chatConfig = await configureOpenAI();

    // Step 2: Configure image generation settings
    display.title("Now, let's set up the image generation configuration:");
    const imageConfig = await configureImageGenerator();

    // Step 3: Configure story variables
    display.title("Finally, let's set up the story variables:");
    const storyVariables = await configureStoryVariables();

    // Step 4: Update book-state.json with the configurations
    const statePath = path.join(bookPath, "book-state.json");
    const currentState = JSON.parse(await fs.readFile(statePath, "utf8"));

    const updatedState = {
      ...currentState,
      chatConfig,
      imageConfig,
      storyVariables,
    };

    await fs.writeFile(statePath, JSON.stringify(updatedState, null, 2));

    display.success("Book configuration completed successfully!");
    return true;
  } catch (error) {
    display.error("Error during book configuration:", error);
    return false;
  }
}
