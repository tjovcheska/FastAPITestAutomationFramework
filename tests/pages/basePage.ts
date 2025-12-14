import { expect, Locator, Page, test } from "@playwright/test";

import { FRONTEND_BASE_URL } from "../utils/constants";

/**
 * Base page class with common functionality shared across all pages
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Common function to verify page title
   */
  async verifyPageTitle(expectedTitle: RegExp | string) {
    await test.step(`Verify page title matches: ${expectedTitle}`, async () => {
      await expect(this.page).toHaveTitle(expectedTitle);
    });
  }

  /**
   * Common function to verify page URL
   */
  async verifyPageUrl(expectedUrl: RegExp | string) {
    await test.step(`Verify page URL matches: ${expectedUrl}`, async () => {
      await expect(this.page).toHaveURL(expectedUrl);
    });
  }

  /**
   * Common function to verify element is visible
   */
  async verifyElementIsVisible(locator: Locator, elementName?: string) {
    await test.step(
      `Verify ${elementName || "element"} is visible`,
      async () => {
        await expect(locator).toBeVisible();
      }
    );
  }

  /**
   * Common function to verify element is not visible
   */
    async verifyElementIsNotVisible(locator: Locator, elementName?: string) {
      await test.step(
        `Verify ${elementName || "element"} is not visible`,
        async () => {
          await expect(locator).not.toBeVisible();
        }
      );
    }

  /**
   * Common function to fill input field
   */
  async fillInput(
    locator: Locator,
    value: string,
    fieldName?: string
  ) {
    await test.step(`Fill ${fieldName || "input"} with: ${value}`, async () => {
      await locator.fill(value);
    });
  }

  /**
   * Common function to click button
   */
  async clickButton(
    locator: Locator,
    buttonName?: string
  ) {
    await test.step(`Click ${buttonName || "button"}`, async () => {
      await locator.click();
    });
  }

  /**
   * Common function to verify redirect to a specific page
   */
  async verifyRedirectToPage(path: string) {
    await test.step(`Verify redirect to ${path}`, async () => {
      const urlPattern = path === "/" 
        ? new RegExp(`${FRONTEND_BASE_URL}/?$`)
        : new RegExp(`${FRONTEND_BASE_URL}${path}`);
      await expect(this.page).toHaveURL(urlPattern);
    });
  }

  /**
   * Common function to verify page is displayed with title and optional title text
   */
  async verifyPageIsDisplayed(
    expectedTitle: RegExp | string,
    titleTextLocator?: Locator
  ) {
    await test.step("Verify page is displayed", async () => {
      await this.verifyPageTitle(expectedTitle);
      if (titleTextLocator) {
        await this.verifyElementIsVisible(titleTextLocator, "page title text");
      }
    });
  }

  /**
   * Common function to fill email input
   */
  async fillEmailInput(emailInput: Locator, email: string) {
    await this.fillInput(emailInput, email, "email");
  }

  /**
   * Common function to fill password input
   */
  async fillPasswordInput(passwordInput: Locator, password: string) {
    await this.fillInput(passwordInput, password, "password");
  }

  /**
   * Common function to wait for navigation
   */
  async waitForNavigation() {
    await this.page.waitForLoadState("networkidle");
  }
}
