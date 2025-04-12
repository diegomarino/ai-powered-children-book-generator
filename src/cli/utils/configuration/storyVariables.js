/**
 * @file Story variables configuration utilities
 * @module storyVariablesConfiguration
 * @requires inquirer
 * @exports configureStoryVariables
 *
 * @description Handles story variables configuration with dynamic question generation
 *
 * @functions
 * - isSectionEmpty: Checks if a section has all empty values
 * - generateQuestionForValue: Creates appropriate inquirer questions
 * - configureStoryVariables: Main configuration function
 *
 * @flow
 * 1. Load existing story variables
 * 2. Check each section for emptiness
 * 3. Generate questions for empty values
 * 4. Update and return configuration
 *
 * @error Handling
 * - Input validation for specific fields
 */

import inquirer from "inquirer";
import { STORY_VARIABLES } from "../../../../config/storyVariables.js";
import display from "../display.js";

/**
 * @function isSectionEmpty
 * @description Checks if a section of story variables is completely empty
 *
 * @param {Object} section - The section to check
 * @returns {boolean} True if all values in the section are empty
 */
function isSectionEmpty(section) {
  return Object.values(section).every((value) =>
    Array.isArray(value) ? value.length === 0 : value === ""
  );
}

/**
 * @function generateQuestionForValue
 * @description Generates an inquirer question object for a specific value
 *
 * @param {string} key - The variable key
 * @param {any} currentValue - The current value
 * @param {string} sectionName - The name of the section
 * @returns {Object} Inquirer question object
 */
function generateQuestionForValue(key, currentValue, sectionName) {
  const baseQuestion = {
    name: `${sectionName}.${key}`,
    message: `Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}:`,
  };

  if (Array.isArray(currentValue)) {
    return {
      ...baseQuestion,
      type: "input",
      message: `Enter ${key
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()} (comma-separated):`,
      filter: (input) =>
        input
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      default: currentValue.join(", "),
    };
  }

  if (key === "visualDescription") {
    return {
      ...baseQuestion,
      type: "editor",
      message:
        "Enter a detailed visual description of the character for consistent image generation.\n" +
        "Include details such as:\n" +
        "- Hair color, style, and length\n" +
        "- Eye color and facial features\n" +
        "- Skin tone\n" +
        "- Body type and height\n" +
        "- Typical clothing style\n" +
        "- Any distinguishing features\n\n" +
        "Example: A tall, slender child with curly red hair that reaches their shoulders, bright green eyes, and freckles across their nose. " +
        "They usually wear colorful, casual clothes like t-shirts and jeans, and have a warm, friendly smile.",
      default: currentValue,
    };
  }

  if (key === "protagonistGender") {
    return {
      ...baseQuestion,
      type: "list",
      choices: ["male", "female", "other"],
      default: currentValue,
    };
  }

  if (key === "protagonistAge") {
    return {
      ...baseQuestion,
      type: "number",
      validate: (input) =>
        input > 0 && input < 18 ? true : "Age must be between 1 and 17",
      default: currentValue ? parseInt(currentValue) : undefined,
    };
  }

  return {
    ...baseQuestion,
    type: "input",
    default: currentValue,
  };
}

/**
 * @function configureStoryVariables
 * @async
 * @description Prompts the user for story character and setting details
 *
 * @returns {Promise<Object>} The configured story variables
 *
 * @example
 * const storyVariables = await configureStoryVariables();
 */
export async function configureStoryVariables() {
  const storyVariables = structuredClone(STORY_VARIABLES);
  const questions = [];

  // Process each section sequentially
  for (const [sectionName, section] of Object.entries(storyVariables)) {
    // Get empty fields in this section
    const emptyFields = Object.entries(section)
      .filter(([_, value]) =>
        Array.isArray(value) ? value.length === 0 : value === ""
      )
      .map(([key]) => key.replace(/([A-Z])/g, " $1").toLowerCase());

    if (emptyFields.length > 0) {
      display.title(
        `The ${sectionName} section has the following empty fields:`
      );
      emptyFields.forEach((field) => display.listItem(field));

      const { fillSection } = await inquirer.prompt([
        {
          type: "expand",
          name: "fillSection",
          message: `Would you like to fill these ${emptyFields.length} fields?`,
          choices: [
            {
              key: "y",
              name: "Yes",
              value: true,
            },
            {
              key: "n",
              name: "No",
              value: false,
            },
          ],
          default: 1, // Default to No (index 1)
        },
      ]);

      if (fillSection) {
        // Generate and ask questions only for this section's empty fields
        const sectionQuestions = Object.entries(section)
          .filter(([_, value]) =>
            Array.isArray(value) ? value.length === 0 : value === ""
          )
          .map(([key, value]) =>
            generateQuestionForValue(key, value, sectionName)
          );

        const sectionAnswers = await inquirer.prompt(sectionQuestions);

        // Update storyVariables with new answers for this section
        Object.entries(sectionAnswers).forEach(([path, value]) => {
          const [_, key] = path.split(".");
          storyVariables[sectionName][key] = value;
        });
      }
    }
  }

  return storyVariables;
}
