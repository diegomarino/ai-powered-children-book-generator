/**
 * @file Chapter generation command
 * @module generateChapter
 * @requires inquirer
 * @requires chalk
 * @requires path
 * @requires fs/promises
 * @requires ../../generatorChapter
 * @requires ../../generatorImage
 * @requires ../../promptBuilder
 * @requires ../utils/bookState
 * @exports generateChapterContent
 *
 * @description This module handles the chapter generation workflow,
 * including prompt review/modification, content generation,
 * and image generation.
 *
 * @functions
 * - reviewPrompt: Allows review and modification of generation prompts
 * - reviewContent: Handles review of generated content
 * - handleImageGeneration: Manages the image generation process
 * - generateChapterContent: Main chapter generation function
 *
 * @constants
 *
 * @flow
 * 1. Build initial prompt from chapter details
 * 2. Review/modify prompt
 * 3. Generate chapter content
 * 4. Review generated content
 * 5. Generate accompanying image
 * 6. Save results to book state
 *
 * @error Handling
 * - Generation API errors: Caught and displayed to user
 * - File system errors: Caught when saving content
 */

import inquirer from "inquirer";
import path from "path";
import display from "../utils/display.js";
import fs from "fs/promises";
import { generateChapter } from "../../generatorChapter.js";
import { generateImage } from "../../imageGenerator.js";
import {
  buildChapterPrompt,
  personalizeChapterContent,
} from "../../promptBuilder.js";
import {
  buildIntroductionPrompt,
  personalizeIntroductionContent,
} from "../../promptBuilderExtras.js";
import { saveBookState } from "../utils/bookState.js";
import { editPrompt } from "../utils/promptEditor.js";
import { selectSceneForImage } from "../../sceneSelector.js";
import {
  getIllustrationPrompt,
  DEFAULT_IMAGE_STYLE_PROMPT,
  IMAGE_STYLE_PRESETS,
} from "../../../config/imageStyles.js";
import fetch from "node-fetch";

/**
 * @function reviewPrompt
 * @async
 * @description Displays a prompt and allows user to use, modify, or cancel
 *
 * @param {string} prompt - The generation prompt to review
 *
 * @returns {Promise<string|null>} The accepted or modified prompt, or null if cancelled
 *
 * @example
 * const finalPrompt = await reviewPrompt(initialPrompt);
 */
async function reviewPrompt(prompt) {
  display.title("Generated Prompt:");
  console.log(prompt);

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Would you like to:",
      choices: [
        {
          name: "Use this prompt",
          value: "use",
        },
        {
          name: "Modify the prompt",
          value: "modify",
        },
        {
          name: "Cancel generation",
          value: "cancel",
        },
      ],
    },
  ]);

  if (action === "modify") {
    return await editPrompt(prompt);
  }

  return action === "use" ? prompt : null;
}

/**
 * @function reviewContent
 * @async
 * @description Displays generated content and lets user review and decide actions
 *
 * @param {string} content - The generated content to review
 *
 * @returns {Promise<string>} User's action choice ('accept', 'regenerate', 'modify', 'wip')
 *
 * @example
 * const action = await reviewContent(generatedText);
 */
async function reviewContent(content) {
  display.title("Generated Content:");
  console.log(content);

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do with this content?",
      choices: [
        {
          name: "Accept and proceed to image generation",
          value: "accept",
        },
        {
          name: "Regenerate with same prompt",
          value: "regenerate",
        },
        {
          name: "Modify prompt and regenerate",
          value: "modify",
        },
        {
          name: "Mark as work in progress and return",
          value: "wip",
        },
      ],
    },
  ]);

  return action;
}

/**
 * @function handleImageGeneration
 * @async
 * @description Manages the image generation workflow for a chapter
 *
 * @param {Object} chapter - The chapter object to generate an image for
 * @param {Object} bookState - The current book state
 * @param {string} bookPath - Path to the book directory
 *
 * @returns {Promise<boolean|null>} Whether image generation was successful or skipped
 *
 * @example
 * const success = await handleImageGeneration(currentChapter, bookState, '/path/to/book');
 */
async function handleImageGeneration(chapter, bookState, bookPath) {
  try {
    // Ensure tmp directory exists
    await fs.mkdir("tmp", { recursive: true });

    // Get attempt number from chapter state or start at 1
    const attemptNumber = (chapter.image?.attempts || 0) + 1;

    // Select visual style
    const { style } = await inquirer.prompt([
      {
        type: "list",
        name: "style",
        message: "Choose a visual style:",
        choices: DEFAULT_IMAGE_STYLE_PROMPT.map((s) => ({
          name: s.name,
          value: s.name,
        })),
      },
    ]);

    // Select scene composition preset
    const { preset } = await inquirer.prompt([
      {
        type: "list",
        name: "preset",
        message: "Choose a scene composition:",
        choices: Object.entries(IMAGE_STYLE_PRESETS).map(([key, value]) => ({
          name: `${value.name}: ${value.description}`,
          value: key,
        })),
      },
    ]);

    // Select a scene from the chapter text
    display.progress("Analyzing chapter to select a scene...");
    const selectedScene = await selectSceneForImage(
      chapter.text,
      chapter.topic,
      {
        model: bookState.chatConfig.chatModel,
        temperature: bookState.chatConfig.temperature,
      }
    );

    display.title("Selected Scene:");
    console.log(selectedScene.scene);
    console.log("\nSummary for Image Generation:");
    console.log(selectedScene.summary);

    const { sceneAction } = await inquirer.prompt([
      {
        type: "list",
        name: "sceneAction",
        message: "Would you like to use this scene?",
        choices: [
          { name: "Use this scene", value: "use" },
          { name: "Skip scene selection and use full context", value: "skip" },
        ],
      },
    ]);

    // Build scene description
    const sceneDescription =
      sceneAction === "use" && selectedScene
        ? selectedScene.summary
        : `${chapter.topic}: ${chapter.text ? chapter.text.slice(0, 200) + "..." : chapter.lessonContext?.summary || ""}`;

    // Get character description if available
    const mainCharacter = Object.values(bookState.storyVariables.characters)[0];
    const characterDescription = mainCharacter?.visualDescription || "";

    // Build the full prompt using imageStyles utility
    const imagePrompt = getIllustrationPrompt({
      description: characterDescription
        ? `${characterDescription} ${sceneDescription}`
        : sceneDescription,
      style,
      preset,
    });

    display.title("Generated Image Prompt:");
    console.log(imagePrompt);

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Would you like to:",
        choices: [
          {
            name: "Use this prompt",
            value: "use",
          },
          {
            name: "Modify the prompt",
            value: "modify",
          },
          {
            name: "Skip image generation",
            value: "skip",
          },
        ],
      },
    ]);

    if (action === "skip") return null;

    let finalPrompt = imagePrompt;
    if (action === "modify") {
      finalPrompt = await editPrompt(imagePrompt);
    }

    display.progress("Generating image...");

    // Generate unique temp filename
    const tempFileName = `${bookState.title.replace(/[^a-z0-9]/gi, "_")}_${
      chapter.id
    }_attempt${attemptNumber}_${Date.now()}.png`;
    const tempPath = path.join("tmp", tempFileName);

    // Generate image with configured parameters
    const outputPath = await generateImage(
      bookState.imageConfig,
      finalPrompt,
      tempPath
    );

    // Update chapter state
    chapter.image = {
      status: "generated",
      prompt: finalPrompt,
      tempPath: outputPath,
      attempts: attemptNumber,
      style,
      preset,
      timestamp: new Date().toISOString(),
    };

    await saveBookState(bookPath, bookState);

    display.success("Image generated and saved!");
    console.log(display.label("Temp Path:"), outputPath);

    const { imageAction } = await inquirer.prompt([
      {
        type: "list",
        name: "imageAction",
        message: "What would you like to do with this image?",
        choices: [
          {
            name: "Accept image",
            value: "accept",
          },
          {
            name: "Regenerate with same prompt",
            value: "regenerate",
          },
          {
            name: "Modify prompt and regenerate",
            value: "modify",
          },
          {
            name: "Skip image for now",
            value: "skip",
          },
        ],
      },
    ]);

    if (imageAction === "accept") {
      // Ensure images directory exists
      const imagesDir = path.join(bookPath, "images");
      await fs.mkdir(imagesDir, { recursive: true });

      // Copy from temp to final location
      const finalFileName = `chapter_${chapter.id}_image.png`;
      const finalPath = path.join(imagesDir, finalFileName);
      await fs.copyFile(outputPath, finalPath);

      chapter.image.status = "accepted";
      chapter.image.localPath = finalPath;
      await saveBookState(bookPath, bookState);
      return true;
    } else if (imageAction === "skip") {
      chapter.image.status = "wip";
      await saveBookState(bookPath, bookState);
      return false;
    }

    // For regenerate or modify, recursively call this function
    return await handleImageGeneration(chapter, bookState, bookPath);
  } catch (error) {
    display.error("Error in image generation:", error);
    return false;
  }
}

/**
 * @function generateChapterContent
 * @async
 * @description Main function to generate a chapter's content and image
 *
 * @param {Object} chapter - The chapter object to generate content for
 * @param {Object} bookState - The current book state
 * @param {string} bookPath - Path to the book directory
 *
 * @returns {Promise<boolean>} Whether generation was successful
 * @throws {Error} If there are issues with content generation
 *
 * @example
 * const success = await generateChapterContent(chapter, bookState, '/path/to/book');
 */
export async function generateChapterContent(chapter, bookState, bookPath) {
  try {
    // Build initial prompt
    let prompt;
    let isIntroduction = chapter.id === "introduction";

    if (isIntroduction) {
      // For introduction, only pass minimal character details initially
      const minimalVariables = {
        characters: {
          protagonistName: bookState.storyVariables.characters.protagonistName,
          protagonistAge: bookState.storyVariables.characters.protagonistAge,
        },
      };
      prompt = buildIntroductionPrompt(minimalVariables);
    } else {
      prompt = buildChapterPrompt(
        chapter.topic,
        chapter.lessonContext ? [chapter.lessonContext.summary] : [],
        bookState.storyVariables
      );
    }

    while (true) {
      // Review/modify prompt
      prompt = await reviewPrompt(prompt);
      if (!prompt) return false;

      display.progress("Generating content...");

      // Generate initial content
      const initialContent = await generateChapter(
        isIntroduction ? "Introduction" : chapter.topic,
        isIntroduction
          ? []
          : chapter.lessonContext
            ? [chapter.lessonContext.summary]
            : [],
        {
          characters: {
            protagonistName:
              bookState.storyVariables.characters.protagonistName,
            protagonistAge: bookState.storyVariables.characters.protagonistAge,
          },
        },
        bookState.currentContext,
        bookState.chatConfig.chatModel,
        bookState.chatConfig.temperature
      );

      // Build personalization prompt based on content type
      const personalizationPrompt = isIntroduction
        ? personalizeIntroductionContent(
            initialContent,
            bookState.storyVariables
          )
        : personalizeChapterContent(initialContent, bookState.storyVariables);

      // Personalize the content
      display.progress("Personalizing content with story details...");
      const personalizedContent = await generateChapter(
        "Content Personalization",
        [],
        bookState.storyVariables,
        personalizationPrompt,
        bookState.chatConfig.chatModel,
        bookState.chatConfig.temperature
      );

      // Update chapter with generated content
      chapter.text = personalizedContent;
      chapter.status = "generated";
      chapter.generationConfig = {
        initialPrompt: prompt,
        personalizationPrompt,
        model: bookState.chatConfig.chatModel,
        temperature: bookState.chatConfig.temperature,
        timestamp: new Date().toISOString(),
      };

      await saveBookState(bookPath, bookState);

      // Review content
      const action = await reviewContent(personalizedContent);

      switch (action) {
        case "accept":
          chapter.status = "accepted";
          // Update content.md
          const contentPath = path.join(bookPath, "content.md");
          await fs.appendFile(
            contentPath,
            `\n\n## ${chapter.topic}\n\n${personalizedContent}\n`
          );
          await saveBookState(bookPath, bookState);

          // Proceed to image generation
          await handleImageGeneration(chapter, bookState, bookPath);
          return true;

        case "regenerate":
          chapter.status = "wip";
          await saveBookState(bookPath, bookState);
          continue;

        case "modify":
          chapter.status = "wip";
          await saveBookState(bookPath, bookState);
          break;

        case "wip":
          chapter.status = "wip";
          await saveBookState(bookPath, bookState);
          return false;
      }
    }
  } catch (error) {
    display.error("Error generating chapter:", error);
    return false;
  }
}
