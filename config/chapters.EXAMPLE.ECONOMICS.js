/**
 * @file Economics book content
 * @module chapters
 * @exports BOOK_CONTENT
 *
 * @description This module defines the structured economics content
 * used to generate the educational book.
 *
 * @functions
 *
 * @constants
 * - BOOK_CONTENT: Array of chapter categories with topics
 *
 * @flow
 * 1. Define categories of economic concepts
 * 2. Define topics within each category
 * 3. Export the lesson structure
 *
 * @error Handling
 * - None, this is a static data module
 */

/**
 * @constant {Array<Object>}
 * @type {Array}
 * @description Structured economics content organized by category
 *
 * Each element is a category with:
 * - id: internal unique identifier
 * - title: display name for the category
 * - order: display order
 * - topics: array of concepts taught in this category
 *     - key: internal unique identifier for the topic
 *     - title: display name for the topic
 *     - example: child-friendly illustrative scenario
 *     - summary: short explanation of the concept
 */

// TODO - create a config/chapters/ folder where store multiple chapters

export const BOOK_CONTENT = [
  {
    id: "basicConcepts",
    title: "Introduction to Economics",
    description:
      "Foundation concepts about businesses, money, and basic economic principles that help children understand how the economy works in their daily lives.",
    order: 1,
    topics: [
      {
        key: "knowingWhatABusinessIs",
        title: "Knowing what a business is and how it works",
        example:
          "The main character decides to start a small business. They learn that a business means offering a product or service, helping others, and keeping track of how much is earned and spent.",
        summary:
          "Basic understanding of what a business does and why it exists.",
      },
      {
        key: "understandingSupplyAndDemand",
        title: "Understanding supply and demand",
        example:
          "The character tries to sell something that nobody seems interested in. They realize that offering something people really want makes the business more successful.",
        summary: "How demand affects success in a business.",
      },
      {
        key: "recognizingCompetition",
        title: "Recognizing the role of competition",
        example:
          "Another person starts a similar business nearby. At first it feels like a threat, but the main character realizes this pushes them to improve. They also learn that having more people offering similar products helps more customers learn about them.",
        summary:
          "Competition improves quality and helps promote the product category.",
      },
      {
        key: "identifyingFixedAndVariableCosts",
        title: "Identifying fixed and variable costs",
        example:
          "The character notices that some costs stay the same no matter what (like renting a table), while others change depending on how much they sell or produce (like materials used).",
        summary: "Differentiate between fixed and flexible business costs.",
      },
      {
        key: "calculatingProfitAndLoss",
        title: "Calculating profit and loss",
        example:
          "After a day of work, they count how much money came in and subtract what they spent, learning whether they earned a profit or experienced a loss.",
        summary: "Understanding how to calculate business success.",
      },
      {
        key: "settingPricingStrategies",
        title: "Setting pricing strategies",
        example:
          "They test different prices for their product and discover how price affects how many people buy it and how much they earn overall.",
        summary: "How price influences sales and income.",
      },
      {
        key: "understandingWhatMoneyIs",
        title: "Understanding what money is and why we use it",
        example:
          "Instead of trading things, the characters use money to buy and sell. They learn that money is a tool everyone agrees on, which makes exchanging things easier.",
        summary: "Money as a universal tool of exchange.",
      },
      {
        key: "distinguishingWantsAndNeeds",
        title: "Distinguishing between wants and needs",
        example:
          "The main character wants a new toy, but realizes they need to save money first to replace a toy they broke that belonged to their sibling.",
        summary: "Learning to prioritize between desires and responsibilities.",
      },
    ],
  },
  {
    id: "financialLiteracy",
    title: "Learning about money",
    description:
      "Essential skills for managing money wisely, including budgeting, saving, and understanding banking concepts.",
    order: 2,
    topics: [
      {
        key: "managingBudget",
        title: "Managing a budget",
        example:
          "The character plans how much money they can spend on supplies, how much to save, and how much to use for fun, making sure they don't run out.",
        summary: "Planning money to avoid overspending.",
      },
      {
        key: "trackingExpensesAndRevenues",
        title: "Tracking expenses and revenues",
        example:
          "They keep a notebook where they write down what they earn and what they spend, so they always know how their business is doing.",
        summary: "Writing down income and expenses to stay organized.",
      },
      {
        key: "importanceOfSavings",
        title: "Understanding the importance of savings",
        example:
          "They put aside a bit of money each time they earn something, learning that savings help when something unexpected happens.",
        summary: "Saving money for future or surprise needs.",
      },
      {
        key: "makingInvestmentDecisions",
        title: "Making investment decisions",
        example:
          "They think about buying new materials that could improve their product, but first compare prices and check if it's worth it.",
        summary: "Thinking before spending money to improve a business.",
      },
      {
        key: "usingMoneyResponsibly",
        title: "Learning how to use money responsibly",
        example:
          "Instead of spending all the money at once, they learn to think before buying and consider if it's really necessary.",
        summary: "Learning to delay gratification and spend wisely.",
      },
      {
        key: "whatBanksDo",
        title: "Understanding what a bank does",
        example:
          "They visit a bank with a parent and learn that banks keep money safe, help people save, and sometimes lend money.",
        summary: "The role of banks in keeping and managing money.",
      },
      {
        key: "debitVsCredit",
        title: "Knowing the difference between debit and credit",
        example:
          "They hear about debit and credit cards and learn that a debit card uses your own money, while a credit card means borrowing money to pay later.",
        summary: "Debit means your money, credit means borrowed money.",
      },
    ],
  },
  {
    id: "entrepreneurialSkills",
    title: "Entrepreneurial Skills",
    description:
      "Key abilities needed to start and run a successful business, from planning and marketing to customer service and teamwork.",
    order: 3,
    topics: [
      {
        key: "developingBusinessPlan",
        title: "Developing a business plan",
        example:
          "Before starting, the character writes down what they want to sell, how much it will cost, and how they will tell people about it — like a little roadmap.",
        summary: "Creating a basic plan to organize and guide a business.",
      },
      {
        key: "marketingAndAdvertising",
        title: "Marketing and advertising strategies",
        example:
          "They make posters and tell friends about their business. They learn that getting attention and explaining what they offer helps attract more customers.",
        summary: "How to promote your product or service to others.",
      },
      {
        key: "customerService",
        title: "Customer service and satisfaction",
        example:
          "A customer has a problem with the product. The character listens carefully and helps, learning that kindness and solutions bring people back.",
        summary: "Being helpful and respectful to customers.",
      },
      {
        key: "problemSolving",
        title: "Problem-solving and decision-making",
        example:
          "When something goes wrong, like forgetting materials, they stay calm and find a new way to fix it instead of giving up.",
        summary: "Handling challenges and making smart choices.",
      },
      {
        key: "sellingSkills",
        title: "Learning how to sell a product or service",
        example:
          "At first, they are shy talking to customers. But with practice, they learn to explain the benefits and feel proud of what they offer.",
        summary: "Communicating clearly to explain value and close a sale.",
      },
      {
        key: "teamwork",
        title: "Working with a team",
        example:
          "The character joins up with friends, sharing tasks and learning that teamwork helps things go faster and ideas get better.",
        summary: "Collaborating with others to reach common goals.",
      },
      {
        key: "adaptingToFeedback",
        title: "Adapting to challenges and feedback",
        example:
          "A customer says something could be improved. Instead of getting upset, they see it as a chance to grow and make the product even better.",
        summary: "Being open to feedback and willing to improve.",
      },
    ],
  },
  {
    id: "economicPrinciples",
    title: "Fundamental Economic Principles",
    description:
      "Advanced economic concepts that show how everything connects in the bigger picture, from resource management to the role of government.",
    order: 4,
    topics: [
      {
        key: "opportunityCost",
        title: "Opportunity cost",
        example:
          "They have to choose between buying supplies or a toy. They learn that choosing one thing means giving up something else.",
        summary: "Every choice has a trade-off.",
      },
      {
        key: "scarcityAndResources",
        title: "Scarcity and resource allocation",
        example:
          "They don't have enough time or materials to do everything. They learn to choose what's most important and use their resources wisely.",
        summary: "Resources are limited, so we must choose wisely.",
      },
      {
        key: "incentivesEffect",
        title: "Incentives and their effects",
        example:
          "They offer a small gift to customers who return, and notice it makes people more excited to come back.",
        summary: "Incentives motivate people to act in certain ways.",
      },
      {
        key: "taxesAndRegulations",
        title: "The impact of taxes and regulations",
        example:
          "They learn that sometimes part of the money they earn goes to help the community, like parks or schools.",
        summary: "Rules and taxes can support public goods.",
      },
      {
        key: "circularFlowOfMoney",
        title: "Circular flow of money in an economy",
        example:
          "They earn money and use it to buy things from other businesses, who then use it to pay workers — seeing how money keeps moving.",
        summary:
          "Money moves in cycles between people, businesses, and government.",
      },
      {
        key: "interdependence",
        title: "Understanding how people and businesses depend on each other",
        example:
          "They buy ingredients from another business, and sell to customers who rely on them. Everyone is connected like a big team.",
        summary: "We all rely on each other in the economy.",
      },
      {
        key: "governmentRole",
        title: "The role of government in the economy",
        example:
          "They hear how the local government helps businesses and families, like building roads or setting rules to keep things fair.",
        summary: "The government supports and regulates economic activity.",
      },
    ],
  },
];
