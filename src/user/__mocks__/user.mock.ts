
import { UserType } from '../enum/user-type.enum';
import { UserEntity } from '../interfaces/user.entity';

export const userEntityMock: UserEntity = {
  cpf: '123543543',
  createdAt: new Date(),
  email: 'emailmock@emali.com',
  id: 43242,
  name: 'nameMock',
  password: 'largePassword',
  phone: '321532523532',
  typeUser: UserType.User,
  updatedAt: new Date(),
};