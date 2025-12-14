import { test as baseTest } from '@playwright/test';

import { initializePageObjects } from '../../helpers/pageObjectInitializer';
import { DashboardPage } from '../../pages/dashboardPage';
import { LoginPage } from '../../pages/loginPage';
import { UI_ENDPOINTS } from '../../utils/constants';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

baseTest.beforeEach(async ({ page }) => {
  ({ loginPage, dashboardPage } = initializePageObjects(page));

  await page.goto(UI_ENDPOINTS.LOGIN);
});

baseTest.describe('User Login Flow', () => {
  /**
   * Test 1: User Login Flow
   * Verifies that users can successfully log in through the UI
   */
  baseTest('should allow user to log in successfully', async () => {
    const email = process.env.FIRST_SUPERUSER;
    const password = process.env.FIRST_SUPERUSER_PASSWORD;

    await loginPage.verifyLoginPageIsDisplayed();
    await loginPage.fillInLoginForm(email!, password!);
    await loginPage.clickLoginButton();

    await dashboardPage.verifyRedirectToDashboardPage();
    await dashboardPage.verifyDashboardPageIsDisplayed('Dashboard - FastAPI Cloud');

    await dashboardPage.welcomeMessageIsDisplayed();
  });
});
