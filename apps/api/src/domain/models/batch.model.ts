export type BatchModel = {
  id: string;
  name: string;
  status: string; // default: "PENDING"
  durationTime: number; // default: 120 (2 minutes)
  winnerUserId?: string; // mapped to "winner_user_id"
  winnerValue?: number; // default: 0.0, mapped to "winner_value"
  processDisputeId: string; // mapped to "process_disputes_id"
  createdAt?: Date;
  updatedAt?: Date;
  batchThrow?: unknown[];
};
