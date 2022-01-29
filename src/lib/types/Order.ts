interface Order {
  id?: number;
  user_id: number;
  uuid: string;
  uuid_short: string;
  total: number;
  date_time: string; // for debugging
  date_index: number; // for filtering on date-range
  date_time_index: number;
  status: number;
}

// ==============================================

const order_status_map = ['stage-error', 'stage-1', 'stage-2', 'stage-3'];

// ==============================================

export { order_status_map };
export type { Order };
