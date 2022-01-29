const joinTablesOrders = async ({
  db,
  table1,
  table2,
  cols1,
  cols2,
  date_lo,
  date_hi,
  // sort_string,
  page,
  rows_per_page,
  num_status_options,
  status,
  sort_index,
  sort_type,
  sort_map,
}: {
  db: any;
  table1: string;
  table2: string;
  cols1: string[];
  cols2: string[];
  date_lo: number;
  date_hi: number;

  page: number;
  rows_per_page: number;
  num_status_options: number;
  status: number;
  sort_index: number;
  sort_type: string;
  sort_map: string[];
}) => {
  const t1 = table1[0];
  const t2 = table2[0];

  const c1 = cols1.map((col: string) => `${t1}.${col}`);
  const c2 = cols2.map((col: string) => `${t2}.${col}`);
  const cols = [...c1, ...c2];

  let rows, row_count;

  let query: string;
  if (status === num_status_options - 1) {
    query = `
      SELECT COUNT(id) as row_count
      FROM ${table2}
      WHERE 
      ${date_lo} <= date_index 
      AND 
      date_index <= ${date_hi};`;
  } else {
    query = `
      SELECT COUNT(id) as row_count
      FROM ${table2}
      WHERE 
      ${date_lo} <= date_index 
      AND 
      date_index <= ${date_hi}
      AND status = ${status};`;
  }
  const { rows: rows1 } = await db.raw(query);

  row_count = rows1[0].row_count;
  console.log('row_count: ', row_count);

  const sort_string = sort_map[sort_index];

  rows = await db(`${table1} as ${t1}`)
    .join(`${table2} as ${t2}`, `${t1}.user_id`, `${t2}.user_id`)
    .select(cols)
    .orderBy(sort_string, sort_type) // asc / desc
    .limit(rows_per_page)
    .offset(rows_per_page * page)
    .modify((builder: any) => {
      if (status !== num_status_options - 1) {
        builder.where('status', status);
      }
    })
    .where(`${t2}.date_index`, '>=', date_lo)
    .where(`${t2}.date_index`, '<=', date_hi);

  return { rows, row_count };
};

//  =============================================

const joinTablesMessages = async ({
  db,
  table1,
  table2,
  cols1,
  cols2,
  date_lo,
  date_hi,
  // sort_string,
  page,
  rows_per_page,
  num_status_options,
  status,
  sort_index,
  sort_type,
  sort_map,
  loggged_in_user_id,
}: {
  db: any;
  table1: string;
  table2: string;
  cols1: string[];
  cols2: string[];
  date_lo: number;
  date_hi: number;

  page: number;
  rows_per_page: number;
  num_status_options: number;
  status: number;
  sort_index: number;
  sort_type: string;
  sort_map: string[];
  loggged_in_user_id: number;
}) => {
  const t1 = table1[0];
  const t2 = table2[0];

  const c1 = cols1.map((col: string) => `${t1}.${col}`);
  const c2 = cols2.map((col: string) => `${t2}.${col}`);
  const cols = [...c1, ...c2];

  let rows, row_count;

  let query: string;
  if (status === num_status_options - 1) {
    query = `
      SELECT COUNT(id) as row_count
      FROM ${table2}
      WHERE 
      ${date_lo} <= date_index 
      AND 
      date_index <= ${date_hi};`;
  } else {
    query = `
      SELECT COUNT(id) as row_count
      FROM ${table2}
      WHERE 
      ${date_lo} <= date_index 
      AND 
      date_index <= ${date_hi}
      AND status = ${status};`;
  }
  const { rows: rows1 } = await db.raw(query);

  row_count = rows1[0].row_count;
  console.log('row_count: ', row_count);

  const sort_string = sort_map[sort_index];

  if (status === 0) {
    // inbox
    rows = await db(`${table1} as ${t1}`)
      .join(`${table2} as ${t2}`, `${t1}.user_id`, `${t2}.user_id_from`)
      .select(cols)
      .orderBy(sort_string, sort_type) // asc / desc
      .limit(rows_per_page)
      .offset(rows_per_page * page)
      .where(`${t2}.date_index`, '>=', date_lo)
      .where(`${t2}.date_index`, '<=', date_hi)
      .where(`${t2}.user_id_to`, '=', loggged_in_user_id);
  } else if (status === 1) {
    // sent
    rows = await db(`${table1} as ${t1}`)
      .join(`${table2} as ${t2}`, `${t1}.user_id`, `${t2}.user_id_to`)
      .select(cols)
      .orderBy(sort_string, sort_type) // asc / desc
      .limit(rows_per_page)
      .offset(rows_per_page * page)
      .where(`${t2}.date_index`, '>=', date_lo)
      .where(`${t2}.date_index`, '<=', date_hi)
      .where(`${t2}.user_id_from`, '=', loggged_in_user_id);
  } else if (status === 2) {
    // trash => all
    rows = await db(`${table1} as ${t1}`)
      .join(`${table2} as ${t2}`, `${t1}.user_id`, `${t2}.user_id_from`)
      .select(cols)
      .orderBy(sort_string, sort_type) // asc / desc
      .limit(rows_per_page)
      .offset(rows_per_page * page)
      .where(`${t2}.date_index`, '>=', date_lo)
      .where(`${t2}.date_index`, '<=', date_hi)
      .where(`${t2}.user_id_to`, '=', loggged_in_user_id)
      .where('status', status);
  }

  return { rows, row_count };
};

//  =============================================

export { joinTablesOrders, joinTablesMessages };
