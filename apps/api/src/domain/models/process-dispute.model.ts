export type ProcessDisputeModel = {
  id: string;
  name: string;
  status: string;
  isOpen: boolean;
  adminId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
