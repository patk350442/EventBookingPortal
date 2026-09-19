import {expect} from '@playwright/test';
import {test} from '../../fixtures/hooks-fixture';
import process from 'node:process';


test('Global Setup for Auto login', async({page,loginPage,navigationPage,commonUtils})=>{

    const userName=commonUtils.decryptData(process.env.USER_NAME);
    const password=commonUtils.decryptData(process.env.PASSWORD);
    await loginPage.navigateToEventsHubPortal();
    await loginPage.loginToEventsHubPortal(userName,password);
    await expect(navigationPage.eventHubLink).toBeVisible();
    await expect(navigationPage.homeLink).toBeVisible();
    await page.context().storageState({path:'./playwright/.auth/state.json'})
    
}) 