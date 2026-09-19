import {test as base} from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';
import { NavigationPage } from '../pageobjects/NavigationPage';
import {NewEventPage} from '../pageobjects/NewEventPage'
import { EventsPage } from '../pageobjects/EventsPage';
import { EventBookingPage } from '../pageobjects/EventBookingPage';
import { MyBookingsPage } from '../pageobjects/MyBookingsPage';

interface PomFixture{

    loginPage:LoginPage;
    navigationPage:NavigationPage;
    newEventPage: NewEventPage;
    eventsPage: EventsPage;
    eventBookingPage:EventBookingPage;
    myBookingsPage: MyBookingsPage;
}

export const test=base.extend<PomFixture>({
    loginPage: async ({page},use)=>{
        await use(new LoginPage(page));
    },

    navigationPage: async ({page},use)=>{
            await use(new NavigationPage(page));
    },
    
    newEventPage: async({page},use)=>{
        await use(new NewEventPage(page));
    },

    eventsPage: async ({page},use)=>{
        await use(new EventsPage(page));
    },
    eventBookingPage: async({page},use)=>{
        await use(new EventBookingPage(page));
    },

    myBookingsPage:async({page},use)=>{
        await use(new MyBookingsPage(page));
    }

})