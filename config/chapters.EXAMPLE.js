/**
 * @file Example book content structure
 * @module chapters.EXAMPLE
 * @exports BOOK_CONTENT
 *
 * @description This example file shows how to structure educational content
 * for a children's book. You can use this as a template to create your own
 * educational content on any subject.
 *
 * @functions
 *
 * @constants
 * - BOOK_CONTENT: Array of chapter categories with topics
 *
 * @flow
 * 1. Define categories of concepts to teach
 * 2. Define topics within each category
 * 3. Export the content structure
 *
 * @error Handling
 * - None, this is a static data module
 */

/**
 * @constant {Array<Object>}
 * @type {Array}
 * @description Example structure for organizing educational content
 *
 * Each element is a category with:
 * - id: internal unique identifier (use lowercase with no spaces)
 * - title: display name for the category
 * - order: display order in the book (1-based)
 * - topics: array of concepts taught in this category
 *     - key: internal unique identifier for the topic (use camelCase)
 *     - title: display name for the topic
 *     - example: child-friendly illustrative scenario
 *     - summary: short explanation of the concept
 */

export const BOOK_CONTENT = [
  {
    id: "firstCategory",
    title: "Beginning Concepts",
    order: 1,
    topics: [
      {
        key: "firstConcept",
        title: "Introduction to the First Concept",
        example:
          "The main character encounters a situation where they need to understand this concept. Through a simple story, they learn its basic principles and how to apply them.",
        summary: "A simple, clear explanation of the concept's fundamentals.",
      },
      {
        key: "secondConcept",
        title: "Understanding the Second Concept",
        example:
          "The character faces a challenge that requires applying this concept. They experiment with different approaches and discover how it works.",
        summary: "How this concept works in everyday situations.",
      },
      {
        key: "thirdConcept",
        title: "Exploring the Third Concept",
        example:
          "When trying something new, the character discovers this concept in action. They learn why it's important and how it connects to other ideas.",
        summary: "The importance of this concept and its connections.",
      },
    ],
  },
  {
    id: "secondCategory",
    title: "Intermediate Ideas",
    order: 2,
    topics: [
      {
        key: "advancedFirstConcept",
        title: "Taking the First Concept Further",
        example:
          "Building on what they've learned, the character applies the concept in a more complex situation, discovering new aspects.",
        summary: "Extending basic understanding to more complex applications.",
      },
      {
        key: "practicalApplications",
        title: "Practical Applications",
        example:
          "The character finds ways to use these concepts in daily life, seeing how they can solve real problems.",
        summary: "How to apply theoretical knowledge in practical ways.",
      },
      {
        key: "problemSolving",
        title: "Problem-solving with These Concepts",
        example:
          "When faced with a difficult situation, the character combines concepts to find creative solutions.",
        summary: "Using knowledge creatively to overcome challenges.",
      },
    ],
  },
  {
    id: "thirdCategory",
    title: "Advanced Topics",
    order: 3,
    topics: [
      {
        key: "complexConcept",
        title: "Understanding Complex Relationships",
        example:
          "The character discovers how different concepts interact, creating a system where everything affects everything else.",
        summary: "How concepts form interconnected systems.",
      },
      {
        key: "creativeThinking",
        title: "Creative Applications",
        example:
          "By thinking outside the box, the character invents new ways to use what they've learned, surprising everyone.",
        summary: "Using knowledge in innovative and unexpected ways.",
      },
      {
        key: "futurePossibilities",
        title: "Exploring Future Possibilities",
        example:
          "The character imagines how these concepts might evolve and create new opportunities in the future.",
        summary: "Looking ahead to how these ideas might develop.",
      },
    ],
  },
  {
    id: "realWorldConnections",
    title: "Connecting to the Real World",
    order: 4,
    topics: [
      {
        key: "everydayExamples",
        title: "Finding Examples Everywhere",
        example:
          "The character starts noticing these concepts in unexpected places, realizing how widespread they are.",
        summary: "Recognizing concepts in diverse real-world contexts.",
      },
      {
        key: "sharingKnowledge",
        title: "Teaching Others",
        example:
          "The character becomes confident enough to explain these ideas to friends and family, reinforcing their own understanding.",
        summary: "Strengthening knowledge through sharing and teaching.",
      },
      {
        key: "makingADifference",
        title: "Using Knowledge for Good",
        example:
          "By applying what they've learned, the character finds ways to help their community and make positive changes.",
        summary: "How knowledge can be used to benefit others.",
      },
    ],
  },
];
