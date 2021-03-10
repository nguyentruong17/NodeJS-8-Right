import { IDocumentGetResult } from './document-get.interface';
import { IBook } from './book.interface';

export interface IBookGetResult extends IDocumentGetResult {
  _source: IBook
}
