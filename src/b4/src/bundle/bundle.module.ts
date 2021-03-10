import { HttpModule, Module } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { BundleController } from './bundle.controller';

@Module({
  imports: [HttpModule],
  providers: [BundleService],
  controllers: [BundleController]
})
export class BundleModule {}
