# Test Framework Documentation

## Overview

This test framework provides comprehensive end-to-end testing for the FastAPI Web Automation Framework using Playwright. It includes both API and UI tests with a focus on maintainability, reusability, and best practices.

## Architecture

### Directory Structure

```
tests/
├── fixtures/              # Custom Playwright fixtures
│   ├── authenticatedAPI.fixture.ts    # API authentication fixture
│   └── authenticatedUI.fixture.ts     # UI authentication fixture
├── helpers/               # Helper functions
│   └── pageObjectInitializer.ts      # Page object initialization
├── pages/                 # Page Object Model classes
│   ├── basePage.ts        # Base page with common functionality
│   ├── dashboardPage.ts
│   ├── itemsPage.ts
│   └── loginPage.ts
├── specs/                 # Test specifications
│   ├── api/               # API endpoint tests
│   │   ├── itemsEndpoints.spec.ts
│   │   ├── usersEndpoints.spec.ts
│   │   └── utilsEndpoints.spec.ts
│   └── ui/                # UI/end-to-end tests
│       ├── crudItem.spec.ts
│       ├── login.spec.ts
│       └── signup.spec.ts
├── utils/                 # Utility functions
│   ├── apiAuthentication.ts    # API authentication helpers
│   ├── constants.ts            # Test constants and endpoints
│   ├── itemActions.ts          # Item-related API actions
│   ├── testDataBuilders.ts     # Test data factory/builders
│   └── testHelpers.ts          # Common test utilities
├── playwright.config.ts  # Playwright configuration
└── package.json          # Dependencies and scripts
```

## Key Features

### 1. Page Object Model (POM)
- **Base Page**: Common functionality shared across all pages
- **Page Classes**: Specific page implementations with reusable methods
- **Benefits**: Reduces code duplication, improves maintainability

### 2. Custom Fixtures
- **Authenticated API Fixture**: Automatically handles API authentication
- **Authenticated UI Fixture**: Handles UI authentication state
- **Benefits**: Reusable authentication logic across tests

### 3. Test Data Builders
- **Factory Pattern**: `ItemDataBuilder` for creating test data
- **Benefits**: Consistent test data, easy to modify, reduces duplication

### 4. Test Isolation
- **Cleanup Hooks**: Automatic cleanup of test data after each test
- **Unique Identifiers**: Timestamp-based unique data generation
- **Benefits**: Tests don't interfere with each other

### 5. Test Tags
- **@api**: API tests
- **@crud**: CRUD operation tests
- **@smoke**: Critical smoke tests
- **@edge-cases**: Edge case and boundary tests
- **Benefits**: Easy test filtering and execution control

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Docker and Docker Compose (for running the application)

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Environment Setup

Create a `.env` file in the project root with:

```env
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=changethis
API_BASE_URL=http://localhost:8000
FRONTEND_BASE_URL=http://localhost:5173
```

### Running Tests

```bash
# Run all tests
npm test

# Run only API tests
npm run test:api-tests

# Run only UI tests
npm run test:ui-tests

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with specific tag
npx playwright test --grep @smoke

# Run tests for specific project
npm run test:chromium
npm run test:mobile-chrome
```

### Viewing Test Reports

```bash
# Open HTML report
npm run test:report

# Open specific report
npm run test:report:open
```

## Writing Tests

### API Tests

#### Basic Structure

```typescript
import { test } from '../../fixtures/authenticatedAPI.fixture';
import { API_ENDPOINTS } from '../../utils/constants';
import { ItemDataBuilder } from '../../utils/testDataBuilders';

test.describe('My API Tests', { tag: '@api' }, () => {
  const createdItemIds: string[] = [];

  test.afterEach(async ({ authenticatedApi }) => {
    // Cleanup
    if (createdItemIds.length > 0) {
      await cleanupTestItems(authenticatedApi, createdItemIds);
      createdItemIds.length = 0;
    }
  });

  test('should do something', { tag: '@smoke' }, async ({ authenticatedApi }) => {
    // Test implementation
  });
});
```

#### Using Test Data Builders

```typescript
// Create minimal item
const itemData = ItemDataBuilder.minimal();

// Create full item with all fields
const itemData = ItemDataBuilder.full();

// Create custom item
const itemData = ItemDataBuilder.create()
  .withTitle('Custom Title')
  .withDescription('Custom Description')
  .build();
```

#### Using Test Helpers

```typescript
import { createItemViaApi, deleteItemViaApi } from '../../utils/testHelpers';

// Create item
const item = await createItemViaApi(authenticatedApi, ItemDataBuilder.full());

// Delete item
await deleteItemViaApi(authenticatedApi, item.id);
```

### UI Tests

#### Basic Structure

```typescript
import { test } from '../../fixtures/authenticatedUI.fixture';
import { initializePageObjects } from '../../helpers/pageObjectInitializer';
import { LoginPage } from '../../pages/loginPage';

test.describe('My UI Tests', { tag: '@ui' }, () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    ({ loginPage } = initializePageObjects(page));
    await page.goto('/login');
  });

  test('should do something', async () => {
    await loginPage.fillInLoginForm('user@example.com', 'password');
    await loginPage.clickLoginButton();
  });
});
```

## Test Tags

### Available Tags

- `@api` - API endpoint tests
- `@ui` - UI/end-to-end tests

### Using Tags

```bash
# Run only UI tests
npx playwright test --grep @ui

# Run only API tests
npx playwright test --grep @api
```

## Best Practices

### 1. Test Isolation
- Always clean up test data in `afterEach` hooks
- Use unique identifiers (timestamps, UUIDs) for test data
- Don't rely on test execution order

### 2. Test Data Management
- Use test data builders instead of inline data
- Create reusable helper functions for common operations
- Keep test data simple and focused

### 3. Assertions
- Use descriptive assertion messages
- Validate response schemas when possible
- Check both positive and negative cases

### 4. Code Organization
- Group related tests in `describe` blocks
- Use descriptive test names (BDD style)
- Add JSDoc comments for complex tests

### 5. Error Handling
- Handle expected errors gracefully
- Provide clear error messages
- Use helper functions for common error assertions

## CI/CD Integration

The framework is configured to run in GitHub Actions. See `.github/workflows/playwright-e2e-tests.yml` for details.

### CI Configuration
- Runs on push to `setup-ci` branch
- Uses Docker Compose for services
- Uploads test reports and artifacts
- Retries failed tests automatically

## Troubleshooting

### Tests Failing Locally

1. **Services not running**: Ensure Docker Compose services are up
   ```bash
   docker compose up -d
   ```

2. **Environment variables**: Check `.env` file exists and has correct values

3. **Browser issues**: Reinstall browsers
   ```bash
   npm run install:browsers
   ```

### Common Issues

- **Port conflicts**: Ensure ports 8000 (backend) and 5173 (frontend) are available
- **Database issues**: Reset database with `docker compose down -v`
- **Authentication failures**: Verify credentials in `.env` file

## Contributing

### Adding New Tests

1. Create test file in appropriate directory (`specs/api/` or `specs/ui/`)
2. Use existing patterns and fixtures
3. Add appropriate tags
4. Include cleanup logic
5. Update this README if adding new patterns

### Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Run linter before committing: `npm run lint`

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Test Framework Assessment](./FRAMEWORK_ASSESSMENT.md)

## Support

For issues or questions:
1. Check this documentation
2. Review test framework assessment
3. Check existing test examples
4. Review Playwright documentation
