import { RequestHandler, Request, Response, NextFunction } from 'express';

import { body, validationResult } from 'express-validator';

import ProductsModel from './model';
import HttpError from '../../lib/http-error';

// ==============================================

interface Product {
  id: number;
  title: string;
  price: number;
  units_in_stock: number;
  category: number;
}

// ==============================================

// [GET]  /api/products
const getProducts: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('[GET] /api/products');

  try {
    const products: Product[] = await ProductsModel.getAllProducts();
    res.status(200).json(products);
  } catch (err: any) {
    next(new HttpError(err.message));
  }
};

// ==============================================

// [GET]  /api/products/:id
const getProductById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('[GET] /api/products/:id');

  try {
    const id: string = req.params.id;
    const product: Product = await ProductsModel.getProductById(id);
    console.log('product: ', product);
    res.status(200).json(product);
  } catch (err: any) {
    next(new HttpError(err.message, 422));
  }
};

// ==============================================

// [POST]  /api/products/:id
const postProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('[POST] /api/products');

  const errors = validationResult(req);
  console.log('errors.array(): ', errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() }); // validation failed.
  }

  try {
    const in_product: { title: string; price: number } = req.body;
    // console.log(
    //   'in_product: ',
    //   in_product,
    //   '\ttypeof in_product.price: ',
    //   typeof in_product.price
    // );

    const out_product: Product = await ProductsModel.addProduct(in_product);
    // console.log('out_product: ', out_product);

    res.status(201).json(out_product);
  } catch (err: any) {
    next(new HttpError(err.message, 422));
  }
};

// ==============================================

// [PUT]  /api/products/:id
const putProductById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('[PUT]  /api/products/:id');

  const id: string = req.params.id;
  const product: Product = req.body;

  if (!product.title) {
    return next(new HttpError('Please provide title for the course', 400));
  }

  try {
    const returned_id: string = await ProductsModel.update(id, product);

    if (returned_id) {
      console.log('Successful modification of course in DB!');
      res.status(201).json({ id: returned_id, ...body });
    } else {
      next(
        new HttpError('The course with the specified ID does not exist', 404)
      );
    }
  } catch (err: any) {
    next(new HttpError('The course information could not be modified', 500));
  }
};

// ==============================================

// [DELETE] /api/products/:id
const deleteProductById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: string = req.params.id;
  console.log(`[DELETE]  /api/products/${id}`);

  try {
    ProductsModel.remove(id).then((deleted_product) => {
      console.log('deleted_product: ', deleted_product);

      if (!deleted_product) {
        return next(
          new HttpError('The product with the specified ID does not exist', 404)
        );
      }

      res.status(201).json(deleted_product);
    });
  } catch (err) {
    next(new HttpError('The product could not be removed', 500));
  }
};

// ==============================================

export default {
  getProducts,
  getProductById,
  postProduct,
  putProductById,
  deleteProductById,
};
