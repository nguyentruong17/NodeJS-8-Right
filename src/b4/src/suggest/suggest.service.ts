import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import {
  ITextSuggestOption,
  ITextSuggestResult,
} from 'src/types/text-suggest.interface';

@Injectable()
export class SuggestService {
  private DB_PORT;
  private DB_URL;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService,
  ) {
    this.DB_PORT = this._configService.get('EL_PORT');
    this.DB_URL = `http://elasticsearch:${this.DB_PORT}/`;
  }

  suggestText(field: string, query: string): Observable<ITextSuggestOption[]> {
    const index_to_use = this._configService.get('BOOKS_INDEX');
    const url = this.DB_URL + `${index_to_use}/_search/`;

    const suggestionName = 'Suggestion';

    const esReqBody = {
      suggest: {
        text: query,
        [suggestionName]: {
          term: {
            field,
            suggest_mode: 'always',
          },
        },
      },
    };

    const options = { url, data: esReqBody };
    return this._httpService.request(options).pipe(
      switchMap((res) => of(res['data'] as ITextSuggestResult)),
      map((textSuggestResult) => {
        const textSuggestOptions =
          textSuggestResult.suggest[suggestionName][0].options;
        return textSuggestOptions;
      }),
      catchError((err) => {
        console.log('Error: ', err);
        //throw new HttpException()bookSearchResult
        return throwError(err);
      }),
    );
  }
}
