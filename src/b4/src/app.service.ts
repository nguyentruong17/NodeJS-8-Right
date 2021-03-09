import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { IBookSearchResult } from './types/book-search.interface';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService) {}

  getHello(): Observable<string> {
    const db_port = this.configService.get('EL_PORT');
    const index_to_use = this.configService.get('BOOKS_INDEX')
    const url = `http://elasticsearch:${db_port}/${index_to_use}/_search?q=hello&_source=title`;
    return this.httpService.get(url).pipe(
      switchMap((res) => of (res["data"] as IBookSearchResult)),
      map(bookSearchResult => bookSearchResult.hits.hits[0]._source.title),
      catchError((err) => {
        console.log('Error: ', err);
        return throwError(err);
      }),
    );
  }
}
