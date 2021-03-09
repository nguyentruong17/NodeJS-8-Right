import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';

import { IBook } from '../types/book.interface';
import { SearchService } from './search.service';

@Controller('/api/search')
export class SearchController {
  constructor(private _searchService: SearchService) {}

  /**
   * Search for books by matching a particular field value.
   * Example: /api/search/books/authors/Twain
   */

  @Get('books/:field/:query')
  searchBooks(
    @Param('field') field: string,
    @Param('query') query: string,
  ): Observable<IBook[]> {
    return this._searchService.searchBooks(field, query);
  }
}
