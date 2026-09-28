import {test as base} from '../fixtures/common-fixture';
import { LoginPage } from '../pageobjects/LoginPage';

interface HooksFixture
{
    goToURL:void,
    logout: void   
}

export const test=base.extend<HooksFixture>({

    goToURL: async({loginPage},use)=>{
        await loginPage.navigateToEventsHubPortal()
        await use();
    },

    logout: async ({navigationPage},use)=>{
        await use();
        await navigationPage.logout()
    }
})