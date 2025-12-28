// pipeline/filters/filter3-validate-metadata.ts
import { Injectable } from '@nestjs/common';
import { PipeFilter } from '../pipeline-service';
import { NormalizedMetadata } from 'src/types';

@Injectable()
export class ValidateMetadataFilter implements PipeFilter {
  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(items: NormalizedMetadata[]) {
    return items.filter(
      (c) =>
        c.crypto.symbol &&
        c.crypto.name &&
        c.raw.current_price !== null &&
        c.raw.last_updated,
    );
  }
}
