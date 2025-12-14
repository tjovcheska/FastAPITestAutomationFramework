import { APIRequestContext, request } from '@playwright/test';

import { API_BASE_URL, API_ENDPOINTS } from './constants';

type LoginResponse = {
  access_token: string;
};

export async function loginViaApi(): Promise<string> {
  const apiContext: APIRequestContext = await request.newContext({
    baseURL: API_BASE_URL,
  });

  // OAuth2PasswordRequestForm expects form data with 'username' and 'password'
  const formData = new URLSearchParams();
  // Use FIRST_SUPERUSER from .env file
  const username = process.env['FIRST_SUPERUSER'] || '';
  const password = process.env['FIRST_SUPERUSER_PASSWORD'] || '';
  
  if (!username || !password) {
    throw new Error('Missing credentials: Set FIRST_SUPERUSER/FIRST_SUPERUSER_PASSWORD in .env file');
  }
  
  formData.append('username', username);
  formData.append('password', password);

  const response = await apiContext.post(API_ENDPOINTS.LOGIN, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: formData.toString(),
  });

  if (!response.ok()) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status()} - ${errorText}`);
  }

  const body = (await response.json()) as LoginResponse;
  return body.access_token;
}
