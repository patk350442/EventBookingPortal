import { Locator, Page } from "@playwright/test";

export class NavigationPage{

    readonly page:Page;
    readonly logoutBtn:Locator;
    readonly eventHubLink:Locator;
    readonly homeLink:Locator;
    readonly adminBtn:Locator;
    readonly manageEventsLink:Locator;
    readonly eventsLink:Locator;
    readonly myBookingsLink:Locator;

    constructor(page:Page)
    {
        this.page=page;
        this.logoutBtn=page.getByRole('button',{name:'Logout'})
        this.eventHubLink=page.getByRole('link',{name:'EventHub'});
        this.homeLink =page.getByTestId('nav-home');
        this.adminBtn=page.getByRole('button',{name:'Admin'});
         //this.manageEventsLink=page.getByRole('link',{name:'Manage Events'}).first();
        this.manageEventsLink=page.getByRole('navigation').getByRole('link',{name:'Manage Events'});
        this.eventsLink=page.getByRole('link',{name:'Events'}).first();
        this.myBookingsLink=page.getByRole('link',{name:'My Bookings'}).first();
    }

    async logout()
    {
        await this.logoutBtn.click();
    }

    async navigateToManageEvents(){
        await this.adminBtn.click();
        await this.manageEventsLink.click();
    }

    async navigateToEvents()
    {
        await this.eventsLink.click();
    }

     async navigateToMyBookings()
    {
        await this.myBookingsLink.click();
    }

    async navigateToSpecificBooking(bookingId: number)
    {
        
        await this.page.goto(`/bookings/${bookingId}`)
    }

}