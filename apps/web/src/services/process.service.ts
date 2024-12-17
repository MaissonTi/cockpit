import { api, Options } from '@/lib/http-service';
import { UserMessageResponseDTO as Message } from '@repo/domain/dtos/user-message.dto';

type UpdateProcess = {
  id?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isOpen?: boolean;
};

export interface Process {
  id: string;
  name: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isOpen: boolean;
  adminId: string | null;
  createdAt: string;
  updatedAt: string;
  batch: Batch[];
  usersMessagens: Message[];
}

export interface Batch {
  id: string;
  name: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  durationTime: number;
  winnerUserId: string | null;
  winnerValue: number;
  processDisputeId: string;
  createdAt: string;
  updatedAt: string;
}

interface ListParams {
  currentPage: number;
  perPage: number;
  filters?: unknown;
}

export interface ListReponse<T> {
  data: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

const path = 'process-dispute';

class ProcessService {
  static async update(
    { id, isOpen, status }: UpdateProcess,
    option?: Options,
  ): Promise<void> {
    await api.put(`${path}/${id}`, { ...option, json: { isOpen, status } });
  }

  static async list(
    { currentPage, perPage }: ListParams,
    option?: Options,
  ): Promise<ListReponse<Process>> {
    return await api
      .get(path, {
        ...option,
        searchParams: { currentPage, perPage },
      })
      .json<ListReponse<Process>>();
  }

  static async delete(id: string, option?: Options): Promise<void> {
    await api.delete(`${path}/${id}`, option).json<void>();
  }

  static async find(id: string, option?: Options): Promise<Process> {
    return await api.get(`${path}/${id}`, option).json<Process>();
  }
}

export default ProcessService;
