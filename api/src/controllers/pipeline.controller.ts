// controllers/pipeline.controller.ts
import { Controller, Post } from '@nestjs/common';
import { PipelineService } from 'src/pipelines/pipeline-service';

@Controller('pipeline')
export class PipelineController {
  constructor(private pipeline: PipelineService) {}

  @Post('run')
  async runPipeline() {
    return this.pipeline.run();
  }
}
