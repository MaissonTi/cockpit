import { UserRoleEnum } from '../enum/user-roles.enum';

export type UserModel = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
  createdAt?: Date;
  updatedAt?: Date;
};
