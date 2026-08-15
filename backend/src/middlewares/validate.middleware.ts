import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

// Struktur konfigurasi skema validasi untuk request Express
interface RequestValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

// Middleware validasi skema data permintaan HTTP (body, query, params) menggunakan Zod
export const validate = (schemas: RequestValidationSchemas) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
