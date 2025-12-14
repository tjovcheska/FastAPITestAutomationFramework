import { Locator, Page } from "@playwright/test";

import { UI_ENDPOINTS } from "../utils/constants";

import { BasePage } from "./basePage";

export class LoginPage extends BasePage {
  private readonly title: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByText('Login to your account');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
  }

  async verifyLoginPageIsDisplayed() {
    await this.verifyPageIsDisplayed(/Log In - FastAPI Cloud/, this.title);
  }

  async verifyRedirectToLoginPage() {
    await this.verifyRedirectToPage(UI_ENDPOINTS.LOGIN);
  }

  async fillInLoginForm(email: string, password: string) {
    await this.fillEmailInput(this.emailInput, email);
    await this.fillPasswordInput(this.passwordInput, password);
  }

  async clickLoginButton() {
    await this.clickButton(this.loginButton, 'login');
  }
}
