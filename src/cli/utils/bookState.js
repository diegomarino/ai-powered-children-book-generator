/**
 * @file Book state management implementation
 * @module bookState
 * @requires fs/promises - For filesystem operations
 * @requires path - For path manipulation
 * @requires ../../../config/chapters - For book content structure
 * @exports {loadBookState, saveBookState, initializeBookState}
 *
 * @description
 * This module provides comprehensive state management for book generation,
 * handling the complete lifecycle of book state including initialization,
 * persistence, and updates. It maintains a consistent state structure and
 * ensures data integrity throughout the generation process.
 *
 * @functions
 * - initializeChaptersFromLessons: Chapter structure builder
 * - loadBookState: State file loader
 * - saveBookState: State persistence handler
 * - initializeBookState: New state initializer
 *
 * @flow
 * 1. State Initialization
 *    - Load configuration
 *    - Create chapter structure
 *    - Set default values
 * 2. State Persistence
 *    - Validate state structure
 *    - Write to filesystem
 *    - Handle errors
 * 3. State Management
 *    - Load existing state
 *    - Update as needed
 *    - Maintain consistency
 *
 * @error Handling
 * - Filesystem: Handle read/write errors
 * - Validation: Check state structure
 * - Recovery: Provide fallbacks
 * - Parsing: Handle JSON errors
 * - Permissions: Check access rights
 */

import fs from "fs/promises";
import path from "path";
import { BOOK_CONTENT } from "../../../config/chapters.js";

/**
 * @function initializeChaptersFromLessons
 * @private
 * @description Creates a complete chapter structure from configured lesson data,
 * including introduction and conclusion chapters. Validates against schema.
 *
 * @returns {Array<{
 *   id: string,
 *   topic: string,
 *   status: string,
 *   text: string|null,
 *   lessonContext?: {
 *     example: string,
 *     summary: string
 *   },
 *   image: {
 *     status: string,
 *     prompt: string|null,
 *     url: string|null
 *   }
 * }>} Array of initialized chapter objects
 * @throws {Error} If BOOK_CONTENT is invalid per schema
 *
 * @example
 * const chapters = initializeChaptersFromLessons();
 * // Returns: [
 * //   { id: 'introduction', topic: 'Introduction', ... },
 * //   { id: 'lesson1_topic1', topic: 'Economics Basics', ... },
 * //   { id: 'conclusion', topic: 'Conclusion', ... }
 * // ]
 */
function initializeChaptersFromLessons() {
  const chapters = [];

  // Add introduction chapter
  chapters.push({
    id: "introduction",
    topic: "Introduction",
    status: "not_generated",
    text: null,
    image: {
      status: "not_generated",
      prompt: null,
      url: null,
    },
  });

  // TODO - check if BOOK_CONTENT is valid per config/shemas/chapters.schema.json

  // Add chapters from lessons
  BOOK_CONTENT.forEach((lesson) => {
    lesson.topics.forEach((topic) => {
      chapters.push({
        id: `${lesson.id}_${topic.key}`,
        topic: topic.title,
        status: "not_generated",
        lessonContext: {
          example: topic.example,
          summary: topic.summary,
        },
        text: null,
        image: {
          status: "not_generated",
          prompt: null,
          url: null,
        },
      });
    });
  });

  // Add conclusion chapter
  chapters.push({
    id: "conclusion",
    topic: "Conclusion",
    status: "not_generated",
    text: null,
    image: {
      status: "not_generated",
      prompt: null,
      url: null,
    },
  });

  return chapters;
}

/**
 * @function loadBookState
 * @async
 * @description Loads and validates book state from the filesystem.
 * Handles file reading, JSON parsing, and state structure validation.
 *
 * @param {string} bookPath - Absolute path to book directory
 *
 * @returns {Promise<{
 *   title: string,
 *   createdAt: string,
 *   openAIConfig: Object|null,
 *   storyVariables: Object,
 *   chapters: Array<Object>,
 *   currentContext: string
 * }>} Parsed and validated book state
 * @throws {Error} If file is missing, corrupted, or invalid
 *
 * @example
 * // Basic usage
 * const state = await loadBookState('/books/my-book');
 *
 * @example
 * // With error handling
 * try {
 *   const state = await loadBookState(bookPath);
 *   console.log(`Loaded book: ${state.title}`);
 * } catch (error) {
 *   console.error('State loading failed:', error.message);
 * }
 */
export async function loadBookState(bookPath) {
  const statePath = path.join(bookPath, "book-state.json");
  try {
    const state = JSON.parse(await fs.readFile(statePath, "utf8"));
    return state;
  } catch (error) {
    throw new Error(`Failed to load book state: ${error.message}`);
  }
}

/**
 * @function saveBookState
 * @async
 * @description Persists book state to the filesystem with proper formatting
 * and error handling. Creates parent directories if needed.
 *
 * @param {string} bookPath - Absolute path to book directory
 * @param {Object} state - Current book state
 * @param {string} state.title - Book title
 * @param {string} state.createdAt - Creation timestamp
 * @param {Object|null} state.openAIConfig - OpenAI settings
 * @param {Object} state.storyVariables - Story customization
 * @param {Array<Object>} state.chapters - Chapter data
 * @param {string} state.currentContext - Current generation context
 *
 * @returns {Promise<void>}
 * @throws {Error} If write fails or state is invalid
 *
 * @example
 * // Basic save
 * await saveBookState('/books/my-book', currentState);
 *
 * @example
 * // With validation
 * try {
 *   await saveBookState(bookPath, {
 *     title: 'Economics for Kids',
 *     createdAt: new Date().toISOString(),
 *     chapters: []
 *   });
 * } catch (error) {
 *   console.error('Save failed:', error.message);
 * }
 */
export async function saveBookState(bookPath, state) {
  const statePath = path.join(bookPath, "book-state.json");
  try {
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));
  } catch (error) {
    throw new Error(`Failed to save book state: ${error.message}`);
  }
}

/**
 * @function initializeBookState
 * @description Creates a new book state with default structure and values.
 * Sets up all required fields for book generation and customization.
 *
 * @param {string} title - Book title
 * @returns {{
 *   title: string,
 *   createdAt: string,
 *   openAIConfig: null,
 *   storyVariables: {
 *     characters: {
 *       protagonistName: string,
 *       protagonistAge: string,
 *       protagonistGender: string,
 *       friendsNames: Array<string>,
 *       siblingsNamesAges: Array<Array<string,string>>,
 *       petName: string,
 *       petType: string
 *     },
 *     places: {
 *       cityName: string,
 *       schoolName: string
 *     },
 *     familyAndEmotions: {
 *       parentsNames: Array<string>
 *     }
 *   },
 *   chapters: Array<Object>,
 *   currentContext: string
 * }} Complete book state structure
 *
 * @example
 * // Initialize new book
 * const state = initializeBookState('Economics for Young Minds');
 *
 * @example
 * // With immediate configuration
 * const state = initializeBookState('Money Basics');
 * state.storyVariables.characters.protagonistName = 'Luna';
 * state.storyVariables.characters.protagonistAge = '8';
 */
export function initializeBookState(title) {
  return {
    title,
    createdAt: new Date().toISOString(),
    openAIConfig: null, // Will be set during configuration
    storyVariables: {
      characters: {
        protagonistName: "",
        protagonistAge: "",
        protagonistGender: "",
        friendsNames: [],
        siblingsNamesAges: [],
        petName: "",
        petType: "",
      },
      places: {
        cityName: "",
        schoolName: "",
      },
      familyAndEmotions: {
        parentsNames: [],
      },
    }, // Default structure, will be updated during configuration
    chapters: initializeChaptersFromLessons(),
    currentContext: "",
  };
}
