import { Locator, Page } from "@playwright/test";
import { text } from "node:stream/consumers";

export class NewEventPage{

    readonly page:Page;
    readonly newEventTitle:Locator;
    readonly newEventDescription:Locator;
    readonly conferenceDropdown:Locator;
    readonly newEventCity:Locator;
    readonly newEventVenue:Locator;
    readonly newEventDateTime:Locator;
    readonly newEventPrice:Locator;
    readonly newEventTotalSeats:Locator;
    readonly addNewEventSubmitBtn:Locator;
    readonly newEventSuccessMsg:Locator;
    readonly deleteDialogDeleteBtn:Locator;

    constructor(page:Page)
    {
        this.page=page;
        this.newEventTitle=page.getByRole('textbox',{name:'Title'});
        this.newEventDescription=page.getByPlaceholder('Describe the event…');
        this.conferenceDropdown=page.getByLabel('category');
        this.newEventCity=page.getByRole('textbox',{name:'City'});
        this.newEventVenue=page.getByRole('textbox',{name:'venue'});
        this.newEventDateTime=page.getByRole('textbox',{name:'Event Date & Time*'})
        this.newEventPrice=page.getByRole('spinbutton', { name: 'Price ($)*' });
        this.newEventTotalSeats=page.getByRole('spinbutton',{name:'Total Seats'});
        this.addNewEventSubmitBtn=page.getByRole('button',{name:'+ Add Event'});
        this.newEventSuccessMsg=page.getByText('Event created!');
        this.deleteDialogDeleteBtn=page.getByRole('button',{name:'Delete event'})

    }

    async createNewEvent(newEventTitle:string,newEventDescription:string,category:string,newEventCity:string,newEventVenue:string,newEventDateTime:string,newEventPrice:string,newEventTotalSeats:string)
    {
        await this.newEventTitle.fill(newEventTitle);
        await this.newEventDescription.fill(newEventDescription);
        await this.conferenceDropdown.selectOption(category)
        await this.newEventCity.fill(newEventCity);
        await this.newEventVenue.fill(newEventVenue);
        await this.newEventDateTime.pressSequentially(newEventDateTime,{timeout:200});
      
        await this.newEventPrice.fill(newEventPrice);
        await this.newEventTotalSeats.fill(newEventTotalSeats);
        await this.addNewEventSubmitBtn.click();
    }

    async deleteEvent(newEventTitle:string)
    {
        await this.page.getByRole('row').filter({hasText:`${newEventTitle}`}).getByRole('button',{name:'Delete'}).click();
        await this.deleteDialogDeleteBtn.click();
    }
    verifyEventIsDeleted(newEventTitle:string)
    {
         return this.page.getByRole('row').filter({hasText:`${newEventTitle}`});
    }

}
