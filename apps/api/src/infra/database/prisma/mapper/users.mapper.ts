import { UserRoleEnum } from '@/domain/enum/user-roles.enum';
import { UserModel } from '@/domain/models/user.model';
import { User as UserPrisma } from '@prisma/client';

export class UserMapper {
  protected static objectModel(data: UserPrisma): UserModel {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      role: data.role as UserRoleEnum,
    };
  }

  protected static objectPrisma(data: UserModel): UserPrisma {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      role: data.role,
    };
  }

  static toModel(data: UserPrisma): UserModel | null {
    return data && UserMapper.objectModel(data);
  }

  static toPrisma(data: UserModel): UserPrisma | null {
    return data && UserMapper.objectPrisma(data);
  }
}
