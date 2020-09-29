import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import IFindProvidersDTO from '@modules/users/dtos/IFindProvidersDTO';

class UserRepository implements IUserRepository {
    private users: User[] = [];

    public async findAllProviders({ except_user_id }: IFindProvidersDTO): Promise<User[]> {
        let { users } = this;

        if (except_user_id) {
            users = this.users.filter(user => user.id !== except_user_id);

        }
        return users;
    }


    public async findById(id: string): Promise<User | undefined> {
        const user = await this.users.find(find => find.id === id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.users.find(find => find.email === email);

        return user;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid() }, userData);

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(find => find.id === user.id);

        this.users[findIndex] = user;

        return user;
    }
}

export default UserRepository;