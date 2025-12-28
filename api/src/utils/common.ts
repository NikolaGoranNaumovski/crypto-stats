import { Pagination, Search } from 'src/types/common';
import { FindOptionsWhere, ILike } from 'typeorm';

export const getSearch = (search?: Search | null) => {
  if (!search || !search.value) return [];

  const findWhereOpts: FindOptionsWhere<any>[] = [];

  const tokens = search.value.split(/\s+/);

  for (const token of tokens) {
    let key: string | undefined;
    let rawValue: string;

    if (token.includes(':')) {
      [key, rawValue] = token.split(':', 2);
    } else {
      rawValue = token;
    }

    const isUUID = /^[0-9a-fA-F-]{36}$/i.test(rawValue);
    const operator = isUUID ? rawValue : ILike(`%${rawValue}%`);

    if (key) {
      if (key.includes('.')) {
        findWhereOpts.push(setPropertyByPath({}, key, operator));
      } else {
        findWhereOpts.push({ [key]: operator });
      }
      continue;
    }

    for (const prop of search.properties) {
      if (prop.includes('.')) {
        findWhereOpts.push(setPropertyByPath({}, prop, operator));
      } else {
        findWhereOpts.push({ [prop]: operator });
      }
    }
  }

  return findWhereOpts;
};

export const getPagination = (pagination?: Pagination | null) =>
  pagination
    ? {
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.size,
      }
    : {};

const setPropertyByPath = (obj: object, path: string, value: any): object => {
  const [head, ...rest] = path.split('.');

  return {
    ...obj,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    [head]: rest.length
      ? setPropertyByPath(obj[head as keyof object], rest.join('.'), value)
      : value,
  };
};

export function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}
