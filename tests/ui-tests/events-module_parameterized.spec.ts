import { expect } from '@playwright/test';
import { test } from '../../fixtures/hooks-fixture';
import newEventData from '../../testdata/ui-data/new-event-module.json';
import process from 'node:process';
import dataSet from '../../testdata/ui-data/new-event-module_paremeterization.json';


for (const data of dataSet) {
let seatsBeforeBooking: any;
let bookingReferenceNum: any;
    test.describe.serial(`Verify new event creation, booking and deletion with non refundable #tickets - ${data.event_booking_number_of_tickets}`, async () => {



        test(`Verify user is able to create a new event successfully with #tickets -${data.event_booking_number_of_tickets}`, {
            tag: ['@UI', '@UAT'],
            annotation: {
                type: 'Test Case Link',
                description: 'https://eventhub.rahulshettyacademy.com/'
            }

        }, async ({ page, goToURL, navigationPage, newEventPage, eventsPage }) => {

            await navigationPage.navigateToManageEvents()
            await expect(page).toHaveURL(`${process.env.BASE_URL}/admin/events`);
            await newEventPage.createNewEvent(newEventData.new_event_title, newEventData.new_event_description, newEventData.new_event_category, newEventData.new_event_city, newEventData.new_event_venue, newEventData.new_event_date_time, newEventData.new_event_price, newEventData.new_event_total_seats);
            await expect(newEventPage.newEventSuccessMsg).toBeVisible();
            await navigationPage.navigateToEvents();
            await expect(eventsPage.verifyEvent(newEventData.new_event_title)).toBeVisible();
            seatsBeforeBooking = await eventsPage.getSeatsOnTheEvent(newEventData.new_event_title);

        })

        test(`Verify user is able to book a newly created event #tickets - ${data.event_booking_number_of_tickets}`, {
            tag: ['@UI', '@UAT'],
            annotation: {
                type: 'Test Case Link',
                description: 'https://eventhub.rahulshettyacademy.com/'
            }
        }, async ({ page, goToURL, navigationPage, eventsPage, eventBookingPage }) => {
            await navigationPage.navigateToEvents()
            await expect(page).toHaveURL(`${process.env.BASE_URL}/events`);
            await eventsPage.selectEventForBooking(newEventData.new_event_title);
            await eventBookingPage.bookEventTicket(data.event_booking_number_of_tickets, newEventData.event_booking_full_name, newEventData.event_booking_email, newEventData.event_booking_phone_number);
            await expect(eventBookingPage.bookingConfirmationText).toBeVisible();
            await expect(eventBookingPage.bookingReferenceNumber).toBeVisible();
            await expect(eventBookingPage.verifyBookingCustomerName(newEventData.event_booking_full_name)).toBeVisible();
            const totalPrice = parseInt(newEventData.new_event_price) * parseInt(data.event_booking_number_of_tickets);
            await expect(eventBookingPage.totalBookingPrice).toContainText(`${totalPrice}`);
            bookingReferenceNum = await eventBookingPage.bookingReferenceNumber.textContent();
            console.log('bookingReferenceNum is' + bookingReferenceNum);
            await navigationPage.navigateToEvents();
            await expect(eventsPage.verifyEvent(newEventData.new_event_title)).toBeVisible();
            await navigationPage.navigateToEvents();
            await expect(eventsPage.verifyEvent(newEventData.new_event_title)).toBeVisible();
            const seatsAfterBooking = await eventsPage.getSeatsOnTheEvent(newEventData.new_event_title);
            console.log('seatsAfterBooking is' + parseInt(seatsAfterBooking));
            console.log('seatsBeforeBooking is' + parseInt(seatsBeforeBooking));
            console.log((parseInt(seatsAfterBooking) === (parseInt(seatsBeforeBooking) - parseInt(data.event_booking_number_of_tickets))));
            expect(parseInt(seatsAfterBooking) === (parseInt(seatsBeforeBooking) - parseInt(data.event_booking_number_of_tickets))).toBeTruthy();


        })

        test(`Verify that the user is able to verify booking details under my bookings with #tickets - ${data.event_booking_number_of_tickets}`, {
            tag: ['@UI', '@UAT'],
            annotation: {
                type: 'Test Case Link',
                description: 'https://eventhub.rahulshettyacademy.com/'
            }
        }, async ({ goToURL, eventBookingPage, navigationPage, myBookingsPage }) => {
            await navigationPage.navigateToMyBookings();
            console.log('bookingReferenceNum is' + bookingReferenceNum!);
            console.log('count is' + await myBookingsPage.bookingCards.count());
            await expect(myBookingsPage.bookingCards.first().or(myBookingsPage.noBookingsYetMsg)).toBeVisible();

            console.log('count is' + await myBookingsPage.bookingCards.count());

            if (await myBookingsPage.bookingCards.count() > 0) {
                await expect(myBookingsPage.verifyBookingCard(bookingReferenceNum!)).toBeVisible();
            }
            else {
                await expect(myBookingsPage.noBookingsYetMsg).toBeVisible();
                return;
            }
            await expect(myBookingsPage.verifyBookingTitle(bookingReferenceNum!, newEventData.new_event_title)).toBeVisible();


        })

        test(`Verify that user is able to verify the booking details in view details section with #tickets - ${data.event_booking_number_of_tickets}`, {
            tag: ['@UI', '@UAT'],
            annotation: {
                type: 'Test Case Link',
                description: 'https://eventhub.rahulshettyacademy.com/'
            }
        }, async ({ goToURL, eventBookingPage, navigationPage, myBookingsPage }) => {
            await navigationPage.navigateToMyBookings();
            await myBookingsPage.viewBookingDetails(bookingReferenceNum!);
            await expect(myBookingsPage.bookingTitleOnViewBookings).toHaveText(newEventData.new_event_title);
        })

        test(`Verify that user is able to verify the refund eligibility under booking details in view details section and then cancel for #tickets - ${data.event_booking_number_of_tickets}`, {
            tag: ['@UI', '@UAT'],
            annotation: {
                type: 'Test Case Link',
                description: 'https://eventhub.rahulshettyacademy.com/'
            }
        }, async ({ page, goToURL, eventBookingPage, navigationPage, myBookingsPage }) => {

            await navigationPage.navigateToMyBookings();
            await expect(page).toHaveURL(`${process.env.BASE_URL}/bookings`)
            await myBookingsPage.viewBookingDetails(bookingReferenceNum!);
            await myBookingsPage.clickOnCheckEligibilityForRefund();
            if (parseInt(data.event_booking_number_of_tickets) > 1) {
                await expect(myBookingsPage.refundResultMsg).toContainText(` Group bookings (${data.event_booking_number_of_tickets} tickets) are non-refundable.`)
                await expect(myBookingsPage.refundyEligibilityMsg).toHaveText(newEventData.event_booking_refund_not_eligible_msg);
            }
            else {
                await expect(myBookingsPage.refundResultMsg).toContainText(' Single-ticket bookings qualify for a full refund.')
                await expect(myBookingsPage.refundyEligibilityMsg).toHaveText(newEventData.event_booking_refund_eligible_msg);
            }
            await navigationPage.navigateToMyBookings();
            await myBookingsPage.cancelBooking(bookingReferenceNum);
            // await expect(myBookingsPage.cancelBookingModalText).not.toBeVisible();        
            // brittle and weak doesnt retry bothawait expect(myBookingsPage.cancelBookingDialog).not.toBeVisible()
            await myBookingsPage.cancelBookingModalText.waitFor({ state: 'hidden', timeout: 8000 });
            if (await myBookingsPage.bookingCards.count() > 0) {
                console.log('inside >0');
                await expect(myBookingsPage.verifyBookingCard(bookingReferenceNum!)).toHaveCount(0);
            }
            else {
                console.log('inside = 0');
                await expect(myBookingsPage.noBookingsYetMsg).toBeVisible();

            }
        })

        
    test(`Verify user is able to delete a newly created event with tickets# ${data.event_booking_number_of_tickets}`, {
        tag: ['@UI', '@UAT'],
        annotation: {
            type: 'Test Case Link',
            description: 'https://eventhub.rahulshettyacademy.com/'
        }
    }, async ({ page, goToURL, navigationPage, eventsPage, eventBookingPage, newEventPage }) => {
        
        
        await navigationPage.navigateToManageEvents()
        await expect(page).toHaveURL(`${process.env.BASE_URL}/admin/events`);
        await newEventPage.deleteEvent(newEventData.new_event_title);
        await expect(newEventPage.verifyEventIsDeleted(newEventData.new_event_title)).toHaveCount(0);
    })




    })

}
