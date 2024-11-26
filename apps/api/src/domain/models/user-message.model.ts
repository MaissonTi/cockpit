export type UserMessageModel = {
  id: string;
  userId: string;
  destinateId: string;
  isGroup?: boolean;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
};
