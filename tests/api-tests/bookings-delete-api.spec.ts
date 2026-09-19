import {test} from '../../fixtures/hooks-fixture';
import apiPathData from '../../testdata/api-data/api-path-data.json';
import {faker} from '@faker-js/faker';
import {getBookingsPOSTAPIRequestBody} from '../../utils/APIHelper'
import bookingAPIData from '../../testdata/api-data/booking-api-module.json'
import { expect } from '@playwright/test';
import AJV from 'ajv';
import schema from '../../testdata/schemas/booking-post-api.schema.json'
import {validateSchema} from '../../utils/SchemaValidator';

test('Delete a Booking using DELETE API [bookings-delete-api.spec.ts]',{
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
    const validate=ajv.compile(schema);
    const isValid=validate(postBookingAPIResponseJson)
    expect(isValid).toBe(true);
  //  const {valid,errorText}=validateSchema(schema,postBookingAPIResponseJson)
  //  expect(valid,errorText).toBeTruthy();

    const bRef=postBookingAPIResponseJson.data.bookingRef;
    const bid=postBookingAPIResponseJson.data.id;
    const availSeats=postBookingAPIResponseJson.data.event.availableSeats;
    const bookedSeats=postBookingAPIResponseJson.data.quantity;

  //DELETE API

 
    const deleteBookingAPIResponse= await request.delete(`${apiPathData.booking_path}/${bid}`,{
    headers:{
        "Content-Type":"applicaiton/json",
        "Accept":"application/json",
        "Authorization":`Bearer ${token}`
    }
    })
    const deleteBookingAPIResponseJson=await deleteBookingAPIResponse.json();

     
    console.log('status '+deleteBookingAPIResponse.status());
    console.log('status text is '+deleteBookingAPIResponse.statusText());
    console.log('booking is '+JSON.stringify(deleteBookingAPIResponseJson, null, 2));

    expect(deleteBookingAPIResponse.status()).toBe(200);
    expect(deleteBookingAPIResponse.statusText()).toBe('OK');
    expect(deleteBookingAPIResponseJson.success).toBe(true);
    expect(deleteBookingAPIResponseJson.message).toBe('Booking cancelled');
    
    
    const deleteBookingAPIResponseReVerify= await request.delete(`${apiPathData.booking_path}/${bid}`,{
    headers:{
        "Content-Type":"applicaiton/json",
        "Accept":"application/json",
        "Authorization":`Bearer ${token}`
    }
    })
     const deleteBookingAPIResponseReVerifyJson=await deleteBookingAPIResponseReVerify.json();

    expect(deleteBookingAPIResponseReVerify.status()).toBe(404);
    expect(deleteBookingAPIResponseReVerify.statusText()).toBe('Not Found');
    expect(deleteBookingAPIResponseReVerifyJson.success).toBe(false);
    expect(deleteBookingAPIResponseReVerifyJson.error).toBe(`Booking with id ${bid} not found`);
    

})