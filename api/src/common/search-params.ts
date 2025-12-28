import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Search } from 'src/types/common';
import type { Request } from 'express';

export const SearchParams = (validParams: string[]) => {
  const paramDecorator = createParamDecorator(
    (data: string[], ctx: ExecutionContext): Search => {
      const req: Request = ctx.switchToHttp().getRequest();
      const search = req.query.searchTerm as string;
      if (!search) return null as unknown as Search;
      if (typeof search !== 'string' || !search.trim()) {
        throw new BadRequestException(
          'Invalid search parameter: must be a non-empty string',
        );
      }

      return { value: search, properties: data };
    },
  )(validParams);

  return paramDecorator;
};
