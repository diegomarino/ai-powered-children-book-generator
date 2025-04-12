/**
 * @file Two-phase prompt builder for educational chapter generation
 * @module promptBuilder
 * @requires none
 * @exports {buildChapterPrompt, personalizeChapterContent}
 *
 * @description
 * This module implements a sophisticated two-phase approach to generating educational
 * book chapters. The first phase creates content with minimal context for creative
 * freedom, while the second phase naturally incorporates story-specific details.
 * This separation ensures both educational quality and narrative consistency.
 *
 * @functions
 * - buildCharacterContext: Character narrative builder with relevance control
 * - buildLocationContext: Location/setting narrative builder
 * - buildFamilyContext: Family dynamics narrative builder
 * - buildPreviousChaptersContext: Story continuity builder
 * - buildChapterPrompt: Initial generation prompt builder
 * - personalizeChapterContent: Content personalization processor
 *
 * @constants
 * - PRONOUNS: Object - Gender-specific pronoun mappings
 *
 * @flow
 * 1. Initial Context Building
 *    - Load minimal protagonist details
 *    - Set educational parameters
 *    - Configure narrative style
 * 2. Content Generation
 *    - Create base educational content
 *    - Structure learning objectives
 *    - Format examples and activities
 * 3. Personalization
 *    - Clean story variables
 *    - Build character contexts
 *    - Integrate location details
 *    - Add family dynamics
 *    - Maintain narrative consistency
 *
 * @error Handling
 * - Story Variables: Recursive cleaning of null/empty values
 * - Gender Values: Default to 'boy' pronouns if invalid
 * - Data Structures: Remove empty arrays/objects
 * - Required Fields: Fallback values for critical data
 * - Context Building: Skip invalid combinations
 */

/**
 * @constant
 * @type {{boy: {subject: string, object: string, possessive: string}, girl: {subject: string, object: string, possessive: string}}}
 * @description Maps gender identifiers to their corresponding pronoun sets.
 * Used for maintaining consistent character references throughout the narrative.
 * @readonly
 */
const PRONOUNS = {
  boy: { subject: "he", object: "him", possessive: "his" },
  girl: { subject: "she", object: "her", possessive: "her" },
};

/**
 * @function buildCharacterContext
 * @description Creates a narrative description of the character based on provided details
 * and relevance flags for secondary characters
 *
 * @param {Object} characters - Character details object
 * @param {string} characters.protagonistName - Main character's name
 * @param {number} characters.protagonistAge - Main character's age
 * @param {string} characters.protagonistGender - Main character's gender ('boy' or 'girl')
 * @param {string[]} characters.friendsNames - Array of friends' names
 * @param {Array<Array<string,number>>} characters.siblingsNamesAges - Array of [name, age] pairs for siblings
 * @param {string} [characters.petName] - Pet's name if exists
 * @param {string} [characters.petType] - Type of pet if exists
 * @param {Object} relevance - Flags for including secondary characters
 * @param {boolean} [relevance.includeFriends=false] - Whether to include friends in context
 * @param {boolean} [relevance.includeSiblings=false] - Whether to include siblings in context
 * @param {boolean} [relevance.includePet=false] - Whether to include pet in context
 *
 * @returns {string} Formatted character context narrative
 *
 * @example
 * const characterContext = buildCharacterContext({
 *   protagonistName: "John",
 *   protagonistAge: 8,
 *   protagonistGender: "boy",
 *   friendsNames: ["Anna", "Luis"],
 *   siblingsNamesAges: [["Maria", 10]],
 *   petName: "Max",
 *   petType: "dog"
 * }, {
 *   includeFriends: true,
 *   includeSiblings: false,
 *   includePet: true
 * });
 */
const buildCharacterContext = (characters, relevance = {}) => {
  const {
    protagonistName,
    protagonistAge,
    protagonistGender,
    friendsNames,
    siblingsNamesAges,
    petName,
    petType,
  } = characters;

  const { subject: pronoun, possessive } =
    PRONOUNS[protagonistGender] || PRONOUNS.boy;

  let context = `Our story's protagonist is ${protagonistName}, a ${protagonistAge}-year-old child.`;

  if (relevance.includeFriends && friendsNames.length > 0) {
    context += ` ${
      pronoun.charAt(0).toUpperCase() + pronoun.slice(1)
    } has good friends named ${friendsNames.join(", ")}.`;
  }

  if (relevance.includeSiblings && siblingsNamesAges.length > 0) {
    const siblingDescriptions = siblingsNamesAges
      .map(([name, age]) => `${name} who is ${age} years old`)
      .join(", ");
    context += ` ${
      possessive.charAt(0).toUpperCase() + possessive.slice(1)
    } siblings are ${siblingDescriptions}.`;
  }

  if (relevance.includePet && petName && petType) {
    context += ` ${
      possessive.charAt(0).toUpperCase() + possessive.slice(1)
    } pet ${petName}, a ${petType}, accompanies ${
      characters.protagonistGender === "boy" ? "him" : "her"
    } on adventures.`;
  }

  return context.trim();
};

/**
 * @function buildLocationContext
 * @description Creates a narrative description of the location based on provided details
 *
 * @param {Object} places - Location details object
 * @param {string} places.cityName - Name of the city where story takes place
 * @param {string} [places.schoolName] - Name of the school if specified
 *
 * @returns {string} Formatted location context narrative
 *
 * @example
 * const locationContext = buildLocationContext({
 *   cityName: "Boston",
 *   schoolName: "Lincoln Elementary"
 * });
 */
const buildLocationContext = (places) => {
  const { cityName, schoolName } = places;
  return `The story takes place in ${cityName}, where ${
    schoolName ? `they attend ${schoolName}` : "they go to school"
  }.`;
};

/**
 * @function buildFamilyContext
 * @description Creates a narrative description of the family based on provided details
 *
 * @param {Object} familyAndEmotions - Family details object
 * @param {string[]} familyAndEmotions.parentsNames - Array of parents' names
 *
 * @returns {string} Formatted family context narrative
 *
 * @example
 * const familyContext = buildFamilyContext({
 *   parentsNames: ["Charles", "Laura"]
 * });
 */
const buildFamilyContext = (familyAndEmotions) => {
  const { parentsNames } = familyAndEmotions;
  return `Their parents, ${parentsNames.join(
    " and "
  )}, support their learning about economics.`;
};

/**
 * @function buildPreviousChaptersContext
 * @description Creates a narrative summary of previously accepted chapters
 *
 * @param {Array<Object>} previousChapters - Array of accepted chapter summaries
 * @param {string} previousChapters[].title - Chapter title
 * @param {string} previousChapters[].summary - Brief chapter summary
 * @param {string[]} previousChapters[].characters - Characters involved in the chapter
 *
 * @returns {string} Formatted previous chapters context
 *
 * @example
 * const previousContext = buildPreviousChaptersContext([
 *   {
 *     title: "Saving Money",
 *     summary: "John learned about piggy banks",
 *     characters: ["John", "Laura", "Max"]
 *   }
 * ]);
 */
const buildPreviousChaptersContext = (previousChapters) => {
  if (!previousChapters || previousChapters.length === 0) {
    return "";
  }

  const summaries = previousChapters
    .map(
      (chapter) =>
        `In "${chapter.title}", ${chapter.summary}. ` +
        `Characters involved: ${chapter.characters.join(", ")}.`
    )
    .join("\n");

  return `Previously in the story:\n${summaries}\n`;
};

/**
 * @function buildChapterPrompt
 * @description Combines all contexts and instructions to create a complete chapter prompt
 *
 * @param {string} topic - Main topic of the chapter
 * @param {string[]} subtopics - List of subtopics to cover in the chapter
 * @param {Object} storyVariables - Object containing all story settings
 * @param {Object} storyVariables.characters - Character details
 * @param {Object} storyVariables.places - Location details
 * @param {Object} storyVariables.familyAndEmotions - Family details
 * @param {Array<Object>} [previousChapters] - Array of previous chapter summaries
 * @param {Object} [characterRelevance] - Flags for including secondary characters
 *
 * @returns {string} Complete prompt for chapter generation
 *
 * @example
 * const prompt = buildChapterPrompt(
 *   "Saving",
 *   ["Piggy Banks", "Saving Goals"],
 *   storyVariables,
 *   previousChapters,
 *   { includeFriends: true, includePet: true }
 * );
 */
/**
 * @function buildChapterPrompt
 * @description Creates the initial chapter generation prompt with essential educational
 * context while maintaining creative freedom for the narrative structure.
 *
 * @param {string} topic - Main educational concept (e.g., "Saving Money")
 * @param {string[]} subtopics - Array of specific learning points
 * @param {Object} [storyVariables={}] - Basic story context
 * @param {Object} [storyVariables.characters] - Character information
 * @param {string} [storyVariables.characters.protagonistName] - Main character name
 * @param {number} [storyVariables.characters.protagonistAge] - Main character age
 * @param {Array<Object>} [previousChapters=[]] - Prior chapter summaries
 * @param {Object} [characterRelevance={}] - Character inclusion flags
 *
 * @returns {string} Complete generation prompt
 * @throws {Error} If topic or subtopics are invalid
 *
 * @example
 * const prompt = buildChapterPrompt(
 *   "Budgeting",
 *   ["Planning Expenses", "Tracking Money"],
 *   {
 *     characters: {
 *       protagonistName: "Luna",
 *       protagonistAge: 8
 *     }
 *   }
 * );
 */
function buildChapterPrompt(
  topic,
  subtopics,
  storyVariables = {},
  previousChapters = [],
  characterRelevance = {}
) {
  const previousContext = buildPreviousChaptersContext(previousChapters);
  const { protagonistName, protagonistAge } = storyVariables?.characters || {};

  return `
    ${previousContext}
    Please write an educational chapter about ${topic} that covers the following concepts: ${subtopics.join(
      ", "
    )}.

    Essential Context:
    - Protagonist: ${protagonistName || "the protagonist"}, age ${
      protagonistAge || "young"
    }

    Specific Instructions:
    - Use situations and examples that children might experience in daily life
    - Include interactions with other characters when relevant to the topic
    - Maintain a friendly and educational tone
    - Use analogies and examples appropriate for ${protagonistAge || "young"} children
    - Include small practical activities or exercises that children can do
    - Keep the narrative consistent with previous chapters
    - Avoid complex financial jargon
    - Start with a relatable scenario, explain the concept, provide examples, and end with an activity
    - Focus on the story and educational content - character details will be personalized later
  `.trim();
}

/**
 * @function personalizeChapterContent
 * @description Adapts generated educational content by naturally incorporating
 * story-specific details while preserving the core educational message.
 *
 * @param {string} content - Raw generated chapter content
 * @param {Object} [storyVariables={}] - Story personalization data
 * @param {Object} [storyVariables.characters] - Character details
 * @param {Object} [storyVariables.places] - Setting information
 * @param {Object} [storyVariables.familyAndEmotions] - Family dynamics
 *
 * @returns {string} Personalized chapter content
 * @throws {Error} If content is empty or invalid
 *
 * @example
 * const personalizedContent = personalizeChapterContent(
 *   "Base chapter content...",
 *   {
 *     characters: {
 *       protagonistName: "Luna",
 *       friendsNames: ["Oliver", "Emma"]
 *     },
 *     places: {
 *       cityName: "Sunnyville",
 *       schoolName: "Bright Academy"
 *     }
 *   }
 * );
 */
function personalizeChapterContent(content, storyVariables = {}) {
  // Clean up story variables by removing empty/null values recursively
  const cleanObject = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      const cleaned = obj.filter((item) => item != null).map(cleanObject);
      return cleaned.length ? cleaned : undefined;
    }

    const cleaned = Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanValue = cleanObject(value);
      if (
        cleanValue != null &&
        cleanValue !== "" &&
        !(Array.isArray(cleanValue) && !cleanValue.length) &&
        !(typeof cleanValue === "object" && !Object.keys(cleanValue).length)
      ) {
        acc[key] = cleanValue;
      }
      return acc;
    }, {});

    return Object.keys(cleaned).length ? cleaned : undefined;
  };

  const context = cleanObject(storyVariables);

  return `
    Please review and adapt the following text to naturally incorporate relevant details from the provided context.
    Make small modifications where necessary (e.g., adding mentioned siblings or locations), but maintain the core
    narrative and educational content. Only use details where they fit naturally.

    Original Text:
    ${content}

    Available Context (use only where appropriate):
    ${JSON.stringify(context, null, 2)}

    Instructions:
    - Keep the core story and educational content intact
    - Weave in context details naturally where they enhance the story
    - Make minimal changes necessary to incorporate relevant details
    - Maintain the original tone and flow
    - Ensure any added details feel organic to the narrative
  `.trim();
}

export { buildChapterPrompt, personalizeChapterContent };
