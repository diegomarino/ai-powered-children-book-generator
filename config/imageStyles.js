/**
 * @file Image style configuration and prompt generation
 * @module imageStyles
 * @requires none
 * @exports {DEFAULT_IMAGE_STYLE_PROMPT, IMAGE_STYLE_PRESETS, getIllustrationPrompt}
 *
 * @description This module defines the available illustration styles, scene composition
 * presets, and helper functions for generating image prompts.
 *
 * @functions
 * - getIllustrationPrompt: Assembles a full prompt using base style, scene preset and description
 *
 * @constants
 * - DEFAULT_IMAGE_STYLE_PROMPT: Named default visual styles for illustration prompts
 * - IMAGE_STYLE_PRESETS: Recommended scene composition presets to guide illustration style
 *
 * @flow
 * 1. Define base visual styles
 * 2. Define scene composition presets
 * 3. Provide helper function to combine styles and presets into prompts
 *
 * @error Handling
 * - Fallback to first style if requested style not found
 * - Fallback to empty string if preset not found
 */

/**
 * @constant {Array<Object>}
 * @type {Array}
 * @description Named default visual styles for illustration prompts
 * @property {string} name - Unique identifier for the style
 * @property {string} prompt - Base prompt text defining the visual style
 */
export const DEFAULT_IMAGE_STYLE_PROMPT = [
  {
    name: "storybook",
    prompt:
      "Classic children's book illustration, consistent style: gentle soft lines, bright and cheerful color palette, highly expressive and endearing characters, clear and simple backgrounds focusing attention on action. Whimsical and charming feel. Inspired by modern picture books like those by Oliver Jeffers or Beatrice Alemagna. No text.",
  },
  {
    name: "ghibli",
    prompt:
      "Studio Ghibli-inspired anime style: lush, detailed natural backgrounds with painterly textures, soft cinematic lighting casting gentle glows, characters with large expressive eyes conveying deep emotion, a sense of wonder and magical atmosphere. Nostalgic and heartwarming feel. No text.",
  },
  {
    name: "clay",
    prompt:
      "Claymation stop-motion style: characters and objects appear handcrafted from modeling clay, slight imperfections like fingerprints adding realism, soft volumetric textures, vibrant colors, often simple but tactile backgrounds. Playful, friendly, and tangible feel. No text.",
  },
  {
    name: "pixelart",
    prompt:
      "Retro 8-bit pixel art style: chunky blocky design, limited but vibrant color palette, clear outlines, nostalgic feel reminiscent of classic video games. Ideal for simple scenes and characters. Cheerful and playful aesthetic. No text.",
  },
  {
    name: "watercolor",
    prompt:
      "Soft watercolor illustration style: visible light brushstrokes, beautifully blended transparent colors creating soft gradients, fluid delicate edges, sometimes with fine ink outlines for definition. Evokes warmth, nostalgia, and gentle emotions. Dreamy and ethereal quality. No text.",
  },
  {
    name: "flat-vector",
    prompt:
      "Modern flat vector illustration: clean geometric shapes, bold solid lines, bright and contemporary limited color palette, minimal gradients or textures. Friendly, stylized characters. Excellent for clear communication, educational content, or graphic narratives. No text.",
  },
  {
    name: "cutout",
    prompt:
      "Paper cut-out collage style: distinct layered shapes suggesting different paper or fabric textures, visible paper edges, subtle drop shadows creating depth. Handcrafted, tactile feel. Vibrant, often bold color choices. Inspired by artists like Eric Carle or Lois Ehlert. No text.",
  },
  {
    name: "chalkboard",
    prompt:
      "Chalkboard drawing aesthetic: illustration appears drawn with white or colored chalk on a textured dark chalkboard background. Playful, slightly smudged lines for realism, simple charming character designs. Evokes a schoolroom or cozy cafe menu feel. Whimsical and educational vibe. No text.",
  },
  {
    name: "colored-pencil",
    prompt:
      "Colored pencil drawing style: visible waxy pencil texture, soft layered colors with gentle blending, subtle cross-hatching for shading, often with fine outlines. Warm, cozy, and slightly textured feel. Ideal for realistic yet gentle animal or character illustrations. No text.",
  },
  {
    name: "ink-and-wash",
    prompt:
      "Ink and wash illustration: expressive, dynamic black ink outlines defining characters and key elements, filled with loose, fluid washes of diluted ink or watercolor. High energy, slightly messy, spontaneous feel. Inspired by Quentin Blake or E.H. Shepard. No text.",
  },
  {
    name: "gouache-poster",
    prompt:
      "Retro gouache illustration style: opaque, flat blocks of rich color, bold simplified shapes, minimal texture, often a mid-century modern aesthetic. Vibrant, graphic, and highly stylized. Inspired by artists like Mary Blair. No text.",
  },
  {
    name: "vintage-storybook",
    prompt:
      "Vintage children's book illustration style (circa 1950s-1960s): slightly desaturated or specific retro color palette (e.g., mustard yellow, teal, muted red), charmingly simple character designs with rosy cheeks, perhaps a subtle paper grain texture. Nostalgic, sweet, and innocent feel. No text.",
  },
  {
    name: "whimsical-doodle",
    prompt:
      "Whimsical doodle art style: playful and quirky characters with potentially exaggerated features or unusual proportions, loose energetic linework like pen doodles, bright optimistic colors, imaginative and unexpected compositions. Fun, lighthearted, and spontaneous energy. No text.",
  },
  {
    name: "linocut-print",
    prompt:
      "Child-friendly linocut print style: bold graphic shapes defined by carved lines, visible wood grain or carving textures, limited but strong color palette often using overlays, slightly rustic and handcrafted feel. Strong visual impact, good for folk tales. No text.",
  },
  {
    name: "mixed-media",
    prompt:
      "Mixed media illustration style: combines elements like drawing, painting (watercolor/gouache), real-world textures (scanned paper, fabric), and digital collage. Layered, textured, and visually rich. Creates a unique, eclectic, and often surprising look. No text.",
  },
  {
    name: "fuzzy-felt",
    prompt:
      "Fuzzy felt board style: simplified shapes resembling felt pieces layered on a plain background, soft fuzzy texture on shapes, bright primary colors, minimal detail. Tactile, playful, and reminiscent of childhood toys. Ideal for very young children. No text.",
  },
  /*******************************************************************************
   *                                                                              *
   *     FREEPIK STYLES BELOW                                                     *
   *******************************************************************************/
  {
    name: "photo",
    prompt:
      "High-resolution photo style: realistic lighting, true-to-life colors, natural shadows and depth of field. Scene looks like it was captured with a professional DSLR camera. Detailed textures and accurate proportions. No text.",
  },
  {
    name: "digital-art",
    prompt:
      "Polished digital illustration style: smooth gradients, sharp details, vibrant color palettes, often with fantasy or sci-fi elements. Clean lines and modern rendering. Ideal for expressive and stylized characters. No text.",
  },
  {
    name: "3d",
    prompt:
      "Realistic 3D rendering style: lifelike lighting and shading, accurate materials and reflections, strong sense of depth and form. High-poly models with cinematic detail. No text.",
  },
  {
    name: "painting",
    prompt:
      "Traditional painting style: visible brush strokes, rich textured surfaces, organic blending of colors. Inspired by oil or acrylic canvas techniques. Evokes an artistic, gallery-like atmosphere. No text.",
  },
  {
    name: "low-poly",
    prompt:
      "Low-poly 3D art style: simplified geometric forms, flat shading, bold color blocks, and clean triangular meshes. Stylized minimalism with retro-futuristic or game-like vibe. No text.",
  },
  {
    name: "pixel-art",
    prompt:
      "Retro pixel art style: 8-bit or 16-bit game aesthetic with blocky characters and limited color palette. Crisp edges, nostalgic atmosphere, and charming simplicity. No text.",
  },
  {
    name: "anime",
    prompt:
      "Anime illustration style: 2D hand-drawn characters with large expressive eyes, clean linework, cel shading, and dramatic lighting. Backgrounds can be painterly or graphic. Inspired by modern Japanese animation. No text.",
  },
  {
    name: "cyberpunk",
    prompt:
      "Cyberpunk aesthetic: neon lighting, futuristic cityscapes, gritty tech environments, dark atmospheric tones. Often features rain, reflections, glowing signage, and dystopian vibes. No text.",
  },
  {
    name: "comic",
    prompt:
      "Comic book style: bold outlines, dynamic poses, dramatic shading, and halftone textures. Panel-like composition and vivid color schemes. Inspired by classic superhero comics. No text.",
  },
  {
    name: "vintage",
    prompt:
      "Vintage illustration style: aged paper texture, retro color palettes (muted reds, teals, ochres), mid-20th-century design aesthetics. Evokes nostalgia and classic printed media. No text.",
  },
  {
    name: "cartoon",
    prompt:
      "Cartoon style: exaggerated facial expressions, simplified shapes, bold lines, and playful, vibrant colors. Ideal for humorous and child-friendly characters. No text.",
  },
  {
    name: "vector",
    prompt:
      "Flat vector art style: clean geometric shapes, high contrast color blocks, minimalistic design with crisp lines and clear silhouettes. Great for infographics or modern illustrations. No text.",
  },
  {
    name: "studio-shot",
    prompt:
      "Professional studio photograph style: clean background, well-lit subject, soft shadows, high contrast and crisp details. Perfect for product photography or portraiture. No text.",
  },
  {
    name: "dark",
    prompt:
      "Dark aesthetic: moody lighting, high contrast shadows, deep blacks and muted colors. Evokes drama, mystery, or introspection. Could include gothic or noir elements. No text.",
  },
  {
    name: "sketch",
    prompt:
      "Pencil or ink sketch style: rough lines, cross-hatching, visible hand-drawn construction. Often monochrome or lightly tinted. Spontaneous and expressive feel. No text.",
  },
  {
    name: "mockup",
    prompt:
      "Clean product mockup style: minimal background, perfect lighting, photorealistic rendering of objects (often floating or centered), ideal for design presentations. No text.",
  },
  {
    name: "2000s-pone",
    prompt:
      "Early 2000s mobile UI style: glossy buttons, fake 3D shadows, bright gradients, and skeuomorphic icons. Looks like an old Nokia or Sony Ericsson phone screen. Retro tech aesthetic. No text.",
  },
  {
    name: "70s-vibe",
    prompt:
      "1970s-inspired illustration style: warm earthy tones (orange, brown, yellow), groovy patterns, vintage typography aesthetics, and nostalgic retro fashion. Evokes disco, hippie, and boho vibes. No text.",
  },
  {
    name: "watercolor",
    prompt:
      "Soft watercolor illustration style: visible light brushstrokes, beautifully blended transparent colors creating soft gradients, fluid delicate edges, sometimes with fine ink outlines for definition. Evokes warmth, nostalgia, and gentle emotions. Dreamy and ethereal quality. No text.",
  },
  {
    name: "art-nouveau",
    prompt:
      "Art Nouveau style: decorative flowing lines, floral patterns, pastel colors, and organic forms. Inspired by early 20th century artists like Alphonse Mucha. Elegant, ornate, and stylized. No text.",
  },
  {
    name: "origami",
    prompt:
      "Origami paper art style: folded paper textures, visible creases and geometric shapes, minimalist color palette. Often animal or nature subjects rendered in clean, precise form. No text.",
  },
  {
    name: "surreal",
    prompt:
      "Surreal art style: dreamlike and bizarre compositions, unexpected juxtapositions, often inspired by Salvador Dalí. Blurred reality, fantastical elements, strange logic. No text.",
  },
  {
    name: "fantasy",
    prompt:
      "High fantasy illustration style: magical creatures, enchanted forests, glowing lights, epic settings. Inspired by classic fantasy books and RPGs. Rich detail and mythical atmosphere. No text.",
  },
  {
    name: "traditional-japan",
    prompt:
      "Traditional Japanese art style: inspired by ukiyo-e woodblock prints with flat color layers, graceful linework, nature elements like sakura and waves, elegant compositions. No text.",
  },
];

/**
 * @constant {Object}
 * @type {Object}
 * @description Recommended scene composition presets to guide illustration style
 * @property {Object} preset - Each preset configuration
 * @property {string} preset.name - Human-readable name of the preset
 * @property {string} preset.description - Detailed description of the preset's purpose
 * @property {string} preset.promptAddon - Text to append to the base style prompt
 */
export const IMAGE_STYLE_PRESETS = {
  emotionalCloseUp: {
    name: "Emotional Close-Up",
    description:
      "Focus on facial expressions and emotions of a single character. Minimal background.",
    promptAddon:
      "Close-up on a character's face showing clear emotion, simple background.",
  },
  characterIntroduction: {
    name: "Character Introduction",
    description:
      "Full-body or mid-shot of a character in their environment, showing personality or key traits.",
    promptAddon:
      "A character standing in their personal space or favorite spot, showing personality.",
  },
  groupInteraction: {
    name: "Group Interaction",
    description:
      "Multiple characters interacting — playing, talking, collaborating.",
    promptAddon:
      "Group of characters talking, playing or collaborating in a friendly setting.",
  },
  parentChildMoment: {
    name: "Parent-Child Moment",
    description:
      "Tender moment between a child and an adult, often in a warm or safe setting.",
    promptAddon:
      "A child with a parent or caregiver sharing a warm moment, cozy setting.",
  },
  wideEstablishingShot: {
    name: "Wide Establishing Shot",
    description: "Scene-wide view to introduce a new setting or location.",
    promptAddon:
      "A wide view of a school, park, or town to establish the scene.",
  },
  birdEyeTown: {
    name: "Bird's-Eye Town View",
    description:
      "Overhead view of a neighborhood or town with activity and charm.",
    promptAddon:
      "Bird's-eye view of a friendly town with houses, parks, and people.",
  },
  insideView: {
    name: "Inside View",
    description:
      "Interior space like a room or shop, cozy and with personal details.",
    promptAddon:
      "Interior of a room or small store, with furniture and objects arranged naturally.",
  },
  silentSequence: {
    name: "Silent Sequence",
    description:
      "Action or mood moment with no text, focused on expression or gesture.",
    promptAddon:
      "A quiet moment showing only movement or feelings without speech.",
  },
  dynamicAction: {
    name: "Dynamic Action",
    description:
      "Characters in expressive, energetic poses — running, jumping, reacting.",
    promptAddon:
      "Characters mid-action with expressive poses and movement lines.",
  },
  followThrough: {
    name: "Follow Through",
    description:
      "Second beat of an action — like falling, landing, reacting. Great for humor or drama.",
    promptAddon:
      "Character reacting after a surprise or mistake, showing motion and emotion.",
  },
  beforeAfter: {
    name: "Before & After",
    description: "Two contrasting panels or a transformation scene.",
    promptAddon:
      "Illustration showing a change — before and after a decision, mistake, or learning.",
  },
  diagramConcept: {
    name: "Diagram Concept",
    description: "Simple, educational infographic or schematic visual.",
    promptAddon:
      "Simple infographic showing how something works using arrows and labels.",
  },
  splitFrameStory: {
    name: "Split Frame Story",
    description: "Comic-style sequence split into panels showing progression.",
    promptAddon:
      "A panel sequence telling a mini story or showing a step-by-step process.",
  },
  comparisonScene: {
    name: "Comparison Scene",
    description: "Visual comparison of two options or outcomes side-by-side.",
    promptAddon: "Two-part illustration comparing different choices or paths.",
  },
  metaphorVisual: {
    name: "Metaphor Visual",
    description: "Symbolic representation of an abstract idea.",
    promptAddon:
      "A metaphorical visual, such as money growing like a plant or effort shown as a mountain.",
  },
  magicalTouch: {
    name: "Magical Touch",
    description:
      "Sparkles, glows, or whimsical elements to give fantasy feeling.",
    promptAddon:
      "Add glowing sparkles or floating elements to give a sense of magic.",
  },
  nightScene: {
    name: "Night Scene",
    description:
      "Dark palette with light sources like lamps or moon. Calming or thoughtful.",
    promptAddon: "A nighttime setting with cool tones, stars or soft lighting.",
  },
  celebrationScene: {
    name: "Celebration Scene",
    description: "Joyful event with decorations, smiles, and energy.",
    promptAddon:
      "Characters celebrating with balloons, cake, music, or fireworks.",
  },
  transitionShot: {
    name: "Transition Shot",
    description:
      "Scene of movement or time passing — walking paths, trains, sun setting.",
    promptAddon:
      "Illustration showing the passage of time or travel, like sunset or journey in progress.",
  },
};

/**
 * @function getIllustrationPrompt
 * @description Assembles a full prompt using base style, scene preset and description
 * @param {Object} options - Generation options
 * @param {string} options.description - The specific scene or visual to illustrate
 * @param {string} [options.style='storybook'] - One of DEFAULT_IMAGE_STYLE_PROMPT names
 * @param {string} [options.preset='emotionalCloseUp'] - One of IMAGE_STYLE_PRESETS keys
 * @returns {string} Full prompt to be used with OpenAI image API
 * @throws {Error} If description is not provided
 * @example
 * const prompt = getIllustrationPrompt({
 *   description: "A young girl learning about saving money",
 *   style: "watercolor",
 *   preset: "metaphorVisual"
 * });
 */
export function getIllustrationPrompt({
  description,
  style = "storybook",
  preset = "emotionalCloseUp",
}) {
  if (!description) {
    throw new Error("Description is required for illustration prompt");
  }

  const baseStyle =
    DEFAULT_IMAGE_STYLE_PROMPT.find((s) => s.name === style)?.prompt ||
    DEFAULT_IMAGE_STYLE_PROMPT[0].prompt;
  const presetAddon = IMAGE_STYLE_PRESETS[preset]?.promptAddon || "";

  return `${baseStyle} ${presetAddon} Scene: ${description}`;
}
