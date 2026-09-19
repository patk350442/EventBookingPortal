import { test } from '../../fixtures/hooks-fixture';
import apiPathData from '../../testdata/api-data/api-path-data.json';
import { faker } from '@faker-js/faker';
import { getEventsPOSTAPIRequestBody } from '../../utils/APIHelper'
import { expect } from '@playwright/test';
import AJV from 'ajv';
import schema from '../../testdata/schemas/booking-post-api.schema.json'
import { validateSchema } from '../../utils/SchemaValidator';
import eventsPOSTAPISchema from '../../testdata/schemas/events-post-api.schema.json'

test('Creating a event using POST API', {
    tag: ['@API', '@UAT'],
    annotation: {
        type: 'Test Case Link',
        description: 'https://eventhub.rahulshettyacademy.com/'

    }
}, async ({ commonApiUtils, request }) => {

    const title = `${faker.company.name()} Tech Summit`;
    const description = faker.lorem.paragraph();
    const category = 'Conference';
    const city = faker.location.city();
    const venue = `${city} Convention Center`;
    const eventDate = faker.date.soon({ days: 90 }).toISOString();
    const price = faker.number.int({ min: 10, max: 50 });
    const totalSeats = faker.number.int({ min: 100, max: 500 });
    const imageUrl = faker.image.url().toString();

    const getEventsPOSTAPIReqBody = getEventsPOSTAPIRequestBody(title, description, category, venue, city, eventDate, price, totalSeats, imageUrl)

    const token = await commonApiUtils.createToken();

    const eventsPOSTAPIResponse = await request.post(`${apiPathData.events_path}`, {
        headers: {
            "content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: getEventsPOSTAPIReqBody

    })
    const eventsPOSTAPIResponseJson = await eventsPOSTAPIResponse.json()


    console.log('status ' + eventsPOSTAPIResponse.status());
    console.log('status text is ' + eventsPOSTAPIResponse.statusText());
    console.log(eventsPOSTAPIResponseJson);

    expect(eventsPOSTAPIResponse.status()).toBe(201);
    expect(eventsPOSTAPIResponse.statusText()).toBe('Created');
    expect(eventsPOSTAPIResponseJson.data).not.toBeNull();
    expect(eventsPOSTAPIResponseJson.data.id).toBeGreaterThan(0);
    expect(eventsPOSTAPIResponseJson.data.title).not.toBeNull();
    expect(eventsPOSTAPIResponseJson.data.totalSeats).toBe(totalSeats);
    expect(eventsPOSTAPIResponseJson.data.availableSeats).toBe(totalSeats);
    expect(eventsPOSTAPIResponseJson.data).toHaveProperty('venue');
    expect(eventsPOSTAPIResponseJson.data).toHaveProperty('city');
    expect(eventsPOSTAPIResponseJson.message).toBe('Event created successfully');
    expect(eventsPOSTAPIResponseJson.success).toBe(true);
    expect(eventsPOSTAPIResponseJson.data).toHaveProperty('createdAt');

    const ajv = new AJV()
    const validate = ajv.compile(eventsPOSTAPISchema);
    const isValid = validate(eventsPOSTAPIResponseJson)
    expect(isValid).toBe(true);
    const { valid, errorText } = validateSchema(eventsPOSTAPISchema, eventsPOSTAPIResponseJson)
    expect(valid, errorText).toBeTruthy();


})