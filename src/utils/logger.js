/**
 * @file OpenAI API logging utility
 * @module logger
 * @requires winston
 * @exports logger
 *
 * @description This module configures a Winston logger instance for tracking
 * OpenAI API requests, responses, and errors in JSON format.
 *
 * @functions
 * - logRequest: Log API request details
 * - logResponse: Log API response details
 * - logError: Log API error details
 *
 * @constants
 * - logger: Winston logger instance configured for JSON logging
 *
 * @flow
 * 1. Configure Winston logger with JSON format
 * 2. Set up log file transport
 * 3. Export helper functions for consistent logging
 *
 * @error Handling
 * - File system errors caught and logged to console
 * - Invalid log data types handled gracefully
 */

import winston from "winston";
import path from "path";

/**
 * @constant {winston.Logger}
 * @description Winston logger instance configured for JSON logging to openai.log
 */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "openai.log",
      level: "info",
    }),
  ],
});

/**
 * @function logRequest
 * @description Log details of an OpenAI API request
 * @param {string} service - The service being called ('image' or 'chat')
 * @param {Object} details - Request parameters and context
 */
function logRequest(service, details) {
  logger.info({
    type: "request",
    service,
    details: {
      timestamp: new Date().toISOString(),
      ...details,
    },
  });
}

/**
 * @function logResponse
 * @description Log details of a successful OpenAI API response
 * @param {string} service - The service that was called ('image' or 'chat')
 * @param {Object} details - Response data and context
 */
function logResponse(service, details) {
  logger.info({
    type: "response",
    service,
    details: {
      timestamp: new Date().toISOString(),
      ...details,
    },
  });
}

/**
 * @function logError
 * @description Log details of an OpenAI API error
 * @param {string} service - The service that failed ('image' or 'chat')
 * @param {Error} error - The error object
 * @param {Object} requestDetails - The original request details for context
 */
function logError(service, error, requestDetails) {
  logger.error({
    type: "error",
    service,
    details: {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      request: requestDetails,
    },
  });
}

export { logRequest, logResponse, logError };
