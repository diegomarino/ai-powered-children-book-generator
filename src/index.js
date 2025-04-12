/**
 * @file Main book generation orchestration
 * @module index
 * @requires ./lessons
 * @requires ./storyVariables
 * @requires ./generatorChapter
 * @requires ./generatorImage
 * @exports BookGenerator
 *
 * @description This is the main module that orchestrates the generation of a complete
 * children's book about economics, using personalized story variables.
 *
 * @functions
 * - main: Example entry point for generating a book
 *
 * @constants
 *
 * @flow
 * 1. Initialize book generator with story variables
 * 2. Generate introduction chapter and image
 * 3. Generate topic chapters and images
 * 4. Generate conclusion chapter and image
 * 5. Return complete book content
 *
 * @error Handling
 * - API errors: Caught and logged in main function
 */

const { ECONOMICS_LESSONS } = require("./lessons");
const { STORY_VARIABLES } = require("./storyVariables");
const { generateChapter } = require("./generatorChapter");
const { generateImage } = require("./generatorImage");

/**
 * @class BookGenerator
 * @description Manages the generation of a complete children's book about economics
 * with personalized characters and settings
 *
 * @property {Array} generatedContent - Collection of generated chapters and images
 * @property {string} context - Accumulated narrative context for continuity
 * @property {Object} storyVariables - Character and setting details
 *
 * @example
 * const generator = new BookGenerator(STORY_VARIABLES);
 * await generator.generateBook();
 * const content = generator.getGeneratedContent();
 */
class BookGenerator {
  /**
   * @constructor
   * @description Creates a new book generator instance
   *
   * @param {Object} storyVariables - Personalized story settings
   */
  constructor(storyVariables) {
    this.generatedContent = [];
    this.context = "";
    this.storyVariables = storyVariables;
  }

  /**
   * @async
   * @function generateIntroduction
   * @description Generates the introduction chapter and image for the book
   *
   * @returns {Promise<void>}
   * @throws {Error} If chapter or image generation fails
   */
  async generateIntroduction() {
    const introPrompt =
      `Escribe una introducción amigable para ${this.storyVariables.characters.protagonistName}, ` +
      `que está aprendiendo sobre economía junto con sus amigos ${this.storyVariables.characters.friendsNames.join(
        ", "
      )}. ` +
      "Debe ser motivadora y explicar por qué es importante aprender sobre economía de una manera que conecte con su vida diaria.";

    const introduction = await generateChapter(
      "Introducción",
      [],
      this.storyVariables,
      ""
    );

    const introImage = await generateImage(
      `${
        this.storyVariables.characters.protagonistName
      } y sus amigos ${this.storyVariables.characters.friendsNames.join(
        ", "
      )} ` +
        "emocionados aprendiendo sobre economía, estilo ilustración infantil"
    );

    this.context = introduction;
    this.generatedContent.push({
      type: "introduction",
      text: introduction,
      image: introImage,
    });
  }

  /**
   * @async
   * @function generateChapterFromTopic
   * @description Generates a chapter and image for a specific topic
   *
   * @param {string} topic - Main topic of the chapter
   * @param {string[]} subtopics - List of subtopics to cover
   *
   * @returns {Promise<void>}
   * @throws {Error} If chapter or image generation fails
   */
  async generateChapterFromTopic(topic, subtopics) {
    const chapterContent = await generateChapter(
      topic,
      subtopics,
      this.storyVariables,
      this.context
    );

    const chapterImage = await generateImage(
      `${this.storyVariables.characters.protagonistName} y sus amigos aprendiendo sobre ${topic}, ` +
        "estilo ilustración infantil educativa"
    );

    this.context += "\n\n" + chapterContent;
    this.generatedContent.push({
      type: "chapter",
      topic,
      text: chapterContent,
      image: chapterImage,
    });
  }

  /**
   * @async
   * @function generateConclusion
   * @description Generates the conclusion chapter and image for the book
   *
   * @returns {Promise<void>}
   * @throws {Error} If chapter or image generation fails
   */
  async generateConclusion() {
    const conclusionPrompt =
      `${this.storyVariables.characters.protagonistName} reflexiona sobre todo lo aprendido ` +
      "y comparte sus nuevos conocimientos con su familia y amigos.";

    const conclusion = await generateChapter(
      "Conclusión",
      [],
      this.storyVariables,
      this.context
    );

    const conclusionImage = await generateImage(
      `${this.storyVariables.characters.protagonistName} compartiendo lo aprendido sobre economía con su familia y amigos`
    );

    this.generatedContent.push({
      type: "conclusion",
      text: conclusion,
      image: conclusionImage,
    });
  }

  /**
   * @async
   * @function generateBook
   * @description Orchestrates the generation of a complete book
   *
   * @returns {Promise<Array>} Collection of generated chapters and images
   * @throws {Error} If any part of generation fails
   */
  async generateBook() {
    console.log("Iniciando generación del libro personalizado...");

    await this.generateIntroduction();

    for (const [topic, subtopics] of Object.entries(ECONOMICS_LESSONS)) {
      console.log(`Generando capítulo: ${topic}`);
      await this.generateChapterFromTopic(topic, subtopics);
    }

    await this.generateConclusion();

    return this.generatedContent;
  }

  /**
   * @function getGeneratedContent
   * @description Returns the complete generated book content
   *
   * @returns {Array} Collection of generated chapters and images
   */
  getGeneratedContent() {
    return this.generatedContent;
  }
}

/**
 * @function main
 * @async
 * @description Example function demonstrating book generation process
 *
 * @returns {Promise<void>}
 * @throws {Error} Catches and logs any errors during generation
 *
 * @example
 * main();
 */
async function main() {
  try {
    const bookGenerator = new BookGenerator(STORY_VARIABLES);
    await bookGenerator.generateBook();
    console.log("Libro generado exitosamente!");
    console.log("Contenido generado:", bookGenerator.getGeneratedContent());
  } catch (error) {
    console.error("Error generando el libro:", error);
  }
}

main();
