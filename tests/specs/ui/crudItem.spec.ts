import { test } from '../../fixtures/authenticatedUI.fixture';
import { initializePageObjects } from '../../helpers/pageObjectInitializer';
import { ItemsPage } from '../../pages/itemsPage';
import { UI_ENDPOINTS } from '../../utils/constants';
import { createItem, deleteItem, getItemByTitle } from '../../utils/itemActions';

let itemsPage: ItemsPage;
let createdItemId: string;

test.beforeEach(async ({ page }) => {
    ({ itemsPage } = initializePageObjects(page));

    await page.goto(UI_ENDPOINTS.ITEMS);
  });

test.afterEach(async () => {
    if (createdItemId) {
      await deleteItem(createdItemId);
    }
});

test.describe('Full item lifecycle tests', () => {
  /**
   * Test 1: Create an item
   */
  test('should create a new item', async () => {
    // Create a new item title and description
    const timestamp = Date.now() + Math.random(); 
    const itemTitle = `Test Item ${timestamp}`;
    const itemDescription = `Test description for item ${timestamp}`;

    await itemsPage.verifyItemsPageIsDisplayed('Items - FastAPI Cloud');
    await itemsPage.clickAddItemButton();
    await itemsPage.verifyAddItemDialogIsDisplayed();
    await itemsPage.fillInAddItemForm(itemTitle, itemDescription);
    await itemsPage.clickSaveButton();
    await itemsPage.verifyAddItemDialogIsDisplayed(false);
    await itemsPage.verifyItemIsCreated(itemTitle);

    const item = await getItemByTitle(itemTitle);
    if (item) {
      createdItemId = item.id;
    }
  });

   /**
   * Test 2: Edit an item
   */
  test('should edit an item', async ({ page }) => {
    const item = await createItem(page);
    createdItemId = item.id;

    // Create a new updated item title and description
    const timestamp = Date.now() + Math.random(); 
    const updatedTitle = `Updated Item ${timestamp}`;
    const updatedDescription = `Updated description ${timestamp}`;
    
    await itemsPage.verifyItemsPageIsDisplayed('Items - FastAPI Cloud');
    await itemsPage.verifyItemIsDisplayed(item.title);
    await itemsPage.clickActionsMenuButton(item.title);
    await itemsPage.clickEditItemButton();
    await itemsPage.verifyEditItemDialogIsDisplayed();
    await itemsPage.fillInEditItemForm(updatedTitle, updatedDescription);
    await itemsPage.clickSaveButton();
    await itemsPage.verifyEditItemDialogIsDisplayed(false);
    await itemsPage.verifyItemIsUpdated(updatedTitle);
  });

   /**
   * Test 3: Delete an item
   */
  test('should delete an item', async ({ page }) => {
    const item = await createItem(page);
    createdItemId = item.id;

    await itemsPage.verifyItemsPageIsDisplayed('Items - FastAPI Cloud');
    await itemsPage.verifyItemIsDisplayed(item.title);
    await itemsPage.clickActionsMenuButton(item.title);
    await itemsPage.clickDeleteItemButton();
    await itemsPage.verifyDeleteItemDialogIsDisplayed();
    await itemsPage.clickDeleteButton();
    await itemsPage.verifyDeleteItemDialogIsDisplayed(false);
    await itemsPage.verifyItemIsDeleted(item.title);
  });
});
