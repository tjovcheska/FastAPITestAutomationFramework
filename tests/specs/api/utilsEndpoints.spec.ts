
import { expect, test } from '@playwright/test';

import { API_BASE_URL, API_ENDPOINTS } from '../../utils/constants';

test.describe('Utils API Endpoints - Unauthenticated', () => {
  /**
   * Test 1: Health Check (Unauthenticated)
   * Verifies that health check works without authentication
   */
  test('should return health check status without authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${API_ENDPOINTS.HEALTH_CHECK}`);

    expect(response.ok()).toBeTruthy();
    const healthStatus = await response.json();
    expect(healthStatus).toBeTruthy();
  });
});
