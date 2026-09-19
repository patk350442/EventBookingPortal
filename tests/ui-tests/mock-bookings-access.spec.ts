
import apiPathData from '../../testdata/api-data/api-path-data.json';
import CommonUtils from '../../utils/CommonUtils';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { getBookingsPOSTAPIRequestBody } from '../../utils/APIHelper'
import bookingAPIData from '../../testdata/api-data/booking-api-module.json'
import {test} from '../../fixtures/hooks-fixture';
import { MyBookingsPage } from '../../pageobjects/MyBookingsPage';

test('[Security testing] Cross user testing of bookings access',{
    tag:['@UI', '@MOCK'],
    annotation:{
        type:'',
        description:''
       }
    }, async ({page,goToURL,commonApiUtils,commonUtils, navigationPage,request,myBookingsPage})=>{

       
       
        
        const userName = commonUtils.decryptData(process.env.MOCK_USER_NAME!);
        const password = commonUtils.decryptData(process.env.MOCK_PASSWORD!);
        const postAuthAPIResponse = await request.post(`${process.env.API_BASE_URL}${apiPathData.auth_path}`, {
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
            data: {
                "email": userName,
                "password": password
            }
        })
        const postAuthAPIResponseJson = await postAuthAPIResponse.json();
        expect(postAuthAPIResponse.ok()).toBe(true);
        expect(postAuthAPIResponse.status()).toBe(200);
      
        const eventId = bookingAPIData.booking_post_api_event_id;
        const customerName = faker.person.fullName();
        const customerEmail = faker.internet.email();
        const customerPhone = (faker.number.int({ min: 1000000000, max: 9999999999 })).toString();
        const quantity = faker.number.int({ min: 1, max: 9 });
        const getPOSTAPIRequestBody = getBookingsPOSTAPIRequestBody(customerName, customerEmail, customerPhone, quantity, eventId)

        const token =postAuthAPIResponseJson.token;
        const postAPIResponse=await request.post(`${process.env.API_BASE_URL}${apiPathData.booking_path}`, {
            headers: {
                "content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data:getPOSTAPIRequestBody
        })
        expect(postAPIResponse.ok()).toBe(true);
        expect(postAPIResponse.status()).toBe(201);
      
        const postAPIResponseJson=await postAPIResponse.json()
        const bookingId=postAPIResponseJson.data.id;
        console.log('postAPIResponseJson is');
        console.log(postAPIResponseJson);

         //api mocking  optional
//         await page.route('**/api/bookings/**', async route=>{
/*            const requestUrl=route.request().url()
            const newUrl=requestUrl.replace(/bookings\/[^/]+/, `bookings/${bookingId}`)
            await route.continue({
                url: newUrl
            })
        });
  */



        await navigationPage.navigateToSpecificBooking(bookingId);
        await expect(myBookingsPage.getAccessDeniedMsg()).toBeVisible();
        await expect(myBookingsPage.getNotAuthorizedMsg()).toBeVisible();
        
})
