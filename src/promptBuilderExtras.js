/**
 * @file Additional prompt builders for special content
 * @module promptBuilderExtras
 * @exports buildIntroductionPrompt, buildConceptsPrompt, buildTriviaPrompt
 * @requires ../config/chapters
 *
 * @description This module provides additional prompt builders for generating
 * book introductions, concept definitions, and trivia facts.
 *
 * @functions
 * - buildIntroductionPrompt: Creates prompt for book introduction
 * - buildConceptsPrompt: Creates prompt for concept definitions
 * - buildTriviaPrompt: Creates prompt for related trivia facts
 *
 * @constants
 * None
 *
 * @flow
 * 1. Extract necessary details from story variables
 * 2. Build appropriate context based on prompt type
 * 3. Add specific instructions for content type
 * 4. Return formatted prompt
 *
 * @error Handling
 * - Missing story variables: Uses conditional rendering to handle missing data
 */

import { BOOK_CONTENT } from "../config/chapters.js";

/**
 * @function buildIntroductionPrompt
 * @description Creates a prompt for generating the book's introduction
 *
 * @param {Object} storyVariables - Object containing all story settings
 * @param {Object} storyVariables.characters - Character details
 * @param {Object} storyVariables.places - Location details
 * @param {Object} storyVariables.familyAndEmotions - Family details
 * @returns {string} Complete prompt for introduction generation
 *
 * @example
 * const prompt = buildIntroductionPrompt(storyVariables);
 */
function buildIntroductionPrompt(storyVariables = {}) {
  // Extract only essential character details for initial generation
  const { protagonistName, protagonistAge } = storyVariables?.characters || {};

  return `
    Please write an engaging introduction for a children's book about economics.

    Essential Context:
    - Protagonist: ${protagonistName || "our young protagonist"}, age ${
      protagonistAge || "young"
    }

    This book will cover the following areas:
    ${BOOK_CONTENT.map(
      (category) => `- ${category.title}: ${category.description}`
    ).join("\n")}

    Specific Instructions:
    - Create an inviting and warm welcome to the book
    - Introduce the protagonist and their curiosity about economics
    - Briefly mention what readers will learn
    - Keep the tone friendly and exciting
    - Make economics sound fun and relevant to daily life
    - Use language appropriate for ${protagonistAge || "young"} children
    - End with an encouraging message about learning economics
    - Keep it concise (around 2-3 paragraphs)
    - Focus on the story and educational content - character details will be personalized later
  `.trim();
}

/**
 * @function personalizeIntroductionContent
 * @description Adapts the generated introduction to include story-specific details naturally
 *
 * @param {string} content - The generated introduction content
 * @param {Object} storyVariables - Complete story variables for personalization
 * @returns {string} Personalized introduction content
 */
function personalizeIntroductionContent(content, storyVariables = {}) {
  return `
    Please review and adapt the following introduction to naturally incorporate relevant details from the provided context.
    Make small modifications where necessary (e.g., adding location, family details), but maintain the core
    message and welcoming tone. Only use details where they fit naturally.

    Original Text:
    ${content}

    Available Context (use only where appropriate):
    ${JSON.stringify(storyVariables, null, 2)}

    Instructions:
    - Keep the core welcome message and educational overview intact
    - Weave in context details naturally where they enhance the introduction
    - Make minimal changes necessary to incorporate relevant details
    - Maintain the original tone and flow
    - Ensure any added details feel organic to the narrative
  `.trim();
}

/**
 * @function buildConceptsPrompt
 * @description Creates a prompt for generating concept definitions
 *
 * @param {string} topic - Main topic of the chapter
 * @param {string[]} subtopics - List of subtopics to define
 * @param {number} targetAge - Age of the target audience
 *
 * @returns {string} Complete prompt for concepts generation
 *
 * @example
 * const prompt = buildConceptsPrompt(
 *   "Saving",
 *   ["Piggy Banks", "Interest"],
 *   8
 * );
 */
function buildConceptsPrompt(topic, subtopics, targetAge) {
  return `
    Please provide clear definitions for the following economic concepts
    related to ${topic}, suitable for ${targetAge}-year-old children:

    Concepts to define:
    ${subtopics.map((subtopic) => `- ${subtopic}`).join("\n")}

    For each concept:
    - Start with a simple, clear definition
    - Follow with a real-life example
    - Use analogies that children can understand
    - Avoid technical jargon
    - Keep each definition concise (2-3 sentences)
  `.trim();
}

/**
 * @function buildTriviaPrompt
 * @description Creates a prompt for generating related trivia facts
 *
 * @param {string} topic - Main topic of the chapter
 * @param {string[]} subtopics - List of related subtopics
 * @param {number} targetAge - Age of the target audience
 * @param {number} [numberOfFacts=3] - Number of trivia facts to generate
 *
 * @returns {string} Complete prompt for trivia generation
 *
 * @example
 * const prompt = buildTriviaPrompt(
 *   "Saving",
 *   ["Piggy Banks", "Interest"],
 *   8,
 *   3
 * );
 */
function buildTriviaPrompt(topic, subtopics, targetAge, numberOfFacts = 3) {
  return `
    Please provide ${numberOfFacts} interesting trivia facts related to ${topic}
    that would fascinate ${targetAge}-year-old children.

    The facts should relate to these concepts:
    ${subtopics.map((subtopic) => `- ${subtopic}`).join("\n")}

    For each fact:
    - Make it engaging and surprising
    - Keep it simple enough for children to understand
    - Include a brief explanation if needed
    - Make it relevant to daily life when possible
    - Avoid complex numbers or statistics
    - Keep each fact concise (1-2 sentences)
  `.trim();
}

export {
  buildIntroductionPrompt,
  personalizeIntroductionContent,
  buildConceptsPrompt,
  buildTriviaPrompt,
};
