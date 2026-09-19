import { test } from '../../fixtures/hooks-fixture';
import { expect } from '@playwright/test';
import bookingsApiMockBody from '../../testdata/api-mocking/events-api-response-mock.json';
import { MyBookingsPage } from '../../pageobjects/MyBookingsPage';

test('API mocking to see Sandbox banner', {
    tag: ['@API', '@MOCK'],
    annotation: {
        type: 'Test Case Link',
        description: 'https://eventhub.rahulshettyacademy.com/events'
    }
}, async ({ page, goToURL, navigationPage,eventsPage }) => {


    await page.route('**/api/events*', async route => {
        const originalResponse=await route.fetch();
        await route.fulfill({
            response:originalResponse,
            body: JSON.stringify(bookingsApiMockBody)
          //  json: bookingsApiMockBody
        })
    })
    await navigationPage.navigateToEvents()
    await expect(eventsPage.getSandboxText()).toBeVisible();
    await expect(eventsPage.getEventsCards()).toHaveCount(6);
//add expect for sandbox and 6 events
})
