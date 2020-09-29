import IMailProvider from "../model/IMailProvider";
import ISendMailDTO from "../dtos/ISendMailDTO";


class FakeMailProvider implements IMailProvider {
    private mails: ISendMailDTO[] = [];

    public async sendMail(message: ISendMailDTO): Promise<void>{

        this.mails.push(message);

    }
}

export default FakeMailProvider;