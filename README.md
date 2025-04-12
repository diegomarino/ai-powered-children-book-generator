# ai-powered-children-book-generator

Transform economic education for children through AI-powered storytelling. Create engaging, personalized books that make complex economic concepts accessible and fun.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Interactive CLI** for guided book creation and management
- **Two-Step Content Generation:**
  - Initial creative draft with minimal context for maximum storytelling freedom
  - Smart personalization step that naturally weaves in character details
- **Multi-Provider Image Generation:**
  - OpenAI DALL-E (2 & 3) for diverse artistic styles
  - Freepik Mystic for modern, high-detail illustrations
- **Smart Configuration:**
  - Customizable story elements (characters, settings, themes)
  - Visual style selection and scene composition presets
  - Character consistency tools across illustrations
- **Professional Workflow:**
  - Chapter-based content management with status tracking
  - Full-featured text editor integration
  - Comprehensive API interaction logging
  - JSON Schema validated configurations

## Getting Started

### Prerequisites

- Node.js (v23.11.0 or later)
- npm
- Text editor (VS Code recommended, but any editor works)
- API Keys (see below)

### Installation

1. Clone the repository:

```bash
git clone [https://www.github.com/diegomarino/ai-powered-children-book-generator]
cd ai-powered-children-book-generator
```

2. Install dependencies:

```bash
npm install
```

3. Copy config files

```bash
npm run cp:config
```

4. Set up environment variables:

```bash
cp .env.EXAMPLE .env
```

Edit `.env` with your API keys:

```dotenv
OPENAI_API_KEY=your_openai_key_here
FREEPIK_API_KEY=your_freepik_key_here  # Optional, only if using Mystic
```

### API Keys Required

- **OpenAI API Key:**
  - Required for text generation (GPT-4/Turbo)
  - Optional for image generation (DALL-E 2/3)
  - Get your key from [OpenAI Platform](https://platform.openai.com/)
- **Freepik API Key:**
  - Optional, required only if using Mystic image generator
  - Get your key from [Freepik Developers](https://www.freepik.com/developers)

## Usage

### Basic Commands

```bash
# Start the CLI
npm start

# Install globally (optional)
npm link
book-cli
```

### Text Editor Configuration

The project uses your system's default text editor to modify AI prompts before they are sent to the API. This allows you to review and refine the generated content. You can configure which editor to use in any of these ways:

1. For the current session:

```bash
export EDITOR=code  # For VS Code
```

2. Permanently in your shell config (~/.zshrc):

```bash
echo 'export EDITOR=code' >> ~/.zshrc
source ~/.zshrc
```

3. Just for a single run:

```bash
EDITOR=code npm start
```

Common editor options:

- `code`: VS Code (requires 'code' command installation)
- `nano`: Simple terminal editor (default)
- `vim` or `vi`: Advanced terminal editor
- `subl`: Sublime Text

## Configuration

The tool uses a layered configuration system:

### Global Configuration (`config/`)

- **chapters.js:** Book structure and chapter topics
- **storyVariables.js:** Default character details and settings
- **imageGeneratorConfig.js:** Image generation preferences
- **imageStyles.js:** Visual styles and scene presets
- **openaiConfig.js:** OpenAI model parameters

All configurations are validated using JSON schemas in `config/schemas/`.

### Book-Specific Configuration

Each book maintains its own state and settings in `book-state.json`, allowing customization of:

- Character details
- Visual style preferences
- Provider selections
- Model parameters

### Image Generation

Choose between two powerful providers:

- **OpenAI DALL-E:**
  - DALL-E 3: High-quality, detailed illustrations with `vivid` or `natural` styles
  - DALL-E 2: Faster generation for rapid prototyping
  - Excellent for diverse artistic styles

- **Freepik Mystic:**
  - Multiple specialized engines:
    - `magnific_illusio`: Smooth, stylized illustrations
    - `magnific_sharpy`: Detailed, realistic renderings
    - `magnific_sparkle`: Balanced approach
  - Great for consistent, professional illustrations

## Project Structure

```text
libro-economia-prole/
├── books/              # Generated books
│   └── [book-name]/   # Individual book directories
│       ├── book-state.json  # State and metadata
│       ├── content.md       # Accepted content
│       └── images/          # Generated images
├── config/             # Configuration files
│   ├── chapters.js
│   ├── storyVariables.js
│   ├── imageGeneratorConfig.js
│   ├── imageStyles.js
│   └── schemas/        # JSON validation schemas
├── src/               # Source code
│   ├── cli/           # CLI implementation
│   │   ├── commands/  # Command modules
│   │   └── utils/     # Utility functions
│   └── utils/         # Core utilities
└── tmp/               # Temporary image storage
```

## Key Concepts

### Two-Step Content Generation

1. **Initial Generation:**
   - Uses minimal context for creative freedom
   - Focuses on storytelling and educational value
   - Creates engaging base content

2. **Personalization:**
   - Naturally integrates character details
   - Maintains narrative consistency
   - Enhances relatability

### Content States

Content progresses through defined states:

- `not_generated`: Initial state
- `generated`: First API response
- `wip`: Being modified
- `accepted`: Final approved state

### Configuration Layers

1. **Global Defaults** (`config/`):
   - Base settings for all books
   - Provider configurations
   - Style presets

2. **Book-Specific** (`book-state.json`):
   - Custom character details
   - Selected styles
   - Provider preferences

## Development

### Error Handling

The system includes comprehensive error handling for:

- API interactions
- File system operations
- User input validation
- Configuration validation

### Logging

Detailed logging system tracks:

- API requests and responses
- Error conditions
- Usage patterns
- Provider performance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT and DALL-E APIs
- Freepik for the Mystic API
- All contributors and users of this tool
