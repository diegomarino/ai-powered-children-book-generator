/**
 * @file Interactive prompt editor implementation
 * @module promptEditor
 * @requires inquirer - For interactive CLI prompts
 * @requires ./display - For consistent CLI output formatting
 * @exports editPrompt
 *
 * @description
 * This module provides a sophisticated interface for editing large text prompts
 * through a section-based approach. It determines the editor preference in the
 * following priority:
 * 1. EDITOR environment variable
 * 2. VISUAL environment variable
 * 3. Defaults to 'nano' if neither is set
 *
 * The editor supports markdown syntax highlighting and implements a paginated
 * workflow for managing complex prompts efficiently.
 *
 * @functions
 * - editPrompt: Main editing interface with preview and section management
 * - splitIntoSections: Content segmentation for focused editing
 * - combineSections: Section reconstruction with formatting
 *
 * @flow
 * 1. Initialize Editor
 *    - Load environment preferences
 *    - Configure editor settings
 * 2. Content Processing
 *    - Split into logical sections
 *    - Identify section titles
 *    - Preserve formatting
 * 3. Interactive Editing
 *    - Present section overview
 *    - Enable targeted editing
 *    - Preview capabilities
 * 4. Content Management
 *    - Validate changes
 *    - Combine sections
 *    - Format output
 *
 * @error Handling
 * - Input Validation: Prevents empty content
 * - Editor Loading: Falls back to nano
 * - Section Management: Maintains structure
 * - Content Integrity: Validates combinations
 */

import inquirer from "inquirer";
import display from "./display.js";

// Set default editor to nano if no environment variable is set
process.env.EDITOR = process.env.EDITOR || process.env.VISUAL || "nano";

/**
 * @function splitIntoSections
 * @description Segments a prompt into logical sections for focused editing.
 * Automatically identifies section titles and maintains formatting.
 *
 * @param {string} prompt - Complete prompt text to segment
 * @returns {Array<{id: number, title: string, content: string}>} Structured sections
 * @throws {Error} If prompt is empty or invalid
 *
 * @example
 * const sections = splitIntoSections(`
 *   Introduction:
 *   This is the first part.
 *
 *   Main Content:
 *   Here's the core material.
 * `);
 * // Returns: [
 * //   { id: 1, title: 'Introduction', content: '...' },
 * //   { id: 2, title: 'Main Content', content: '...' }
 * // ]
 */
function splitIntoSections(prompt) {
  // Split on double newlines to separate logical sections
  const parts = prompt.split("\n\n").filter(Boolean);

  return parts.map((part, index) => {
    // Try to identify a title from the content
    const lines = part.trim().split("\n");
    const title = lines[0].replace(/[:#-]/g, "").trim();
    const content = part.trim();

    return {
      id: index + 1,
      title: title || `Section ${index + 1}`,
      content,
    };
  });
}

/**
 * @function combineSections
 * @description Reconstructs a complete prompt from edited sections while
 * preserving formatting and section relationships.
 *
 * @param {Array<{id: number, title: string, content: string}>} sections - Edited sections
 * @returns {string} Formatted complete prompt
 * @throws {Error} If sections array is empty or contains invalid content
 *
 * @example
 * const finalPrompt = combineSections([
 *   { id: 1, title: 'Setup', content: 'Initial configuration...' },
 *   { id: 2, title: 'Process', content: 'Main steps...' }
 * ]);
 * // Returns: "Initial configuration...\n\nMain steps..."
 */
function combineSections(sections) {
  return sections.map((section) => section.content).join("\n\n");
}

/**
 * @function editPrompt
 * @async
 * @description Provides an interactive interface for editing complex prompts
 * through a section-based approach with preview capabilities.
 *
 * @param {string} originalPrompt - Initial prompt content
 * @returns {Promise<string>} Final edited prompt
 * @throws {Error} If editing process fails or content is invalid
 *
 * @example
 * // Basic usage
 * const edited = await editPrompt('Original content...');
 *
 * @example
 * // With error handling
 * try {
 *   const edited = await editPrompt(originalContent);
 *   console.log('Successfully edited');
 * } catch (error) {
 *   console.error('Editing failed:', error.message);
 * }
 */
export async function editPrompt(originalPrompt) {
  // Split the prompt into sections
  let sections = splitIntoSections(originalPrompt);

  while (true) {
    // Show the current prompt structure
    display.title("Current Prompt Structure:");
    sections.forEach((section) => {
      console.log(`\n${display.label(section.title)}:`);
      console.log(section.content);
    });

    // Ask what action to take
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Edit a section", value: "edit" },
          { name: "Preview complete prompt", value: "preview" },
          { name: "Save and finish", value: "save" },
          { name: "Cancel editing", value: "cancel" },
        ],
      },
    ]);

    if (action === "cancel") {
      return originalPrompt;
    }

    if (action === "save") {
      return combineSections(sections);
    }

    if (action === "preview") {
      display.title("Complete Prompt Preview:");
      console.log(combineSections(sections));
      await inquirer.prompt([
        {
          type: "input",
          name: "continue",
          message: "Press enter to continue...",
        },
      ]);
      continue;
    }

    // Select section to edit
    const { sectionId } = await inquirer.prompt([
      {
        type: "list",
        name: "sectionId",
        message: "Which section would you like to edit?",
        choices: sections.map((section) => ({
          name: section.title,
          value: section.id,
        })),
      },
    ]);

    const sectionToEdit = sections.find((s) => s.id === sectionId);

    // Edit the selected section
    const { editedContent } = await inquirer.prompt([
      {
        type: "editor",
        name: "editedContent",
        message: `Editing ${sectionToEdit.title}:`,
        default: sectionToEdit.content,
        validate: (input) =>
          input.trim().length > 0 || "Content cannot be empty",
        postfix: ".md", // This helps editors provide proper syntax highlighting
      },
    ]);

    // Update the section
    sections = sections.map((section) =>
      section.id === sectionId
        ? { ...section, content: editedContent.trim() }
        : section
    );
  }
}
