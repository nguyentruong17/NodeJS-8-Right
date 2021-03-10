import { IBook } from './book.interface';
import { IDocumentGetResult } from './document-get.interface';

export interface IBundleGetResult extends IDocumentGetResult {
  _source: {
    name: string;
    books: Array<IBook>;
  };
}
