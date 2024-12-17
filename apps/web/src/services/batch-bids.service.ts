import { api, Options } from '@/lib/http-service';

type CreateBatchBids = {
  batchId: string;
  value: number;
};

class BatchBidsService {
  static async create(
    { batchId, value }: CreateBatchBids,
    option?: Options,
  ): Promise<void> {
    await api.post(`batch-bids`, {
      ...option,
      json: { batchId, value },
    });
  }

  static async applyDecline(option?: Options): Promise<void> {
    await api.put(`batch-bids`, { ...option, json: { isDecline: true } });
  }
}

export default BatchBidsService;
