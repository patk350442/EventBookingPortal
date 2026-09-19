import { Locator, Page } from "@playwright/test";

export class LoginPage{

    readonly page:Page;
    readonly userEmail:Locator;
    readonly userPassword:Locator;
    readonly signBtn:Locator;

    constructor(page:Page)
    {
        this.page=page;
        this.userEmail=page.getByRole('textbox',{name:'Email'});
        this.userPassword=page.getByRole('textbox',{name:'Password'});
        this.signBtn=page.getByRole('button',{name:'Sign In'});

    }

    async navigateToEventsHubPortal()
    {
     
        await  this.page.goto(process.env.BASE_URL!);
    
    }

    async loginToEventsHubPortal(userName:string, password:string)
    {
        await this.userEmail.fill(userName);
        await this.userPassword.fill(password);
        await this.signBtn.click();
    }
}

