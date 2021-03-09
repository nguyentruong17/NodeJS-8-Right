import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of, throwError } from 'rxjs';

import { IBook } from '../types/book.interface';
import { IBookSearchResult } from '../types/book-search.interface';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class SearchService {
  private DB_PORT;
  private DB_URL;

  constructor(
      private readonly _configService: ConfigService,
      private readonly _httpService: HttpService) {
    this.DB_PORT = this._configService.get('EL_PORT');
    this.DB_URL = `http://elasticsearch:${this.DB_PORT}/`;
  }
  searchBooks(field: string, query: string): Observable<IBook[]> {
    const index_to_use = this._configService.get('BOOKS_INDEX');
    const url = this.DB_URL + `${index_to_use}/_search/`;
    const esReqBody = {
      size: 10, //max return size of 10 books
      query: {
        match: {
          [field]: query,
        },
      },
    };
    const options = { url, json: true, body: esReqBody }
    return this._httpService.get(url, options).pipe(
        switchMap((res) => of (res["data"] as IBookSearchResult)),
        map(bookSearchResult => {
            const books = bookSearchResult.hits.hits.map(el => el._source)
            return books
        }),
        catchError((err) => {
          console.log('Error: ', err);
          //throw new HttpException()bookSearchResult
          return throwError(err);
        }),
      );
  }
}
