import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { SuggestModule } from './suggest/suggest.module';
import { BundleModule } from './bundle/bundle.module';

@Module({
  imports: [
    HttpModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.b4.env']
    }), 
    SearchModule, SuggestModule, BundleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
