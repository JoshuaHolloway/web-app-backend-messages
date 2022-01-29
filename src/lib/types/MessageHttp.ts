interface MessageHttp {
  id?: number; // pk

  message_id: number;

  username: string;
  //from_username?: string;
  //to_username?: string;

  first_name: string;
  last_name: string;

  user_id_from: number;
  user_id_to: number;

  message: string;

  date_index: number; // for filtering on date-range
  date_time?: string; // for debugging
  date_time_index: number; // for sorting

  starred: boolean;
  // starred_to?: boolean;
  // starred_from?: boolean;

  category: number | null;
  // category_to?: number | null;
  // category_from?: number | null;

  trash_to?: boolean;
  trash_from?: boolean;

  draft_from?: boolean;

  read_to?: boolean;
  read_from?: boolean;
}

export type { MessageHttp };
