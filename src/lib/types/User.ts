interface User {
  user_id?: number; // (PK)
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  date_index: number;
  time_index: number;
}

export type { User };
