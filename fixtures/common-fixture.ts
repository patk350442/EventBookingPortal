import {test as base} from '../fixtures/pom-fixture';
import { CommonApiUtils } from '../utils/CommonApiUtils';
import CommonUtils from '../utils/CommonUtils';
interface CommonFixtue{

    commonUtils:CommonUtils;
    commonApiUtils:CommonApiUtils
    token:string
}
export const test=base.extend<CommonFixtue>({
    commonUtils: async({},use)=>{
        await use(new CommonUtils());
    },
    commonApiUtils: async ({request},use)=>{
        await use(new CommonApiUtils(request)); 
    },
    token: async ({request},use)=>{
        const commonApitUils=new CommonApiUtils(request)
        const bearerToken = await commonApitUils.createToken();
        await use(bearerToken);
    }
})
