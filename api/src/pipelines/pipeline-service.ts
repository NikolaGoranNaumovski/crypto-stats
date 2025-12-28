import { Injectable } from '@nestjs/common';

export interface PipeFilter<I = any, O = any> {
  execute(input: I): Promise<O>;
}

@Injectable()
export class PipelineService {
  constructor(private filters: PipeFilter[]) {}

  async run() {
    let data = null;

    for (const filter of this.filters) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data = await filter.execute(data);
    }

    return data;
  }
}
