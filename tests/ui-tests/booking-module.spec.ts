import { expect } from '@playwright/test';
import { test } from '../../fixtures/hooks-fixture';
import newEventData from '../../testdata/ui-data/new-event-module.json';
import process from 'node:process';
import { MyBookingsPage } from '../../pageobjects/MyBookingsPage';

let seatsBeforeBooking: any;
let bookingReferenceNum: any;

test.describe('Verify My Bookings module ', async () => {

    test('Verify user is able to create a new event successfully', {
        tag: ['@UI', '@UAT'],
        annotation: {
            type: 'Test Case Link',
            description: 'https://eventhub.rahulshettyacademy.com/'
        }
    }, async ({ page, goToURL, navigationPage, myBookingsPage,newEventPage, eventsPage, commonApiUtils }) => {

        const bookingResponseJson = await commonApiUtils.createBooking();
        const bookingRef = bookingResponseJson.data.bookingRef;
        const bookingEventTitle = bookingResponseJson.data.event.title;
        const bookingid = bookingResponseJson.data.id;
        await navigationPage.navigateToMyBookings();
        await expect(myBookingsPage.bookingCards.first().or(myBookingsPage.noBookingsYetMsg)).toBeVisible();
        await expect(myBookingsPage.verifyBookingCard(bookingRef)).toBeVisible();
        await expect(myBookingsPage.verifyBookingTitle(bookingRef,bookingEventTitle)).toBeVisible();
        await myBookingsPage.cancelBooking(bookingRef);
        await myBookingsPage.cancelBookingModalText.waitFor({state:'hidden'});
        await expect(myBookingsPage.verifyBookingCard(bookingRef)).toHaveCount(0);
        const deleteAPIResponseJson=await commonApiUtils.deleteBooking(bookingid);
        expect(deleteAPIResponseJson.success).toBe(false);
        expect(deleteAPIResponseJson.error).toBe(`Booking with id ${bookingid} not found`);

    })

    test('Verify user is able to clear all bookings under mybookings section',{
        tag:['@UI','@UAT'],
        annotation:{
            type:'Test Case Link',
            description:'https://eventhub.rahulshettyacademy.com/bookings'
        }
    }, async({goToURL,myBookingsPage,navigationPage,commonApiUtils})=>{
        const bookingResponseJson1=await commonApiUtils.createBooking();
        const bookingResponseJson2=await commonApiUtils.createBooking();
        const booking1Ref=bookingResponseJson1.data.bookingRef;
        const booking2Ref=bookingResponseJson1.data.bookingRef;
        await navigationPage.navigateToMyBookings();
        await expect(myBookingsPage.verifyBookingCard(booking1Ref)).toBeVisible();
        await expect(myBookingsPage.verifyBookingCard(booking2Ref)).toBeVisible();
        await myBookingsPage.ClickclearAllBookings();
        await expect(myBookingsPage.noBookingsYetMsg).toBeVisible();
        const booking1Id=bookingResponseJson1.data.id;
        const booking2Id=bookingResponseJson1.data.id;
        const deleteBookingRespJson1= await commonApiUtils.deleteBooking(booking1Id);
        const deleteBookingRespJson2=await commonApiUtils.deleteBooking(booking2Id);
        expect(deleteBookingRespJson1.success).toBe(false);
        expect(deleteBookingRespJson1.error).toBe(`Booking with id ${booking1Id} not found`);
        expect(deleteBookingRespJson2.success).toBe(false);
        expect(deleteBookingRespJson2.error).toBe(`Booking with id ${booking2Id} not found`);

    
    })


})
