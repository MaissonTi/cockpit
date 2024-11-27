import { UserMessageModel } from '@repo/domain/models/user-message.model';
import { UsersMessagens as UsersMessagensPrisma } from '@prisma/client';

export class UserMessageMapper {
  //TODO: Refactor this, change any
  protected static objectModel(data: any): UserMessageModel {
    return {
      id: data.id,
      content: data.content,
      destinateId: data.destinateId,
      userId: data.userId,
      isGroup: data.isGroup,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      user: data?.user,
    };
  }

  protected static objectPrisma(data: UserMessageModel): UsersMessagensPrisma {
    return {
      id: data.id,
      content: data.content,
      destinateId: data.destinateId,
      userId: data.userId,
      isGroup: data.isGroup,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static toModel(data: UsersMessagensPrisma): UserMessageModel | null {
    return data && UserMessageMapper.objectModel(data);
  }

  static toPrisma(data: UserMessageModel): UsersMessagensPrisma | null {
    return data && UserMessageMapper.objectPrisma(data);
  }
}
