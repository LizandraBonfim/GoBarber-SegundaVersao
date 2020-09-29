import IParseMailTemplate from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
    name: string;
    email: string;
}

export default class ISendMailDTO {
    to: IMailContact;
    from?:IMailContact;
    subject: string;
    templateData: IParseMailTemplate; 
}