import { defineConfig, devices } from '@playwright/test';
import process from 'node:process';
import dotenv from 'dotenv';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

// import path from 'path';
dotenv.config({
  path: process.env.ENV_NAME ? `./env-files/.env.${process.env.ENV_NAME}` : `./env-files/.env.qa`
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/ui-tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  retryStrategy: 'isolated',
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */

    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: 'global.setup.ts'
    },

    {
      name: 'chromium',
      use:
      {
        storageState: './playwright/.auth/state.json',
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL,

      },
      dependencies: ['setup']

    },

    {
      name: 'firefox',
      use: {
        storageState: './playwright/.auth/state.json',
        ...devices['Desktop Firefox'],
        baseURL: process.env.BASE_URL,
      },
      dependencies: ['setup']
    },

    {
      name: 'webkit',
      use: {
        storageState: './playwright/.auth/state.json',
        ...devices['Desktop Safari'],
        baseURL: process.env.BASE_URL,
      },
      dependencies: ['setup']
    },
    {
      name: 'apiTests',
      testDir: './tests/api-Tests',
      use: {
        baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
          "content-type": "application/json",
          "Accept": "application/json",
        }



      }

    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
