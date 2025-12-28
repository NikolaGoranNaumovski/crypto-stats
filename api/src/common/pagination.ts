import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Pagination } from 'src/types/common';
import type { Request } from 'express';

export const PaginationParams = () => {
  const paramDecorator = createParamDecorator(
    (data, ctx: ExecutionContext): Pagination => {
      const req: Request = ctx.switchToHttp().getRequest();
      const page = parseInt((req.query.page || 1) as string);
      const size = parseInt((req.query.size || 10) as string);

      // check if page and size are valid
      if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
        throw new BadRequestException('Invalid pagination params');
      }
      // do not allow to fetch large slices of the dataset
      if (size > 100) {
        throw new BadRequestException(
          'Invalid pagination params: Max size is 100',
        );
      }

      // calculate pagination parameters
      const limit = size;
      const offset = page * limit;
      return { page, limit, size, offset };
    },
  )();

  return paramDecorator;
};
