import { test as base } from '@playwright/test';

import { loginViaApi } from '../utils/apiAuthentication';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Login via API and get the token
    const token = await loginViaApi();
    
    // Set the token in localStorage before navigating
    await page.addInitScript((token) => {
      localStorage.setItem('access_token', token);
    }, token);

    await use(page);
  },
});
