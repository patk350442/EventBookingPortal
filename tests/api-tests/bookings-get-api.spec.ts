import {test} from '../../fixtures/hooks-fixture';
import apiPathData from '../../testdata/api-data/api-path-data.json';
import {faker} from '@faker-js/faker';
import {getBookingsPOSTAPIRequestBody} from '../../utils/APIHelper'
import bookingAPIData from '../../testdata/api-data/booking-api-module.json'
import { expect } from '@playwright/test';
import AJV from 'ajv';
import bookingSchemaPOST from '../../testdata/schemas/booking-post-api.schema.json'
import bookingSchemaGET from '../../testdata/schemas/booking-get-api.schema.json'
import {validateSchema} from '../../utils/SchemaValidator';

test('Get a Booking using GET API [bookings-get-api.spec.ts]',{
    tag:['@API','@UAT'],
    annotation:{
        type:'Test Case Link',
        description:'https://eventhub.rahulshettyacademy.com/'

    }
},async({commonApiUtils,request})=>{

    const eventId=bookingAPIData.booking_post_api_event_id;
    const customerName=faker.person.fullName();
    const customerEmail=faker.internet.email();
    const customerPhone=(faker.number.int({min:1000000000,max:9999999999})).toString();
    const quantity=faker.number.int({min:1,max:9});
    const getPOSTAPIRequestBody=getBookingsPOSTAPIRequestBody(customerName, customerEmail, customerPhone,quantity,eventId)

    const token=await commonApiUtils.createToken();
   
    const postBookingAPIResponse=await request.post(`${apiPathData.booking_path}`,{
        headers:{
            "content-Type" :"application/json",
            "Accept" : "application/json",
            "Authorization": `Bearer ${token}`
        },
        data:getPOSTAPIRequestBody

    })
    const postBookingAPIResponseJson=await postBookingAPIResponse.json()
    
     
    console.log('status '+postBookingAPIResponse.status());
    console.log('status text is '+postBookingAPIResponse.statusText());
    console.log('booking is '+JSON.stringify(postBookingAPIResponseJson, null, 2));
 
    expect(postBookingAPIResponse.status()).toBe(201);
    expect(postBookingAPIResponse.statusText()).toBe('Created');
    expect(postBookingAPIResponseJson.data).not.toBeNull();
    expect(postBookingAPIResponseJson.data.event.id).toBe(bookingAPIData.booking_post_api_event_id);
    expect(postBookingAPIResponseJson.data.bookingRef).not.toBeNull();
    expect(postBookingAPIResponseJson.data.event).toHaveProperty('title');
    expect(postBookingAPIResponseJson.data.event).toHaveProperty('totalSeats');
    expect(postBookingAPIResponseJson.data.event).toHaveProperty('venue');
    expect(postBookingAPIResponseJson.data.event).toHaveProperty('city');
    expect(postBookingAPIResponseJson.data).toHaveProperty('customerName');
    expect(postBookingAPIResponseJson.data).toHaveProperty('totalPrice');
    expect(postBookingAPIResponseJson.data).toHaveProperty('status');
    expect(postBookingAPIResponseJson.data.status).toBe('confirmed');
    expect(postBookingAPIResponseJson.data.quantity).toEqual(quantity);

    const ajv =new AJV()
    const validate=ajv.compile(bookingSchemaPOST);
    const isValid=validate(postBookingAPIResponseJson)
    expect(isValid).toBe(true);
  

    const bRef=postBookingAPIResponseJson.data.bookingRef;
    const bid=postBookingAPIResponseJson.data.id;


  //GET API

 
    const getBookingAPIResponse= await request.get(`${apiPathData.booking_path}/${bid}`,{
    headers:{
        "Content-Type":"applicaiton/json",
        "Accept":"application/json",
        "Authorization":`Bearer ${token}`
    }
    })
    const getBookingAPIResponseJson=await getBookingAPIResponse.json();

     
    console.log('status '+getBookingAPIResponse.status());
    console.log('status text is '+getBookingAPIResponse.statusText());
    console.log('booking is '+JSON.stringify(getBookingAPIResponseJson, null, 2));

    expect(getBookingAPIResponse.status()).toBe(200);
    expect(getBookingAPIResponse.statusText()).toBe('OK');
    expect(getBookingAPIResponseJson.data).not.toBeNull();
    expect(getBookingAPIResponseJson.data.id).toBe(bid);
    expect(getBookingAPIResponseJson.data.bookingRef).not.toBeNull();
    expect(getBookingAPIResponseJson.data.event.id).toBe(bookingAPIData.booking_post_api_event_id);
    expect(getBookingAPIResponseJson.data.bookingRef).not.toBeNull();
    expect(getBookingAPIResponseJson.data.event).toHaveProperty('title');
    expect(getBookingAPIResponseJson.data.event).toHaveProperty('totalSeats');
    expect(getBookingAPIResponseJson.data.event).toHaveProperty('city');
    expect(getBookingAPIResponseJson.data).toHaveProperty('customerName');
    expect(getBookingAPIResponseJson.data).toHaveProperty('totalPrice');
    expect(getBookingAPIResponseJson.data).toHaveProperty('status');
    expect(getBookingAPIResponseJson.data.status).toBe('confirmed');
    expect(getBookingAPIResponseJson.data.quantity).toEqual(quantity);


    const {valid,errorText}=validateSchema(bookingSchemaGET,getBookingAPIResponseJson)
    expect(valid,errorText).toBeTruthy();
})