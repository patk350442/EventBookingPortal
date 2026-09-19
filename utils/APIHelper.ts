import BookingsAPI from '../interface/bookingsAPI.interface';
import EventsAPI from '../interface/eventsAPI.interface';

export function getBookingsPOSTAPIRequestBody(customerName: string, customerEmail: string,
    customerPhone: string, quantity: number, eventId: number) {
    const bookingsAPIRequestBody: BookingsAPI = {
        "customerName": customerName,
        "customerEmail": customerEmail,
        "customerPhone": customerPhone,
        "quantity": quantity,
        "eventId": eventId
    }
    return bookingsAPIRequestBody;
}


export function getEventsPOSTAPIRequestBody(title: string, description: string, category: string, venue: string,
    city: string, eventDate: string, price: number, totalSeats: number, imageUrl: string) {

    const getEventsPOSTAPIReqBody: EventsAPI ={
        "title": title,
        "description": description,
        "category": category,
        "venue": venue,
        "city": city,
        "eventDate": eventDate,
        "price": price,
        "totalSeats": totalSeats,
        "imageUrl": imageUrl
    }
    return getEventsPOSTAPIReqBody;
}