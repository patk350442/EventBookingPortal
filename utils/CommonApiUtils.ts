import { APIRequestContext } from '@playwright/test'
import apiPathData from '../testdata/api-data/api-path-data.json';
import CommonUtils from '../utils/CommonUtils';
import { faker } from '@faker-js/faker';
import { getBookingsPOSTAPIRequestBody } from '../utils/APIHelper'
import bookingAPIData from '../testdata/api-data/booking-api-module.json'

export class CommonApiUtils {

    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createToken() {
        const commonUtils = new CommonUtils();
        const userName = commonUtils.decryptData(process.env.USER_NAME!);
        const password = commonUtils.decryptData(process.env.PASSWORD!);
        const postAuthAPIResponse = await this.request.post(`${process.env.API_BASE_URL}${apiPathData.auth_path}`, {
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
        if (!postAuthAPIResponse.ok()) {
            throw new Error(`Login failed (${postAuthAPIResponse.status()}): ${JSON.stringify(postAuthAPIResponseJson)}`);
        }
        return postAuthAPIResponseJson.token;
    }

    async createBooking() {
        const eventId = bookingAPIData.booking_post_api_event_id;
        const customerName = faker.person.fullName();
        const customerEmail = faker.internet.email();
        const customerPhone = (faker.number.int({ min: 1000000000, max: 9999999999 })).toString();
        const quantity = faker.number.int({ min: 1, max: 9 });
        const getPOSTAPIRequestBody = getBookingsPOSTAPIRequestBody(customerName, customerEmail, customerPhone, quantity, eventId)

        const token =await this.createToken();
        const postAPIResponse=await this.request.post(`${process.env.API_BASE_URL}${apiPathData.booking_path}`, {
            headers: {
                "content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data:getPOSTAPIRequestBody
        })
        const postAPIResponseJson=await postAPIResponse.json()
        console.log('Created booking successfully and response is ');
        console.log(postAPIResponseJson);
        return postAPIResponseJson;
    }

    async deleteBooking(bid:string)
    {
        
     const token =await this.createToken();
    const deleteBookingAPIResponse= await this.request.delete(`${process.env.API_BASE_URL}${apiPathData.booking_path}/${bid}`,{
    headers:{
        "Content-Type":"application/json",
        "Accept":"application/json",
        "Authorization":`Bearer ${token}`
    }
    })
     const deleteBookingAPIResponseJson= await deleteBookingAPIResponse.json();

        return deleteBookingAPIResponseJson
    }

    async createBookingWithEventId(eventId:number) {
        
        const customerName = faker.person.fullName();
        const customerEmail = faker.internet.email();
        const customerPhone = (faker.number.int({ min: 1000000000, max: 9999999999 })).toString();
        const quantity = faker.number.int({ min: 1, max: 9 });
        const getPOSTAPIRequestBody = getBookingsPOSTAPIRequestBody(customerName, customerEmail, customerPhone, quantity, eventId)

        const token =await this.createToken();
        const postAPIResponse=await this.request.post(`${process.env.API_BASE_URL}${apiPathData.booking_path}`, {
            headers: {
                "content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data:getPOSTAPIRequestBody
        })
        const postAPIResponseJson=await postAPIResponse.json()
        console.log('Created booking successfully and response is ');
        console.log(postAPIResponseJson);
        return postAPIResponseJson;
    }



}