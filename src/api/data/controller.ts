import { Request, Response, NextFunction } from 'express';

import HttpError from '../../lib/http-error';

import DataModel from './model';

// ==============================================

type DateRangeTuple = [number, number];

// ==============================================

// [POST] /api/data/distinct-product-ids-in-date-range
const getDistinctProductsSoldInDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Request:
  //  -Headers:
  //    --Authorization: JWT
  //  -Body:
  //    -date_range: DateRangeTuple
  //      --Contains date range [date_lo, date_hi]
  //
  // Model:
  //  -getDistinctProductsSoldInDateRange()
  //
  // Response:
  //  -distinct_product_ids
  //    --number[]

  const date_range: DateRangeTuple = req.body.date_range;

  console.log('req.body: ', req.body);
  console.log('(controller) date_range: ', date_range);

  const arrOfObjs2Arr = (rows: { product_id: number }[]): number[] =>
    rows.map((row) => row.product_id);

  try {
    // Get the unique product-id's in the date-range
    const distinct_product_ids: number[] = arrOfObjs2Arr(
      await DataModel.getDistinctProductsSoldInDateRange(date_range)
    );
    // console.log(
    //   'distinct product ids sold in date-range: ',
    //   distinct_product_ids
    // );

    res.status(200).json(distinct_product_ids);
  } catch (err: any) {
    next(new HttpError(err.message || '[GET] /api/data', err.status || 400));
  }
};

// ==============================================

// [POST] /api/data/units-sold-of-specific-product-in-date-range/:product_id
const getUnitsSoldPerDayForOneProductInDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Request:
  //  -URL-Params:
  //    --:product_id
  //      ---product-id to lookup
  //  -Headers:
  //    --Authorization: JWT
  //  -Body:
  //    --date_range: DateRangeTuple
  //      ---Contains date range [date_lo, date_hi]
  //
  // Model:
  //  -getDistinctProductsSoldInDateRange()
  //
  // Response:
  //  -

  const product_id: string = req.params.product_id;

  console.log(
    '(controller) [POST] /api/data/units-sold-of-specific-product-in-date-range/:product_id',
    '\nproduct_id: ',
    product_id
  );

  const date_range: DateRangeTuple = req.body.date_range;

  console.log('req.body: ', req.body);
  console.log('(controller) date_range: ', date_range);

  try {
    // -Step 2: Get the number of units of the first product-id sold in the date range
    const units_sold_per_day_for_one_product_in_date_range: {
      date_index: number;
      product_id: number;
      units_sold: number;
    }[] = await DataModel.getUnitsSoldPerDayForOneProductInDateRange(
      date_range,
      product_id
    );

    if (units_sold_per_day_for_one_product_in_date_range.length > 0) {
      console.log(
        '(controller) [POST] /api/data/units-sold-of-specific-product-in-date-range/:product_id -- rows: ',
        units_sold_per_day_for_one_product_in_date_range
      );

      res.status(200).json(units_sold_per_day_for_one_product_in_date_range);
    } else {
      next(new HttpError('No products sold in date range', 400));
    }
  } catch (err: any) {
    next(new HttpError(err.message || '[GET] /api/data', err.status || 400));
  }
};

// ==============================================

export default {
  getDistinctProductsSoldInDateRange,
  getUnitsSoldPerDayForOneProductInDateRange,
};
