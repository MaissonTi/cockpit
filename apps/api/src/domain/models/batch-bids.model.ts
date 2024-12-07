export type BatchBidsModel = {
  id?: string;
  batchId: string;
  userId: string;
  value: number;
  isDecline?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  batch?: unknown;
};
