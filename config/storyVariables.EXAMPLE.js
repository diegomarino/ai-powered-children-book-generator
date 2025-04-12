/**
 * @file Story variable template
 * @module storyVariables.EXAMPLE
 * @exports STORY_VARIABLES
 *
 * @description This module provides an example template for story variables
 * that can be used to customize a new book, using Bart Simpson as an example.
 *
 * @functions
 *
 * @constants
 * - STORY_VARIABLES: Empty template object for story settings
 *
 * @flow
 * 1. Define template for character details
 * 2. Define template for location details
 * 3. Define template for personal interests
 * 4. Define template for family details
 * 5. Define template for circumstantial details
 * 6. Define template for learning elements
 * 7. Define template for story-specific elements
 *
 * @error Handling
 * - None, this is a static template module
 */

/**
 * @constant {Object}
 * @type {Object}
 * @description Template for story variables that can be customized
 */
export const STORY_VARIABLES = {
  /**
   * @property {Object} characters - Main character and supporting character details
   */
  characters: {
    protagonistName: "Bart Simpson",
    protagonistAge: "10",
    protagonistGender: "boy",
    friendsNames: ["Milhouse Van Houten", "Nelson Muntz", "Martin Prince"],
    siblingsNamesAges: [
      ["Lisa", "8"],
      ["Maggie", "1"],
    ],
    petName: "Santa's Little Helper",
    petType: "greyhound dog",
  },

  /**
   * @property {Object} places - Location settings for the story
   */
  places: {
    cityName: "Springfield",
    schoolName: "Springfield Elementary School",
    parkName: "Springfield Park",
    homeStreetName: "742 Evergreen Terrace",
    favoritePlaces: [
      "Kwik-E-Mart",
      "Android's Dungeon & Baseball Card Shop",
      "Krusty Burger",
      "Springfield Skateboard Park",
    ],
  },

  /**
   * @property {Object} interests - Character's personal interests and preferences
   */
  interests: {
    favoriteSport: "skateboarding",
    favoriteActivity: "playing pranks",
    favoriteToy: "skateboard",
    favoriteSuperheroOrCharacter: "Krusty the Clown",
    favoriteBook: "Radioactive Man comics",
  },

  /**
   * @property {Object} familyAndEmotions - Family relationships and emotional elements
   */
  familyAndEmotions: {
    parentsNames: ["Homer", "Marge"],
    grandparentsNames: [
      "Abraham 'Grampa' Simpson",
      "Jacqueline Bouvier",
      "Clancy Bouvier",
    ],
    favoriteTeacherName: "Mrs. Krabappel",
    favoriteFamilyActivity: "watching TV together",
  },

  /**
   * @property {Object} circumstantialDetails - Temporal and situational context
   */
  circumstantialDetails: {
    season: "school year",
    specialDay: "presentation day at school",
    favoriteFood: "Krusty Burger with fries",
    favoriteClothing: "orange t-shirt, blue shorts, and blue sneakers",
  },

  /**
   * @property {Object} conflictAndLearning - Character growth and learning elements
   */
  conflictAndLearning: {
    protagonistFear: "failing at school and disappointing his sister Lisa",
    overcomeChallenge:
      "learning to manage money responsibly despite temptations",
    learnedSkill: "basic budgeting and saving techniques",
  },

  /**
   * @property {Object} storySpecificDetails - Special narrative elements
   */
  storySpecificDetails: {
    importantObject: "piggy bank shaped like Krusty the Clown",
    villainOrAntagonist: "impulsive spending habits",
    helperOrMentor: "Lisa Simpson (his economically savvy sister)",
    imaginaryOrFantasyPlace:
      "Springfield Money Factory (where Bart learns how money is made)",
  },
};
