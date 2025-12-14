import { Page } from "@playwright/test";

import { UI_ENDPOINTS } from "../utils/constants";

import { BasePage } from "./basePage";

export class DashboardPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async verifyDashboardPageIsDisplayed(title: RegExp | string) {
    await this.verifyPageIsDisplayed(title);
  }

  async verifyRedirectToDashboardPage() {
    await this.verifyRedirectToPage(UI_ENDPOINTS.DASHBOARD);
  }

  async welcomeMessageIsDisplayed() {
    const welcomeMessageRegex = /^Hi,\s*.+\s*👋$/;
  
    await this.verifyElementIsVisible(
      this.page.getByText(welcomeMessageRegex),
      'welcome message'
    );
  }
}
