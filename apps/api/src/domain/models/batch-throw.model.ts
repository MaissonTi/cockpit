export type BatchThrowModel = {
  id: string;
  name: string;
  status: string;
  batchId: string;
  userId?: string;
  value?: number;
  createdAt?: Date;
  updatedAt?: Date;
  batch?: unknown;
};
