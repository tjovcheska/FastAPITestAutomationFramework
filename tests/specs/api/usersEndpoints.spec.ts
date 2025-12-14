import { test as baseTest , expect } from '@playwright/test';

import { test } from '../../fixtures/authenticatedAPI.fixture';
import { API_BASE_URL, API_ENDPOINTS } from '../../utils/constants';

test.describe('Users API Endpoints Tests', () => {
  /**
   * Test 1: Update Password - Incorrect Current Password
   * Verifies that updating password with wrong current password returns 400
   */
  test('should return 400 when current password is incorrect', async ({ authenticatedApi }) => {
    const updatePasswordData = {
      current_password: 'WrongPassword123!',
      new_password: 'NewPassword123!',
    };

    const updateResponse = await authenticatedApi.patch(API_ENDPOINTS.USERS_ME_PASSWORD, {
      data: updatePasswordData,
    });

    expect(updateResponse.status()).toBe(400);
    const errorData = await updateResponse.json();
    expect(errorData).toHaveProperty('detail');
    expect(errorData.detail).toContain('Incorrect password');
  });

  /**
   * Test 2: Update Password - Same Password
   * Verifies that using the same password for current and new returns 400
   */
  test('should return 400 when new password is same as current', async ({ authenticatedApi }) => {
    const currentPassword =
      process.env['TEST_USER_PASSWORD'] ||
      process.env['FIRST_SUPERUSER_PASSWORD'] ||
      'changethis';

    const updatePasswordData = {
      current_password: currentPassword,
      new_password: currentPassword, // Same as current
    };

    const updateResponse = await authenticatedApi.patch(API_ENDPOINTS.USERS_ME_PASSWORD, {
      data: updatePasswordData,
    });

    expect(updateResponse.status()).toBe(400);
    const errorData = await updateResponse.json();
    expect(errorData).toHaveProperty('detail');
    expect(errorData.detail).toBe('New password cannot be the same as the current one');
  });
});

// Separate test suite for unauthenticated endpoints
baseTest.describe('Users API Endpoints - Unauthenticated', () => {
  /**
   * Test 3: User Signup - Duplicate Email
   * Verifies that signing up with an existing email returns 400
   */
  baseTest('should return 400 when signing up with existing email', async ({ request }) => {
    const timestamp = Date.now();
    const userData = {
      email: `duplicate${timestamp}@example.com`,
      password: 'TestPassword123!',
      full_name: `Test User ${timestamp}`,
    };

    // Create first user
    const firstResponse = await request.post(`${API_BASE_URL}${API_ENDPOINTS.USERS_SIGNUP}`, {
      data: userData,
    });
    expect(firstResponse.ok()).toBeTruthy();

    // Try to create second user with same email
    const secondResponse = await request.post(`${API_BASE_URL}${API_ENDPOINTS.USERS_SIGNUP}`, {
      data: userData,
    });

    expect(secondResponse.status()).toBe(400);
    const errorData = await secondResponse.json();
    expect(errorData).toHaveProperty('detail');
    expect(errorData.detail).toContain('already exists');
  });
});
