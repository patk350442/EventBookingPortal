
import { expect } from '@playwright/test';
import dummyDataMock from '../../testdata/api-mocking/dummy-data-mock.json';

import { test } from '../../fixtures/hooks-fixture';
import { MyBookingsPage } from '../../pageobjects/MyBookingsPage';

test(' Test to mock no access to a booking using status code', {
    tag: ['@UI', '@MOCK'],
    annotation: {
        type: '',
        description: ''
    }
}, async ({ page, goToURL, commonApiUtils, commonUtils, navigationPage, myBookingsPage }) => {

    await page.route('**/api/bookings/**', async route => {
        const originalResponse = await route.fetch();
        await route.fulfill({

            status: 404,

        })

    })



    await navigationPage.navigateToSpecificBooking(dummyDataMock.dummy_booking_id);
    await expect(myBookingsPage.getNoBookingsMsg()).toBeVisible();
    await expect(myBookingsPage.getBookingsDoesntExistMsg()).toBeVisible();

})
