
import { expect } from '@playwright/test';
import bookingsAPIMockResponseBody from '../../testdata/api-mocking/bookings-api-response-mock.json';

import { test } from '../../fixtures/hooks-fixture';
import { MyBookingsPage } from '../../pageobjects/MyBookingsPage';

test('Mock test to see message - No bookings yet', {
    tag: ['@UI', '@MOCK'],
    annotation: {
        type: '',
        description: ''
    }
}, async ({ page, goToURL, commonApiUtils, commonUtils, navigationPage, myBookingsPage }) => {

    await page.route('**/api/bookings**', async route => {
        const originalResponse = await route.fetch()
        await route.fulfill({
            response: originalResponse,
            body: JSON.stringify(bookingsAPIMockResponseBody),
            //json:bookingsAPIMockResponseBody
        })
    })
    await navigationPage.navigateToMyBookings();
    await expect(myBookingsPage.noBookingsYetMsg).toBeVisible();

})
