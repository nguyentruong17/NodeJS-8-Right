import { IBook } from './book.interface';

export interface IBookSearchResult {
  hits: { //here we only cares about the 'hits' property of elastisearch api
    total: number;
    hits: Array<{
      _source: IBook;
    }>;
  };
}
