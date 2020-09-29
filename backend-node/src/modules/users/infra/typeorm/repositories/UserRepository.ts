import User from '@modules/users/infra/typeorm/entities/User';
import { getRepository, Repository, Not } from 'typeorm';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import IFindProvidersDTO from '@modules/users/dtos/IFindProvidersDTO';

class UserRepository implements IUserRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findAllProviders({ except_user_id }: IFindProvidersDTO): Promise<User[]> {

        let users: User[];

        if (except_user_id) {
            users = await this.ormRepository.find({
                where: {
                    id: Not(except_user_id)
                }
            });

        } else {
            users = await this.ormRepository.find();
        }

        return users;
    }


    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne(id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({
            where: { email }
        });

        return user;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(userData);

        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UserRepository;