import { expect } from '@playwright/test';

import { test } from '../../fixtures/authenticatedAPI.fixture';
import { API_ENDPOINTS } from '../../utils/constants';

test.describe('Items API Endpoints Tests', () => {
  /**
   * Test 1: Read Items List - Success
   * Verifies that reading items list returns correct structure with data and count
   */
  test('should read items list successfully', async ({ authenticatedApi }) => {
    // Create an item first to ensure we have at least one item
    const itemData = {
      title: `Test Item for List ${Date.now()}`,
      description: 'Test description',
    };
    await authenticatedApi.post(API_ENDPOINTS.ITEMS, {
      data: itemData,
    });

    const listResponse = await authenticatedApi.get(API_ENDPOINTS.ITEMS);

    expect(listResponse.status()).toBe(200);
    const itemsData = await listResponse.json();
    expect(itemsData).toHaveProperty('data');
    expect(itemsData).toHaveProperty('count');
    expect(Array.isArray(itemsData.data)).toBeTruthy();
    expect(typeof itemsData.count).toBe('number');
    expect(itemsData.count).toBeGreaterThanOrEqual(0);
  });

  /**
   * Test 2: Read Item by ID - Success
   * Verifies that reading an item by ID returns correct item data
   */
  test('should read item by ID successfully', async ({ authenticatedApi }) => {
    // Create an item first
    const itemData = {
      title: `Test Item for Read ${Date.now()}`,
      description: 'Test description for read',
    };
    const createResponse = await authenticatedApi.post(API_ENDPOINTS.ITEMS, {
      data: itemData,
    });
    const createdItem = await createResponse.json();
    const itemId = createdItem.id;

    // Read the item by ID
    const readResponse = await authenticatedApi.get(
      `${API_ENDPOINTS.ITEMS}/${itemId}`
    );

    expect(readResponse.status()).toBe(200);
    const item = await readResponse.json();
    expect(item.id).toBe(itemId);
    expect(item.title).toBe(itemData.title);
    expect(item.description).toBe(itemData.description);
    expect(item).toHaveProperty('owner_id');
  });

  /**
   * Test 3: Read Item by ID - Not Found
   * Verifies that reading a non-existent item returns 404
   */
  test('should return 404 when reading non-existent item', async ({
    authenticatedApi,
  }) => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    const readResponse = await authenticatedApi.get(
      `${API_ENDPOINTS.ITEMS}/${fakeId}`
    );

    expect(readResponse.status()).toBe(404);
    const errorData = await readResponse.json();
    expect(errorData).toHaveProperty('detail');
    expect(errorData.detail).toBe('Item not found');
  });
});
