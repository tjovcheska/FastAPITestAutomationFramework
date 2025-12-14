import { Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class SignupPage extends BasePage {
  private readonly title: Locator;
  private readonly fullNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly signupButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByText('Create an account');
    this.fullNameInput = page.getByTestId('full-name-input');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.confirmPasswordInput = page.getByTestId('confirm-password-input');
    this.signupButton = page.getByRole('button', { name: 'Sign Up' });
  }

  async verifySignupPageIsDisplayed() {
    await this.verifyPageIsDisplayed(/Sign Up - FastAPI Cloud/, this.title);
  }

  async fillInSignupForm(email: string, password: string, fullName: string) {
    await this.fillInput(this.fullNameInput, fullName, 'full name');
    await this.fillEmailInput(this.emailInput, email);
    await this.fillPasswordInput(this.passwordInput, password);
    await this.fillPasswordInput(this.confirmPasswordInput, password);
  }

  async clickSignupButton() {
    await this.clickButton(this.signupButton, 'signup');
  }
}
