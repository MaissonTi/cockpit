import { BatchModel } from './batch.model';

export type ProcessDisputeModel = {
  id: string;
  name: string;
  status: string;
  isOpen: boolean;
  adminId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  batch?: BatchModel[];
};
