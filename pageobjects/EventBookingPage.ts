import { Locator, Page } from "@playwright/test";

export class EventBookingPage{
    
    readonly page:Page;
    readonly ticketsIncreaseBtn:Locator;
    readonly ticketBookFullName:Locator;
    readonly ticketBookEmail:Locator;
    readonly ticketBookPhoneNumber:Locator;
    readonly ticketSubmit:Locator;
    readonly bookingConfirmationText:Locator;
    readonly bookingReferenceNumber:Locator;
    readonly totalBookingPrice:Locator
   
    constructor(page:Page)
    {
        this.page=page;
        this.ticketsIncreaseBtn=page.getByRole('button',{name:'+'});
        this.ticketBookFullName=page.getByRole('textbox',{name:'Full Name'});
        this.ticketBookEmail=page.getByRole('textbox',{name:'Email'});
        this.ticketBookPhoneNumber=page.getByRole('textbox',{name:'Phone Number'});
        this.ticketSubmit=page.getByRole('button',{name:'Confirm Booking'});
        //this.bookingConfirmationText=page.locator('h3:has-text("Booking Confirmed!")');
        this.bookingConfirmationText=page.getByText('Booking Confirmed!');
        this.bookingReferenceNumber=page.locator('.booking-ref');
        this.totalBookingPrice=page.locator('.p-4.mb-5 span').last();
    }

    async bookEventTicket(numberOfTickets:string,fullName:string, email:string, phoneNumber:string )
    {
          for(let i=1;i<parseInt(numberOfTickets); i++)
        {
            await this.ticketsIncreaseBtn.click();
        }
        await this.ticketBookFullName.fill(fullName)
        await this.ticketBookEmail.fill(email);
        await this.ticketBookPhoneNumber.fill(phoneNumber);
        await this.ticketSubmit.click();
    }

    

    verifyBookingCustomerName(customerName:string)
    {
        return this.page.getByText(`${customerName}`,{exact:true});
    }

  
}