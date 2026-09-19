import cryptoJs from 'crypto-js';

export default class CommonUtils
{
    private secretKey:string;

    constructor()
    {
        if(process.env.SECRET_KEY)
        this.secretKey=process.env.SECRET_KEY;
        else
        {
            throw new Error('Please provide the secret key for decryption for starting the execution');
        }
    }

    public encryptData(data:string){
        const encrpytedData= cryptoJs.AES.encrypt(data, this.secretKey).toString();
        console.log(encrpytedData);
        return encrpytedData
    }

    public decryptData(data:string)
    {
        const decryptedData=cryptoJs.AES.decrypt(data,this.secretKey).toString(cryptoJs.enc.Utf8);
        return decryptedData
    }
}