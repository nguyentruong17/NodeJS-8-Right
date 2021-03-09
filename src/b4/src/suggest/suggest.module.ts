import { HttpModule, Module } from '@nestjs/common';
import { SuggestController } from './suggest.controller';
import { SuggestService } from './suggest.service';

@Module({
  imports: [HttpModule],
  controllers: [SuggestController],
  providers: [SuggestService]
})
export class SuggestModule {}
