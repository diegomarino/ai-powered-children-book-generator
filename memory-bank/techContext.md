# Technical Context: Development Environment and Dependencies

## Development Environment

### Node.js Environment

- **Runtime**: Node.js v23.11.0
- **Package Manager**: npm
- **Module System**: ES Modules
- **Type System**: JavaScript

### Project Configuration

- **Entry Point**: src/cli/index.js
- **Package Type**: module (ES Modules)
- **Execution**: Via npm scripts or global CLI command

## Dependencies

### Core Dependencies

```json
{
  "ajv": "^8.17.1",      // JSON Schema validation
  "axios": "^1.8.4",      // HTTP client for API requests
  "chalk": "^5.3.0",      // Terminal styling (via display helper)
  "dotenv": "^16.5.0",    // Environment variable management
  "inquirer": "^9.2.14",  // Interactive CLI interface
  "openai": "^4.93.0",    // OpenAI API client
  "winston": "^3.11.0",   // Logging system
  "node-fetch": "^3.3.2"  // HTTP client for image downloads
}
```

### Prompt Editor

Located at `src/cli/utils/promptEditor.js`, this utility provides enhanced text editing capabilities:

```javascript
const promptEditor = {
  editPrompt(originalPrompt)  // Main editing interface
  splitIntoSections(prompt)   // Split content into manageable sections
  combineSections(sections)   // Combine sections back into complete prompt
}
```

Features:
- Full editor integration via inquirer
- Section-based content management
- Pre-populated content editing
- Markdown syntax highlighting
- Content validation
- Preview functionality
- Large text block handling

### Display Helper

Located at `src/cli/utils/display.js`, this utility provides consistent CLI output formatting:

```javascript
const display = {
  header(text)      // Blue bold headers with spacing
  title(text)       // Cyan bold titles
  label(text)       // Cyan labels for key-value pairs
  success(message)  // Green checkmark messages
  error(message)    // Red X messages with optional details
  warning(message)  // Yellow circle warnings
  info(message)    // Blue info messages
  progress(message) // Blue progress indicators
  path(filePath)    // Cyan bold file paths
  statusTag(status) // Color-coded chapter status
  blank()          // Empty line for spacing
  listItem(item)   // Gray bullet point items
}
```

### Logger Configuration

Located at `src/utils/logger.js`, this utility handles API logging:

```javascript
const logger = {
  logRequest(service, details)    // Log API request details
  logResponse(service, details)   // Log API response details
  logError(service, error, req)   // Log API errors with context
}
```

Features:
- JSON formatted logs
- Request/response tracking
- Error monitoring
- API usage tracking
- Timestamp inclusion
- Service categorization
- Multi-provider support

## Configuration System

### JSON Schema Validation

- **Library**: Ajv v8
- **Schema Files**:
  - chapters.schema.json
  - storyVariables.schema.json
  - imageGeneratorConfig.schema.json
  - imageStyles.schema.json
- **Validation Points**:
  - Configuration loading
  - Content updates
  - State changes
  - Provider settings

### Configuration Files

1. **Image Generation Configuration**
   - Provider selection
   - Provider-specific settings
   - Common parameters
   - Style selection
   - Stored in imageGeneratorConfig.js

2. **Story Variables**
   - Character details
   - Location settings
   - Family information
   - Visual descriptions
   - Stored in storyVariables.js

3. **Book Content**
   - Chapter structure
   - Topic organization
   - Learning objectives
   - Stored in chapters.js

4. **Image Styles**
   - Visual style presets
   - Scene compositions
   - Style combinations
   - Stored in imageStyles.js

## External Services

### OpenAI API

- **Models Used**:
  - GPT-4 for text generation
  - GPT-4 Turbo for faster responses
  - DALL-E 3 for high-quality images
  - DALL-E 2 for faster image generation
- **API Endpoints**:
  - `/chat/completions` for text
  - `/images/generations` for images
- **Parameters**:
  - quality: "hd" for DALL-E 3
  - style: "vivid" or "natural"
  - size: configurable dimensions
- **Rate Limits**: Managed per API key

### Freepik Mystic API

- **Models Available**:
  - realism: Enhanced reality
  - fluid: Creative flexibility
  - zen: Clean simplicity
- **Engines**:
  - automatic: Smart selection
  - magnific_illusio: Smooth illustrations
  - magnific_sharpy: Detailed realism
  - magnific_sparkle: Balanced approach
- **API Endpoints**:
  - `/v1/ai/mystic` for task creation
  - `/v1/ai/mystic/{task-id}` for status
- **Parameters**:
  - resolution: 1k/2k/4k options
  - creative_detailing: 0-100
  - aspect_ratio: format control
- **Rate Limits**: Managed per API key

## Technical Constraints

### API Constraints

1. **OpenAI Rate Limiting**
   - Requests per minute
   - Tokens per minute
   - Images per minute

2. **Mystic Rate Limiting**
   - Tasks per minute
   - Resolution limits
   - Concurrent tasks

3. **Context Limitations**
   - Maximum tokens per request
   - Maximum prompt length
   - Image generation constraints

4. **Cost Considerations**
   - Per-token pricing
   - Image generation costs
   - Model-specific rates
   - Resolution-based pricing

### File System

1. **Storage**
   - Local file system based
   - JSON for state
   - Markdown for content
   - PNG for images
   - Temporary storage for review

2. **Concurrency**
   - Single user operation
   - File locking not implemented
   - Atomic write operations

3. **Paths**
   - Relative path handling
   - Cross-platform compatibility
   - Directory structure maintenance
   - Temporary file management

## Security Considerations

### API Keys

- Stored in .env file
- Not version controlled
- Required for operation
- Multiple provider keys

### File System Security

- Local access only
- No network exposure
- Standard file permissions
- Temporary file access

### User Input

- Sanitized before use
- Validated for format
- Protected against injection

### Configuration Validation

- Schema-based validation
- Type checking
- Required field enforcement
- Constraint validation
- Provider-specific validation

## Performance Guidelines

### Memory Management

- Stream large files
- Clean up temporary data
- Monitor memory usage
- Log file rotation

### API Usage

- Provider-specific optimizations
- Batch requests when possible
- Cache responses where appropriate
- Implement retry logic
- Track usage patterns
- Cost optimization

### File Operations

- Atomic writes
- Efficient reads
- Regular cleanup
- Temporary file management

### Configuration Loading

- Validate on load
- Cache when appropriate
- Lazy loading where possible
- Incremental updates

## Development Workflow

### Setup Process

1. Clone repository
2. Install dependencies
3. Configure environment
4. Set up API keys:
   - OpenAI API key
   - Freepik API key

### Running Locally

1. `npm install` - Install dependencies
2. `npm start` - Run CLI
3. `npm link` - Install globally

### Development Commands

- `npm start` - Run the CLI
- `npm link` - Install globally
- `book-cli` - Run global command

## Error Handling Strategy

### API Errors

```javascript
try {
  const response = await generateImage(config, prompt, outputPath);
} catch (error) {
  if (error.response) {
    // API error response
  } else if (error.request) {
    // No response received
  } else {
    // Request error
  }
}
```

### File System Errors

```javascript
try {
  await fs.writeFile(path, content);
} catch (error) {
  if (error.code === 'ENOENT') {
    // No such file/directory
  } else if (error.code === 'EACCES') {
    // Permission denied
  }
}
```

### Configuration Validation Errors

```javascript
try {
  const valid = ajv.validate(schema, data);
  if (!valid) {
    throw new Error(ajv.errorsText());
  }
} catch (error) {
  // Handle validation errors
}
```

### User Input Validation

```javascript
function validateInput(input) {
  if (!input.trim()) {
    throw new Error('Input cannot be empty');
  }
  if (!/^[a-z0-9-]+$/.test(input)) {
    throw new Error('Invalid characters in input');
  }
  return true;
}
```

## Testing Strategy

### Manual Testing

- CLI navigation
- Content generation
- State management
- Error handling
- Configuration validation
- Multi-provider image generation
- Character consistency
- Provider comparison

### Future Test Implementation

- Unit tests for utilities
- Integration tests for commands
- E2E tests for workflows
- Schema validation tests
- Image quality metrics
- Provider performance tests

## Documentation Standards

### Code Documentation

- JSDoc comments
- Function documentation
- Type information
- Usage examples
- Provider-specific details

### Configuration Documentation

- Schema definitions
- Validation rules
- Example configurations
- Migration guides
- Provider setup guides

### User Documentation

- CLI help text
- Error messages
- Usage instructions
- Configuration guide
- Provider selection guide
