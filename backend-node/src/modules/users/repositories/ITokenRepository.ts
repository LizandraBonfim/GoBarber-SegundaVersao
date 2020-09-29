import UserToken from "../infra/typeorm/entities/UserToken";

export default interface ITokenRepository {
    generate(id: string): Promise<UserToken>;
    findByToken(token: string): Promise<UserToken | undefined>;
   
}