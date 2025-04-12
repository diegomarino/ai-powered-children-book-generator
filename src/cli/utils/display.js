import chalk from "chalk";

/**
 * @type {Record<string,string>}
 * Unicode symbols (or text fallbacks) for display messages.
 */
const SYMBOLS = {
  error: "✗",
  warning: "○", // Using circle symbol for warning
  success: "✓",
  info: "ℹ", // Using standard info symbol
  bullet: "•",
  progress: "...", // Using ellipsis for progress
};

/**
 * Display utility functions for CLI output.
 * Provides consistent formatting for headers, statuses, and specific data types.
 * @namespace display
 */
const display = {
  /**
   * Displays a major section header (e.g., Welcome message).
   * @param {string} text - Header text.
   * @memberof display
   */
  header(text) {
    console.log(`\n${chalk.blue.bold(text)}\n`);
  },

  /**
   * Displays a subsection title (e.g., 'Generated Prompt:', 'Book Status:').
   * @param {string} text - Title text.
   * @memberof display
   */
  title(text) {
    console.log(chalk.cyan.bold(text));
  },

  /**
   * Formats text as an inline label (e.g., 'Title:', 'Created:').
   * Useful for pairing with values: console.log(display.label("Title:"), bookState.title);
   * @param {string} text - Label text.
   * @returns {string} Formatted label string.
   * @memberof display
   */
  label(text) {
    return chalk.cyan(text);
  },

  /**
   * Displays a success message.
   * @param {string} message - Success message.
   * @memberof display
   */
  success(message) {
    console.log(`${chalk.green(SYMBOLS.success)} ${message}`);
  },

  /**
   * Displays an error message, optionally including error details.
   * @param {string} message - Error message.
   * @param {Error|string|null} [errorDetails=null] - Optional error object or details string.
   * @memberof display
   */
  error(message, errorDetails = null) {
    console.error(`${chalk.red(SYMBOLS.error)} ${message}`);
    if (errorDetails) {
      const details =
        errorDetails instanceof Error ? errorDetails.stack : errorDetails;
      console.error(chalk.red.dim(details)); // Dim details for less prominence
    }
  },

  /**
   * Displays a warning message.
   * @param {string} message - Warning message.
   * @memberof display
   */
  warning(message) {
    console.log(`${chalk.yellow(SYMBOLS.warning)} ${message}`);
  },

  /**
   * Displays an informational message.
   * @param {string} message - Info message.
   * @memberof display
   */
  info(message) {
    console.log(`${chalk.blue(SYMBOLS.info)} ${message}`);
  },

  /**
   * Displays a progress message for ongoing operations.
   * @param {string} message - Progress message (e.g., 'Generating...').
   * @memberof display
   */
  progress(message) {
    console.log(`${chalk.blue(SYMBOLS.progress)} ${message}`);
  },

  /**
   * Formats a file path string.
   * @param {string} filePath - Path to format.
   * @returns {string} Formatted path string.
   * @memberof display
   */
  path(filePath) {
    return chalk.bold.cyan(filePath);
  },

  /**
   * Formats a chapter status string with appropriate color.
   * @param {'not_generated'|'generated'|'wip'|'accepted'} status - The chapter status.
   * @returns {string} Formatted status string.
   * @memberof display
   */
  statusTag(status) {
    const statusMap = {
      not_generated: chalk.gray,
      generated: chalk.yellow,
      wip: chalk.blue,
      accepted: chalk.green,
    };
    const formatter = statusMap[status] || chalk.white; // Default style
    return formatter(status);
  },

  /**
   * Prints a blank line for spacing.
   * @memberof display
   */
  blank() {
    console.log("");
  },

  /**
   * Displays a single list item with a bullet point.
   * @param {string} item - The list item text.
   * @memberof display
   */
  listItem(item) {
    console.log(`  ${chalk.gray(SYMBOLS.bullet)} ${item}`);
  },

  /**
   * Formats text with a dimmed parenthetical explanation.
   * @param {string} mainText - The main text to display normally.
   * @param {string} explanation - The explanation text to display in parentheses with dimmed color.
   * @returns {string} Combined formatted string.
   * @memberof display
   * @example
   * display.withExplanation("temperature: 0.7", "0.0-2.0, higher = more creative")
   * // Returns: "temperature: 0.7 (0.0-2.0, higher = more creative)" with gray parentheses
   */
  withExplanation(mainText, explanation) {
    return `${mainText} ${chalk.gray(`(${explanation})`)}`;
  },

  /**
   * Formats a chapter name with its status.
   * @param {string} topic - The chapter topic/name.
   * @param {'not_generated'|'generated'|'wip'|'accepted'} status - The chapter status.
   * @returns {string} Formatted chapter string.
   * @memberof display
   */
  formatChapter(topic, status) {
    if (status === "accepted") {
      return `${chalk.green(SYMBOLS.success)} ${topic}`;
    } else if (status === "not_generated") {
      return chalk.gray(`${topic} (${status})`);
    } else {
      return `${topic} (${status})`;
    }
  },
};

// Using default export for easier import
export default display;
// Export SYMBOLS separately if needed elsewhere
export { SYMBOLS };
