import { Locator, Page } from "@playwright/test";

export class MyBookingsPage {

    readonly page: Page;
    readonly bookingCards: Locator;
    readonly checkEligibilityForRefund: Locator;
    readonly refundyEligibilityMsg: Locator;
    readonly bookingTitleOnViewBookings: Locator;
    readonly cancelBookingDialogCancelBtn: Locator;
    readonly noBookingsYetMsg: Locator;
    readonly cancelBookingDialog: Locator;
    readonly cancelBookingModalText: Locator;
    readonly refundResultMsg: Locator;
    readonly clearAllBookings: Locator;
    readonly accessDeniedMsg: Locator;
    readonly notAuthorizedMsg: Locator;
    readonly noBookingsMsg:Locator;
    readonly bookingsDoesntExistMsg:Locator;

    constructor(page: Page) {
        this.page = page;

        this.bookingCards = page.locator('#booking-card');
        this.noBookingsYetMsg = page.getByText('No bookings yet');
        this.bookingTitleOnViewBookings = page.locator('.mb-8 h1');
        this.checkEligibilityForRefund = page.getByRole('button', { name: 'Check eligibility for refund?' });
        this.refundyEligibilityMsg = page.getByRole('strong');
        this.cancelBookingDialogCancelBtn = page.getByTestId('confirm-dialog-yes')
        this.cancelBookingDialog = page.getByRole('dialog', { name: 'Cancel this booking?' });
        this.cancelBookingModalText = page.getByText('Cancel this booking?');
        this.refundResultMsg = this.page.getByTestId('refund-result')
        this.clearAllBookings = this.page.getByRole('button', { name: 'Clear all bookings' });
        this.accessDeniedMsg = this.page.getByText('Access Denied');
        this.notAuthorizedMsg = this.page.getByText('You are not authorized to view this booking');
        this.noBookingsMsg=this.page.getByText('Booking not found')
        this.bookingsDoesntExistMsg=this.page.getByText(`This booking doesn't exist or may have been cancelled.`);

    }

    verifyBookingCard(bookingRefId: string,) {
        return this.bookingCards.filter({ hasText: `${bookingRefId}` });


    }

    verifyBookingTitle(bookingRefId: string, bookingTitle: string) {
        return this.bookingCards.filter({ hasText: `${bookingRefId}` }).getByText(`${bookingTitle}`);
    }

    async viewBookingDetails(bookingRefId: string) {
        await this.bookingCards.filter({ hasText: `${bookingRefId}` }).getByRole('button', { name: 'View Details' }).click();
    }

    async clickOnCheckEligibilityForRefund(): Promise<void> {
        this.checkEligibilityForRefund.click();
    }

    async cancelBooking(bookingRefId: string) {
        await this.bookingCards.filter({ hasText: `${bookingRefId}` }).getByRole('button', { name: 'Cancel Booking' }).click();
        await this.cancelBookingDialogCancelBtn.click();

    }
    async ClickclearAllBookings() {
        this.clearAllBookings.click();
        this.page.on('dialog', dialog => {
            dialog.accept();
        })

    }

    getAccessDeniedMsg() {
        return this.accessDeniedMsg;
    }


    getNotAuthorizedMsg() {
        return this.notAuthorizedMsg;
    }


    getNoBookingsMsg() {
        return this.noBookingsMsg;
    }


    getBookingsDoesntExistMsg() {
        return this.bookingsDoesntExistMsg;
    }


}