import { test as base, APIRequestContext, APIResponse } from '@playwright/test';

import { loginViaApi } from '../utils/apiAuthentication';
import { API_BASE_URL } from '../utils/constants';

type AuthenticatedRequest = {
  get: (url: string, options?: Parameters<APIRequestContext['get']>[1]) => Promise<APIResponse>;
  post: (url: string, options?: Parameters<APIRequestContext['post']>[1]) => Promise<APIResponse>;
  put: (url: string, options?: Parameters<APIRequestContext['put']>[1]) => Promise<APIResponse>;
  patch: (url: string, options?: Parameters<APIRequestContext['patch']>[1]) => Promise<APIResponse>;
  delete: (url: string, options?: Parameters<APIRequestContext['delete']>[1]) => Promise<APIResponse>;
};

type AuthenticatedApiFixtures = {
  authenticatedApi: AuthenticatedRequest;
  authToken: string;
};

export const test = base.extend<AuthenticatedApiFixtures>({
  authToken: async ({}, use) => {
    const token = await loginViaApi();
    await use(token);
  },

  authenticatedApi: async ({ request, authToken }, use) => {
    const authHeader = `Bearer ${authToken}`;

    // Generic wrapper for API methods
    const wrap = <K extends keyof AuthenticatedRequest>(method: K) =>
      (url: string, options?: any) =>
        (request[method] as any)(`${API_BASE_URL}${url}`, {
          ...options,
          headers: {
            Authorization: authHeader,
            ...options?.headers,
          },
        });

    const authenticatedRequest: AuthenticatedRequest = {
      get: wrap('get'),
      post: wrap('post'),
      put: wrap('put'),
      patch: wrap('patch'),
      delete: wrap('delete'),
    };

    await use(authenticatedRequest);
  },
});
