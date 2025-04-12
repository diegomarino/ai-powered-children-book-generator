/**
 * @file Book management command implementation
 * @module manageBook
 * @requires inquirer - For interactive CLI prompts
 * @requires path - For path manipulation
 * @requires ../utils/display - For consistent CLI output formatting
 * @requires ../utils/bookState - For book state management
 * @requires ./generateChapter - For chapter content generation
 * @requires ../utils/configuration/openai - For OpenAI configuration
 * @requires ../utils/configuration/storyVariables - For story variables management
 * @exports manageBook
 *
 * @description
 * This module provides comprehensive book management functionality through a CLI interface.
 * It enables users to manage chapters, track progress, and configure generation settings.
 *
 * @functions
 * - getNextChapter: Finds next unaccepted chapter
 * - displayBookStatus: Shows detailed book completion status
 * - selectChapter: Provides chapter selection interface
 * - handleChapter: Manages individual chapter operations
 * - manageBook: Main command entry point
 *
 * @constants
 * - BOOK_MENU_CHOICES: Array<Object> - Menu options configuration
 *
 * @flow
 * 1. Load book state from filesystem
 * 2. Present management menu options
 * 3. Process user selection
 * 4. Execute selected operation
 * 5. Save state changes if needed
 * 6. Return to menu or exit
 *
 * @error Handling
 * - FileSystem errors: Caught in loadBookState/saveBookState
 * - Generation errors: Handled in generateChapterContent
 * - Invalid state: Validated before operations
 * - User input: Validated through inquirer
 */

import inquirer from "inquirer";
import path from "path";
import display from "../utils/display.js";
import { loadBookState, saveBookState } from "../utils/bookState.js";
import { generateChapterContent } from "./generateChapter.js";
import { configureOpenAI } from "../utils/configuration/openai.js";
import { configureStoryVariables } from "../utils/configuration/storyVariables.js";

/**
 * @constant
 * @type {Array<{name: string, value: string}>}
 * @description Defines the available options in the book management menu.
 * Each option has a display name and an internal value for processing.
 * @readonly
 */
const BOOK_MENU_CHOICES = [
  {
    name: "Review/Generate Next Chapter",
    value: "next_chapter",
  },
  {
    name: "Select Specific Chapter to Review",
    value: "select_chapter",
  },
  {
    name: "View Book Status",
    value: "status",
  },
  {
    name: "Modify Story Variables",
    value: "modify_variables",
  },
  {
    name: "Update OpenAI Configuration",
    value: "update_config",
  },
  {
    name: "Return to Main Menu",
    value: "exit",
  },
];

/**
 * @function getNextChapter
 * @description Finds the next chapter that needs attention (not yet accepted)
 *
 * @param {Array<Object>} chapters - Array of chapter objects
 * @param {string} chapters[].status - Current status of the chapter
 * @param {string} chapters[].topic - Chapter topic/title
 * @param {string} chapters[].id - Unique chapter identifier
 *
 * @returns {Object|undefined} The next chapter to work on, or undefined if all are accepted
 * @throws {TypeError} If chapters array contains invalid objects
 *
 * @example
 * const chapters = [
 *   { id: '1', topic: 'Introduction', status: 'accepted' },
 *   { id: '2', topic: 'Chapter 1', status: 'not_generated' }
 * ];
 * const nextChapter = getNextChapter(chapters);
 * // Returns: { id: '2', topic: 'Chapter 1', status: 'not_generated' }
 */
function getNextChapter(chapters) {
  return chapters.find((chapter) => chapter.status !== "accepted");
}

/**
 * @function displayBookStatus
 * @async
 * @description Displays detailed information about the book's current state including
 * title, creation date, chapter status, and overall completion progress.
 *
 * @param {Object} bookState - The current state of the book
 * @param {string} bookState.title - Book title
 * @param {Date} bookState.createdAt - Book creation timestamp
 * @param {Array<Object>} bookState.chapters - Array of chapter objects
 * @param {string} bookState.chapters[].topic - Chapter topic/title
 * @param {string} bookState.chapters[].status - Chapter status
 * @param {Object} [bookState.chapters[].image] - Chapter image info (optional)
 * @param {string} [bookState.chapters[].image.status] - Image status
 *
 * @returns {Promise<void>}
 * @throws {Error} If display operations fail
 *
 * @example
 * const bookState = {
 *   title: 'My Book',
 *   createdAt: new Date(),
 *   chapters: [{
 *     topic: 'Introduction',
 *     status: 'accepted',
 *     image: { status: 'generated' }
 *   }]
 * };
 * await displayBookStatus(bookState);
 */
async function displayBookStatus(bookState) {
  display.header("Book Status");
  display.info(`${display.label("Title:")} ${bookState.title}`);
  display.info(
    `${display.label("Created:")} ${new Date(bookState.createdAt).toLocaleString()}`
  );
  display.title("\nChapters:");

  bookState.chapters.forEach((chapter) => {
    display.info(display.formatChapter(chapter.topic, chapter.status));
    if (chapter.image) {
      display.info(`  Image: ${display.statusTag(chapter.image.status)}`);
    }
  });

  // Calculate progress
  const totalChapters = bookState.chapters.length;
  const acceptedChapters = bookState.chapters.filter(
    (ch) => ch.status === "accepted"
  ).length;
  const progress = ((acceptedChapters / totalChapters) * 100).toFixed(1);

  display.title(
    `\nProgress: ${progress}% (${acceptedChapters}/${totalChapters} chapters completed)`
  );

  // Wait for user acknowledgment
  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: "Press Enter to continue...",
    },
  ]);
}

/**
 * @function selectChapter
 * @async
 * @description Presents an interactive menu for selecting a specific chapter,
 * displaying each chapter's topic and current status.
 *
 * @param {Array<Object>} chapters - Array of chapter objects
 * @param {string} chapters[].id - Unique chapter identifier
 * @param {string} chapters[].topic - Chapter topic/title
 * @param {string} chapters[].status - Current status of the chapter
 *
 * @returns {Promise<Object>} The selected chapter object
 * @throws {Error} If user selection fails or chapter not found
 *
 * @example
 * const chapters = [
 *   { id: '1', topic: 'Introduction', status: 'accepted' },
 *   { id: '2', topic: 'Chapter 1', status: 'not_generated' }
 * ];
 * const selectedChapter = await selectChapter(chapters);
 * // User selects from menu, returns selected chapter object
 */
async function selectChapter(chapters) {
  const choices = chapters.map((chapter) => ({
    name: display.formatChapter(chapter.topic, chapter.status),
    value: chapter.id,
  }));

  const { chapterId } = await inquirer.prompt([
    {
      type: "list",
      name: "chapterId",
      message: "Select a chapter to review:",
      choices,
    },
  ]);

  return chapters.find((ch) => ch.id === chapterId);
}

/**
 * @function handleChapter
 * @async
 * @description Manages all operations available for a specific chapter including
 * content generation, review, status updates, and image management.
 *
 * @param {Object} chapter - The chapter to handle
 * @param {string} chapter.id - Unique chapter identifier
 * @param {string} chapter.topic - Chapter topic/title
 * @param {string} chapter.status - Current status
 * @param {string} [chapter.text] - Chapter content if generated
 * @param {Object} [chapter.lessonContext] - Educational context
 * @param {string} [chapter.lessonContext.example] - Context example
 * @param {string} [chapter.lessonContext.summary] - Context summary
 * @param {Object} [chapter.image] - Chapter image if exists
 * @param {string} [chapter.image.url] - Image URL
 *
 * @param {Object} bookState - Current book state
 * @param {string} bookPath - Path to book directory
 *
 * @returns {Promise<void>}
 * @throws {Error} If operations fail or state cannot be saved
 *
 * @example
 * const chapter = {
 *   id: '1',
 *   topic: 'Introduction',
 *   status: 'generated',
 *   text: 'Chapter content...',
 *   lessonContext: {
 *     example: 'Context example',
 *     summary: 'Context summary'
 *   }
 * };
 * await handleChapter(chapter, bookState, '/path/to/book');
 */
async function handleChapter(chapter, bookState, bookPath) {
  display.header(`Chapter: ${chapter.topic}`);

  if (chapter.lessonContext) {
    display.title("Context:");
    display.info(
      `${display.label("Example:")} ${chapter.lessonContext.example}`
    );
    display.info(
      `${display.label("Summary:")} ${chapter.lessonContext.summary}`
    );
  }

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do with this chapter?",
      choices: [
        {
          name: "Generate/Regenerate Content",
          value: "generate",
        },
        {
          name: "Review Current Content",
          value: "review",
          disabled:
            chapter.status === "not_generated" ? "No content yet" : false,
        },
        {
          name: "Mark as Work in Progress",
          value: "mark_wip",
          disabled:
            chapter.status === "not_generated" ? "No content yet" : false,
        },
        {
          name: "Mark as Accepted",
          value: "mark_accepted",
          disabled:
            chapter.status === "not_generated" ? "No content yet" : false,
        },
        {
          name: "Back to Book Menu",
          value: "back",
        },
      ],
    },
  ]);

  switch (action) {
    case "generate":
      await generateChapterContent(chapter, bookState, bookPath);
      break;

    case "review":
      if (chapter.text) {
        display.title("Current Content:");
        display.info(chapter.text);

        if (chapter.image?.url) {
          display.title("Image URL:");
          display.info(chapter.image.url);
        }
      }
      break;

    case "mark_wip":
      chapter.status = "wip";
      await saveBookState(bookPath, bookState);
      display.success("Chapter marked as work in progress.");
      break;

    case "mark_accepted":
      chapter.status = "accepted";
      await saveBookState(bookPath, bookState);
      display.success("Chapter marked as accepted.");
      return; // Return immediately after marking as accepted

    case "back":
      return;
  }

  // Return to chapter menu unless back was selected
  if (action !== "back") {
    await handleChapter(chapter, bookState, bookPath);
  }
}

/**
 * @function manageBook
 * @async
 * @description Main command function that provides a complete interface for managing
 * a book's content, configuration, and generation settings through an interactive menu.
 *
 * @param {string} bookPath - Absolute path to the book directory
 *
 * @returns {Promise<void>}
 * @throws {Error} If book state cannot be loaded/saved or operations fail
 *
 * @example
 * // Basic usage
 * await manageBook('/Users/username/books/my-book');
 *
 * @example
 * // Error handling
 * try {
 *   await manageBook('/path/to/book');
 * } catch (error) {
 *   console.error('Book management failed:', error);
 * }
 */
export async function manageBook(bookPath) {
  try {
    const bookState = await loadBookState(bookPath);

    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "Book Management Menu:",
          choices: BOOK_MENU_CHOICES,
        },
      ]);

      switch (action) {
        case "next_chapter": {
          const nextChapter = getNextChapter(bookState.chapters);
          if (nextChapter) {
            await handleChapter(nextChapter, bookState, bookPath);
          } else {
            display.success("All chapters are completed!");
          }
          break;
        }

        case "select_chapter": {
          const chapter = await selectChapter(bookState.chapters);
          await handleChapter(chapter, bookState, bookPath);
          break;
        }

        case "status":
          await displayBookStatus(bookState);
          break;

        case "modify_variables": {
          display.title("Updating story variables:");
          const updatedVariables = await configureStoryVariables();
          bookState.storyVariables = updatedVariables;
          await saveBookState(bookPath, bookState);
          display.success("Story variables updated successfully!");
          break;
        }

        case "update_config": {
          display.title("Updating OpenAI configuration:");
          const updatedConfig = await configureOpenAI();
          bookState.openAIConfig = updatedConfig;
          await saveBookState(bookPath, bookState);
          display.success("OpenAI configuration updated successfully!");
          break;
        }

        case "exit":
          return;
      }
    }
  } catch (error) {
    display.error("Error managing book:", error);
    throw error;
  }
}
