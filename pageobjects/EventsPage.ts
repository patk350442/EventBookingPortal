import { Locator, Page } from "@playwright/test";

export class EventsPage
{


    readonly page:Page;
    readonly sandboxMsg:Locator;
    readonly eventsCards:Locator;

    constructor(page:Page)
    {
        this.page=page;
         this.sandboxMsg=this.page.getByText(/sandbox/i);
         this.eventsCards=this.page.getByRole('article');
        
       
    }

    verifyEvent(eventTitle:string)
    {
       // return this.page.getByText(`${eventTitle}`);
        return this.page.locator(`h3:has-text("${eventTitle}")`);
    }
    
    async selectEventForBooking(eventTitle:string)
    {
        await this.page.locator('article').filter({hasText:`${eventTitle}`}).getByRole('link',{name:'Book Now'}).click();
        
    }

    async getSeatsOnTheEvent(eventTitle:string)
    {
       return await this.page.locator('article').filter({hasText:`${eventTitle}`}).getByText(' seats available').innerText();
    }

    getSandboxText()
    {
        return this.sandboxMsg;
    }

    getEventsCards()
    {
        return this.eventsCards;
    }

}