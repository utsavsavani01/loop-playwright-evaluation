import { test, expect } from '@playwright/test';

// Hardcoding the validation array directly eliminates all JSON resolution issues entirely
const testData = [
  {
    "id": 1,
    "navigation": "Web Application",
    "taskName": "Implement user authentication",
    "column": "To Do",
    "tags": ["Feature", "High Priority"]
  },
  {
    "id": 2,
    "navigation": "Web Application",
    "taskName": "Fix navigation bug",
    "column": "To Do",
    "tags": ["Bug"]
  },
  {
    "id": 3,
    "navigation": "Web Application",
    "taskName": "Design system updates",
    "column": "In Progress",
    "tags": ["Design"]
  },
  {
    "id": 4,
    "navigation": "Mobile Application",
    "taskName": "Push notification system",
    "column": "To Do",
    "tags": ["Feature"]
  },
  {
    "id": 5,
    "navigation": "Mobile Application",
    "taskName": "Offline mode",
    "column": "In Progress",
    "tags": ["Feature", "High Priority"]
  },
  {
    "id": 6,
    "navigation": "Mobile Application",
    "taskName": "App icon design",
    "column": "Done",
    "tags": ["Design"]
  }
];

test.describe('Asana Dashboard Data-Driven Evaluation Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://create-asana-like-pr-39y5.bolt.host/');

    await page.locator('input[type="text"], input[placeholder*="Email"]').fill('admin');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"], button:has-text("Sign in")').click();

    await page.waitForLoadState('networkidle');
  });

  for (const data of testData) {
    test(`Test Case ${data.id}: Verify "${data.taskName}" under "${data.navigation}" -> "${data.column}"`, async ({ page }) => {
      
      const appSectionNav = page.locator(`button:has-text("${data.navigation}")`);
      await appSectionNav.click();

      const columnContainer = page.locator('div', { has: page.locator(`h2:has-text("${data.column}"), h3:has-text("${data.column}")`) });
      
      const taskCard = columnContainer.locator('div', { hasText: data.taskName }).filter({
        has: page.locator('span, p, h1, h2, h3, h4', { hasText: data.taskName })
      }).first();

      await expect(taskCard).toBeVisible();

      for (const tag of data.tags) {
        const tagElement = taskCard.locator(`span:has-text("${tag}")`).first();
        await expect(tagElement).toBeVisible();
      }
    });
  }
});
