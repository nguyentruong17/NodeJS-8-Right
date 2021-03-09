import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { SuggestModule } from './suggest/suggest.module';

@Module({
  imports: [
    HttpModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.b4.env']
    }), 
    SearchModule, SuggestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
