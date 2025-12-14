import { Locator, Page } from "@playwright/test";

import { TIMEOUTS } from "../utils/constants";

import { BasePage } from "./basePage";

export class ItemsPage extends BasePage {
  private readonly title: Locator;
  private readonly addItemButton: Locator;
  private readonly addItemDialog: Locator;
  private readonly titleInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly saveButton: Locator;
  private readonly editItemDialog: Locator;
  private readonly deleteItemDialog: Locator;
  private readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole('heading', { name: 'Items', exact: true });
    this.addItemButton = page.getByRole('button', { name: 'Add Item' });
    this.addItemDialog = page.getByRole('dialog', { name: 'Add Item' });
    this.titleInput = page.getByPlaceholder('Title');
    this.descriptionInput = page.getByPlaceholder('Description');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.editItemDialog = page.getByRole('dialog', { name: 'Edit Item' });
    this.deleteItemDialog = page.getByRole('dialog', { name: 'Delete Item' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
  }

  async verifyItemsPageIsDisplayed(title: RegExp | string) {
    await this.verifyPageIsDisplayed(title, this.title);
  }
  async clickAddItemButton() {
    await this.clickButton(this.addItemButton, 'add item button');
  }

  async verifyAddItemDialogIsDisplayed(isVisible: boolean = true) {
    if (isVisible) {
      await this.verifyElementIsVisible(this.addItemDialog, 'add item dialog');
    } else {
      await this.verifyElementIsNotVisible(this.addItemDialog, 'add item dialog');
    }
  }

  async fillInAddItemForm(title: string, description: string) {
    await this.fillInput(this.titleInput, title, 'title');
    await this.fillInput(this.descriptionInput, description, 'description');
  }

  async clickSaveButton() {
    await this.clickButton(this.saveButton, 'save button');
  }

  async verifyItemIsCreated(itemTitle: string) {
    await this.verifyElementIsVisible(this.page.getByText(itemTitle), 'item title');
  }

  async verifyItemIsDisplayed(itemTitle: string) {
    await this.verifyElementIsVisible(this.page.getByText(itemTitle), 'item title');
  }

  async clickActionsMenuButton(itemTitle: string) {
    // Find the item row by the item title
    const itemRow = this.page.locator('tr').filter({ hasText: itemTitle }).first();
    await this.verifyElementIsVisible(itemRow, 'item row');
    
    // Hover over the row to make the actions button visible (if it's hidden until hover)
    await itemRow.hover();
    
    // The actions button is typically in the last cell/column of the row
    // Try to find it in the last cell first
    const lastCell = itemRow.locator('td').last();
    let actionsButton = lastCell.getByRole('button').first();
    
    // Check if button exists in last cell, if not try finding any button in the row
    const buttonCount = await lastCell.getByRole('button').count();
    if (buttonCount === 0) {
      // Fallback: find any button in the row (usually the last one is the actions button)
      actionsButton = itemRow.getByRole('button').last();
    }
    
    // Wait for the button to be visible
    await actionsButton.waitFor({ state: 'visible', timeout: 5000 });
    
    // Scroll the button into view if needed
    await actionsButton.scrollIntoViewIfNeeded();
    
    // Click the button using the base method
    await this.clickButton(actionsButton, 'actions menu button');
  }

  async clickEditItemButton() {
    // Click the "Edit Item" option in the dropdown menu
    const editOption = this.page
      .getByText(/Edit Item/i)
      .or(this.page.getByRole('menuitem', { name: /Edit Item/i }))
      .first();
    
    await this.clickButton(editOption, 'edit item button');
  }

  async verifyEditItemDialogIsDisplayed(isVisible: boolean = true) {
    if (isVisible) {
      await this.verifyElementIsVisible(this.editItemDialog, 'edit item dialog');
    } else {
      await this.verifyElementIsNotVisible(this.editItemDialog, 'edit item dialog');
    }
  }

  async fillInEditItemForm(title: string, description: string) {
    // Wait for the form inputs to be visible and ready
    await this.titleInput.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.descriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    
    // Clear existing values first, then fill with new values
    await this.titleInput.clear();
    await this.fillInput(this.titleInput, title, 'title');
    await this.descriptionInput.clear();
    await this.fillInput(this.descriptionInput, description, 'description');
  }

  async verifyItemIsUpdated(itemTitle: string) {
    await this.verifyElementIsVisible(this.page.getByText(itemTitle), 'item title');
  }

  async clickDeleteItemButton() {
    // Click the "Delete Item" option in the dropdown menu
    const deleteOption = this.page
      .getByText(/Delete Item/i)
      .or(this.page.getByRole('menuitem', { name: /Delete Item/i }))
      .first();
    
    await this.clickButton(deleteOption, 'delete item button');
  }

  async verifyDeleteItemDialogIsDisplayed(isVisible: boolean = true) {
    if (isVisible) {
      await this.verifyElementIsVisible(this.deleteItemDialog, 'delete item dialog');
    } else {
      await this.verifyElementIsNotVisible(this.deleteItemDialog, 'delete item dialog');
    }
  }

  async clickDeleteButton() {
    await this.clickButton(this.deleteButton, 'delete button');
  }

  async verifyItemIsDeleted(itemTitle: string) {
    await this.verifyElementIsNotVisible(this.page.getByText(itemTitle), 'item title');
  }
}
