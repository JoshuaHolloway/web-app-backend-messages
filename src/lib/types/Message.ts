interface Message {
  id?: number; // pk

  user_id_to: number; // fk
  user_id_from: number; // fk

  message: string;

  date_index: number; // for filtering on date-range
  date_time: string; // for debugging
  date_time_index: number; // for sorting

  starred_to: boolean;
  starred_from: boolean;

  category_to: number | null;
  category_from: number | null;

  trash_to: boolean;
  trash_from: boolean;

  draft_from: boolean;

  read_to: boolean;
  read_from: boolean;
}

// -Used to display messages in messages-table:
interface MessageUser extends Message {
  first_name: string;
  last_name: string;
  username: string;
}

export type { Message, MessageUser };
