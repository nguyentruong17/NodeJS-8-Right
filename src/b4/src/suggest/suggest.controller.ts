import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ITextSuggestOption } from 'src/types/text-suggest.interface';

import { SuggestService } from './suggest.service';

@Controller('/api/suggest')
export class SuggestController {
  constructor(private _suggestService: SuggestService) {}

  /**
   * Collect suggested terms for a given field based on a given query.
   * Example: /api/suggest/authors/lipman
   */
  @Get(':field/:query')
  searchBooks(
    @Param('field') field: string,
    @Param('query') query: string,
  ): Observable<ITextSuggestOption[]> {
    return this._suggestService.suggestText(field, query);
  }
}
