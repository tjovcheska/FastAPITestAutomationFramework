import { Page } from "@playwright/test";

import { DashboardPage } from "../pages/dashboardPage";
import { ItemsPage } from "../pages/itemsPage";
import { LoginPage } from "../pages/loginPage";
import { SignupPage } from "../pages/signupPage";

export function initializePageObjects(page: Page) {
  const loginPage = new LoginPage(page);
  const signupPage = new SignupPage(page);
  const dashboardPage = new DashboardPage(page);
  const itemsPage = new ItemsPage(page);

  return {
    loginPage,
    signupPage,
    dashboardPage,
    itemsPage
  };
}
