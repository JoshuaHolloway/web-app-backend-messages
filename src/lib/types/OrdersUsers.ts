// -Joins Orders and Users tables
// -Return type for endpoing: [GET] /api/orders

interface OrdersUsers {
  uuid: string;
  uuid_short: string;
  order_id: number;
  user_id: number;
  status: number;
  date_time: string;
  date_index: number;
  time_index: number;
  total: number;
  username: string;
  first_name: string;
  last_name: string;
}

export type { OrdersUsers };
