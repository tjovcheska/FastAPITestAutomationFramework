import { test as baseTest } from '@playwright/test';

import { initializePageObjects } from '../../helpers/pageObjectInitializer';
import { LoginPage } from '../../pages/loginPage';
import { SignupPage } from '../../pages/signupPage';
import { UI_ENDPOINTS } from '../../utils/constants';

let signupPage: SignupPage;
let loginPage: LoginPage;

baseTest.beforeEach(async ({ page }) => {
  ({ signupPage, loginPage } = initializePageObjects(page));

  await page.goto(UI_ENDPOINTS.SIGNUP);
});

baseTest.describe('User Signup Flow', () => {
  /**
   * Test 1: User Signup Flow
   * Verifies that new users can register through the UI
   */
  baseTest('should allow new user to sign up', async () => {
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    const password = 'TestPassword123!';
    const fullName = `Test User ${timestamp}`;

    await signupPage.verifySignupPageIsDisplayed();
    await signupPage.fillInSignupForm(email, password, fullName);
    await signupPage.clickSignupButton();

    await loginPage.verifyRedirectToLoginPage();
  });
});
