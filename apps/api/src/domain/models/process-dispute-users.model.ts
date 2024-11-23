export type ProcessDisputeUsersModel = {
  id: string;
  userId: string;
  processDisputeId: string;
  createdAt?: Date;
  updatedAt?: Date;

  user?: unknown;
  processDispute?: unknown;
};
