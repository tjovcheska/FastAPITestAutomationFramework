import { APIRequestContext, Page, request } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

import { loginViaApi } from './apiAuthentication';
import { API_BASE_URL, API_ENDPOINTS } from './constants';

export type Item = {
  id: string;
  title: string;
  description: string;
};

/**
 * Creates a Playwright API context with Bearer token authentication
 */
async function createApiContext(): Promise<APIRequestContext> {
  const token = await loginViaApi();
  return await request.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Creates a new item via API.
 * Optionally reloads the page to reflect it in UI.
 */
export async function createItem(
  page?: Page,
  title?: string,
  description?: string
): Promise<Item> {
  const apiContext = await createApiContext();
  try {
    const uniqueId = uuidv4();
    const itemData = {
      title: title || `Test Item ${uniqueId}`,
      description: description || `Test description ${uniqueId}`,
    };

    const response = await apiContext.post(API_ENDPOINTS.ITEMS, { data: itemData });

    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to create item: ${response.status()} - ${text}`);
    }

    const newItem = (await response.json()) as Item;

    if (page) await page.reload(); // update UI if page is provided

    return newItem;
  } finally {
    await apiContext.dispose();
  }
}

/**
 * Deletes a single item by ID via API.
 */
export async function deleteItem(itemId: string): Promise<void> {
  const apiContext = await createApiContext();
  try {
    const response = await apiContext.delete(`${API_ENDPOINTS.ITEMS}/${itemId}`);

    if (!response.ok()) {
      const text = await response.text();
      console.warn(`Failed to delete item ${itemId}: ${response.status()} - ${text}`);
    }
  } finally {
    await apiContext.dispose();
  }
}

/**
 * Gets all items for the authenticated user via API
 * Returns the items array or empty array if none exist
 */
export async function getAllItems(): Promise<Item[]> {
  const apiContext = await createApiContext();
  try {
    const response = await apiContext.get(API_ENDPOINTS.ITEMS);

    if (!response.ok()) {
      const text = await response.text();
      console.warn(`Failed to fetch items: ${response.status()} - ${text}`);
      return [];
    }

    const itemsData = (await response.json()) as { data: Item[]; count: number };
    return itemsData.data || [];
  } finally {
    await apiContext.dispose();
  }
}

/**
 * Finds an item by title via API
 * Returns the item if found, null otherwise
 */
export async function getItemByTitle(title: string): Promise<Item | null> {
  const items = await getAllItems();
  const foundItem = items.find((item) => item.title === title);
  return foundItem || null;
}
