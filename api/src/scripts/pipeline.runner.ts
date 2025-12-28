import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PipelineService } from '../pipelines/pipeline-service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const pipeline = app.get(PipelineService);
  await pipeline.run();

  await app.close();
}

bootstrap();
