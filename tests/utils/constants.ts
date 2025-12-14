/**
 * API Endpoints Constants
 * 
 * Centralized location for all API endpoint paths.
 */

export const API_ENDPOINTS = {
  // Authentication endpoints
  LOGIN: '/api/v1/login/access-token',
  TEST_TOKEN: '/api/v1/login/test-token',
  PASSWORD_RECOVERY: '/api/v1/password-recovery',
  RESET_PASSWORD: '/api/v1/reset-password/',

  // User endpoints
  USERS: '/api/v1/users',
  USERS_ME: '/api/v1/users/me',
  USERS_ME_PASSWORD: '/api/v1/users/me/password',
  USERS_SIGNUP: '/api/v1/users/signup',

  // Item endpoints
  ITEMS: '/api/v1/items',

  // Utility endpoints
  HEALTH_CHECK: '/api/v1/utils/health-check',
  OPENAPI_JSON: '/api/v1/openapi.json',
} as const;

export const UI_ENDPOINTS = {
  DASHBOARD: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ITEMS: '/items'
} as const;

/**
 * Base API URL
 */
export const API_BASE_URL = process.env['API_BASE_URL'] || 'http://localhost:8000';

/**
 * Frontend Base URL
 */
export const FRONTEND_BASE_URL = process.env['FRONTEND_BASE_URL'] || 'http://localhost:5173';

export const TIMEOUTS = {
  MEDIUM: 5000,
  LONG: 10000,
} as const;
