# Project Brief: Interactive Book Generator CLI

## Project Overview

An interactive command-line interface (CLI) tool for generating and managing educational economy books for children. The tool facilitates the entire book creation process, from initial configuration to chapter generation and review.

## Core Requirements

### Book Management

- Create, open, and delete books
- Each book stored in its own directory under `books/`
- Maintain book state and content separately
- Track generation history and configurations

### Content Generation

- Generate chapters using OpenAI's GPT-4
- Generate illustrations using multiple providers:
  - OpenAI DALL-E for traditional styles
  - Freepik Mystic for modern styles
- Allow prompt review and modification
- Maintain context between chapters

### Content Review System

- Track chapter and image status:
  - `not_generated`: Initial state
  - `generated`: First API response
  - `wip`: Being modified/regenerated
  - `accepted`: Final approved state
- Allow iterative refinement of content
- Save accepted content to Markdown file

### Configuration Management

- No default configurations
- User must explicitly choose:
  - Chat model and parameters
  - Image generation provider
  - Provider-specific settings
  - Image styles and presets
- Store configurations in book state

### Project Structure

```text
libro-economia-prole/
├── books/                    # All generated books
│   └── [book-name]/         # Individual book directories
│       ├── book-state.json  # Book metadata and state
│       ├── content.md       # Accepted content
│       └── images/          # Generated images
├── cli/                     # CLI implementation
│   ├── commands/           # CLI command modules
│   └── utils/              # Utility functions
│       └── configuration/  # Provider-specific config
├── src/                    # Core generation logic
└── memory-bank/           # Project documentation
```

## Technical Stack

- Node.js with ES Modules
- OpenAI API (GPT-4 and DALL-E)
- Freepik Mystic API
- Inquirer.js for CLI interactions
- Chalk for CLI styling

## Key Features

1. Interactive CLI interface
2. Step-by-step book configuration
3. Chapter generation with context awareness
4. Multi-provider image generation
   - Provider selection
   - Provider-specific optimizations
   - Style and composition control
5. Content review and refinement system
6. Progress tracking
7. State management
8. Configuration persistence

## Success Criteria

- Intuitive CLI interface
- Reliable content generation
- Flexible content refinement
- Proper state management
- Clear progress tracking
- Consistent file organization
- Effective provider integration
- Cost-efficient image generation
- High-quality visual output
