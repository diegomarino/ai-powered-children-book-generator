#!/usr/bin/env node
/**
 * @file CLI main entry point
 * @module cli/index
 * @requires inquirer
 * @requires chalk
 * @requires fs/promises
 * @requires path
 * @requires url
 * @requires ./commands/configureBook
 * @requires ./utils/bookState
 * @requires ./commands/manageBook
 *
 * @description Main entry point for the CLI application that allows users
 * to create, manage, and delete economics books for children.
 *
 * @functions
 * - ensureBooksDirExists: Ensures the books directory exists
 * - listBooks: Lists all existing books
 * - createBook: Creates a new book
 * - deleteBook: Deletes an existing book
 * - mainMenu: Displays and handles the main menu
 * - main: Entry point function
 *
 * @constants
 * - BOOKS_DIR: Path to the books directory
 * - mainMenuChoices: Options for the main menu
 *
 * @flow
 * 1. Setup environment (ensure directories exist)
 * 2. Display main menu
 * 3. Handle user choice (create/open/delete/exit)
 * 4. Perform selected action
 * 5. Return to main menu
 *
 * @error Handling
 * - File system errors: Caught and shown with relevant context
 * - User input validation: Validation rules for book names
 * - Fatal errors: Caught and logged before exiting
 */
import inquirer from "inquirer";
import fs from "fs/promises";
import display from "./utils/display.js";
import path from "path";
import { fileURLToPath } from "url";
import { configureNewBook } from "./commands/configureBook.js";
import { initializeBookState, saveBookState } from "./utils/bookState.js";
import { manageBook } from "./commands/manageBook.js";

/**
 * @constant {string}
 * @type {string}
 * @description Path to the books directory
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BOOKS_DIR = path.join(__dirname, "..", "..", "books");

/**
 * @function ensureBooksDirExists
 * @async
 * @description Ensures the books directory exists, creating it if needed
 *
 * @returns {Promise<void>}
 *
 * @example
 * await ensureBooksDirExists();
 */
async function ensureBooksDirExists() {
  try {
    await fs.access(BOOKS_DIR);
  } catch {
    await fs.mkdir(BOOKS_DIR, { recursive: true });
  }
}

/**
 * @function listBooks
 * @async
 * @description Lists all existing books in the books directory
 *
 * @returns {Promise<string[]>} Array of book directory names
 *
 * @example
 * const books = await listBooks();
 */
async function listBooks() {
  try {
    const books = await fs.readdir(BOOKS_DIR);
    const filteredBooks = [];

    for (const book of books) {
      // Skip .DS_Store and hidden files
      if (book.toLowerCase() === ".ds_store" || book.startsWith(".")) continue;

      const stats = await fs.stat(path.join(BOOKS_DIR, book));
      if (stats.isDirectory()) {
        filteredBooks.push(book);
      }
    }

    return filteredBooks;
  } catch (error) {
    display.error("Error listing books:", error);
    return [];
  }
}

/**
 * @function createBook
 * @async
 * @description Creates a new book with the specified name
 *
 * @param {string} name - Name of the book to create
 *
 * @returns {Promise<boolean>} Whether the book was created successfully
 *
 * @example
 * const success = await createBook('my-economics-book');
 */
async function createBook(name) {
  const bookDir = path.join(BOOKS_DIR, name);
  const imagesDir = path.join(bookDir, "images");

  try {
    // Create book directory and images subdirectory
    await fs.mkdir(bookDir);
    await fs.mkdir(imagesDir);

    // Initialize book state
    const initialState = initializeBookState(name);
    await saveBookState(bookDir, initialState);

    // Create empty content.md
    await fs.writeFile(path.join(bookDir, "content.md"), "");

    display.success(`Created new book: ${name}`);

    // Configure the new book
    const configured = await configureNewBook(bookDir);
    if (!configured) {
      // If configuration failed, clean up the created directory
      await fs.rm(bookDir, { recursive: true });
      return false;
    }

    return true;
  } catch (error) {
    display.error(`Error creating book ${name}:`, error);
    return false;
  }
}

/**
 * @function deleteBook
 * @async
 * @description Deletes an existing book
 *
 * @param {string} name - Name of the book to delete
 *
 * @returns {Promise<boolean>} Whether the book was deleted successfully
 *
 * @example
 * const success = await deleteBook('my-economics-book');
 */
async function deleteBook(name) {
  const bookDir = path.join(BOOKS_DIR, name);
  try {
    await fs.rm(bookDir, { recursive: true });
    display.success(`Deleted book: ${name}`);
    return true;
  } catch (error) {
    display.error(`Error deleting book ${name}:`, error);
    return false;
  }
}

/**
 * @constant {Array<Object>}
 * @type {Array}
 * @description Options for the main menu
 */
const mainMenuChoices = [
  {
    name: "Create a new book",
    value: "create",
  },
  {
    name: "Open existing book",
    value: "open",
  },
  {
    name: "Delete a book",
    value: "delete",
  },
  {
    name: "Exit",
    value: "exit",
  },
];

/**
 * @function mainMenu
 * @async
 * @description Displays the main menu and handles user selection
 *
 * @returns {Promise<void>}
 *
 * @example
 * await mainMenu();
 */
async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: mainMenuChoices,
    },
  ]);

  switch (action) {
    case "create": {
      const { bookName } = await inquirer.prompt([
        {
          type: "input",
          name: "bookName",
          message: "Enter a name for the new book:",
          validate: (input) => {
            if (!input.trim()) return "Book name cannot be empty";
            return true;
          },
        },
      ]);

      // Transform the book name into a safe filename
      const safeBookName = bookName
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading/trailing spaces
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, ""); // Remove any characters that aren't lowercase letters, numbers, or hyphens
      // TODO: Check if the safeBookName already exists. If it does, add a number to the end of it (e.g., book-1, book-2, etc.)

      if (!safeBookName) {
        display.error("Book name contains no valid characters");
        break;
      }

      display.info(`Creating book with filename: ${safeBookName}`);
      const created = await createBook(safeBookName);
      if (created) {
        // If book was created successfully, manage it directly
        const bookPath = path.join(BOOKS_DIR, safeBookName);
        await manageBook(bookPath);
      }
      break;
    }

    case "open": {
      const books = await listBooks();
      if (books.length === 0) {
        display.warning("No books found. Create one first!");
        break;
      }

      const { selectedBook } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedBook",
          message: "Select a book to open:",
          choices: books,
        },
      ]);

      const bookPath = path.join(BOOKS_DIR, selectedBook);
      await manageBook(bookPath);
      break;
    }

    case "delete": {
      const books = await listBooks();
      if (books.length === 0) {
        display.warning("No books to delete!");
        break;
      }

      const { selectedBook } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedBook",
          message: "Select a book to delete:",
          choices: books,
        },
        {
          type: "confirm",
          name: "confirmDelete",
          message:
            "Are you sure you want to delete this book? This cannot be undone.",
          default: false,
        },
      ]);

      if (selectedBook.confirmDelete) {
        await deleteBook(selectedBook);
      }
      break;
    }

    case "exit":
      display.info("Goodbye!");
      process.exit(0);
  }

  // Return to main menu unless exited
  await mainMenu();
}

/**
 * @function main
 * @async
 * @description Entry point function for the CLI application
 *
 * @returns {Promise<void>}
 *
 * @example
 * main().catch(handleError);
 */
async function main() {
  display.header("📚 Welcome to the Book Generator CLI!");

  await ensureBooksDirExists();
  await mainMenu();
}

main().catch((error) => {
  display.error("Fatal error:", error);
  process.exit(1);
});
