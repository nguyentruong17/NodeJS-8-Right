import {
  BadRequestException,
  ConflictException,
  HttpService,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { CreateBundleDto } from './create-bundle.dto';
import { IDocumentCreateResult } from '../types/document-create.interface';
import { IBundleGetResult } from 'src/types/bundle-get.interface';
import { IDocumentUpdateResult } from 'src/types/document-update.interface';
import { IBookGetResult } from 'src/types/book-get.interface';
import { IBook } from 'src/types/book.interface';
import { BundleBookDto } from './bundle-book.dto';

@Injectable()
export class BundleService {
  private DB_PORT;
  private DB_URL;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService,
  ) {
    this.DB_PORT = this._configService.get('EL_PORT');
    this.DB_URL = `http://elasticsearch:${this.DB_PORT}/`;
  }

  private _buildBundleUrl(bundleId?: string): string {
    const index_to_use = this._configService.get('BUNDLES_INDEX');
    const index_document = this._configService.get('BUNDLES_INDEX_DOCUMENT');
    const url =
      this.DB_URL +
      `${index_to_use}/${index_document}/${!!bundleId ? bundleId + '/' : ''}`;
    return url;
  }

  private _getBundleGetResult(bundleId): Observable<IBundleGetResult> {
    const url = this._buildBundleUrl(bundleId);
    return this._httpService.get(url).pipe(
      switchMap((res) => of(res['data'] as IBundleGetResult)),
      // tap(bundleGetResult => {
      //   if (!bundleGetResult.found) {
      //     throw new NotFoundException(`Bundle with id ${id} not found`)
      //   }
      // }), // looks like we will always receive the "_source" part since !bundleGetResult.found is an error
      catchError((err) => {
        console.log('Error: ', err);
        if (err.response.status == 404) {
          return throwError(
            new NotFoundException(`Bundle with id ${bundleId} not found`),
          );
        }
        return throwError(err);
      }),
    );
  }

  getBundle(id: string): Observable<CreateBundleDto> {
    return this._getBundleGetResult(id).pipe(
      map((bundleGetResult) => bundleGetResult._source),
    );
  }

  getBook(pgBookId: string): Observable<IBook> {
    const index_to_use = this._configService.get('BOOKS_INDEX');
    const index_document = this._configService.get('BOOKS_INDEX_DOCUMENT');
    const url = this.DB_URL + `${index_to_use}/${index_document}/${pgBookId}`;

    return this._httpService.get(url).pipe(
      switchMap((res) => of(res['data'] as IBookGetResult)),
      map((bundleGetResult) => bundleGetResult._source),
      catchError((err) => {
        console.log('Error: ', err);
        if (err.response.status == 404) {
          return throwError(
            new NotFoundException(`Book with id ${pgBookId} not found`),
          );
        }
        return throwError(err);
      }),
    );
  }

  createBundle(createdBundleDto: CreateBundleDto): Observable<string> {
    const url = this._buildBundleUrl();
    return this._httpService.post(url, createdBundleDto).pipe(
      switchMap((res) => of(res['data'] as IDocumentCreateResult)),
      map((docCreateResult) => docCreateResult._id),
      catchError((err) => {
        console.log('Error: ', err);
        return throwError(err);
      }),
    );
  }

  updateBundleName(id: string, name: string): Observable<string> {
    const url = this._buildBundleUrl(id) + '_update/';
    const esReqBody = {
      doc: {
        name,
      },
    };
    return this._httpService.post(url, esReqBody).pipe(
      switchMap((res) => of(res['data'] as IDocumentUpdateResult)),
      map((docUpdateResult) => docUpdateResult.result),
      catchError((err) => {
        console.log('Error: ', err);
        return throwError(err);
      }),
    );
  }

  addBookIntoBundle(bundleId: string, pgBookId: string): Observable<string> {
    let url = this._buildBundleUrl(bundleId) + '_update/';

    let currentBundleSeqNo = -1;
    let currentBundlePrimaryTerm = -1;

    const getBundleAndVersionings = this._getBundleGetResult(bundleId).pipe(
      tap((bundleGetResult) => {
        currentBundleSeqNo = bundleGetResult._seq_no;
        currentBundlePrimaryTerm = bundleGetResult._primary_term;
      }),
      map((bundleGetResult) => bundleGetResult._source),
    );

    return forkJoin({
      bundle: getBundleAndVersionings,
      book: this.getBook(pgBookId),
    }).pipe(
      switchMap((res) => {
        const { bundle, book } = res;
        const bookFoundInBundle = bundle.books.find((b) => b.id === book.id);
        if (bookFoundInBundle) {
          throw new BadRequestException(
            `book with id ${pgBookId} already existed within bundle ${bundleId}`,
          );
        }

        const esReqBody = {
          doc: {
            books: [
              ...bundle.books,
              {
                id: book.id,
                title: book.title,
              } as BundleBookDto, //reason for this dto is, ...elasticsearch doesnt work with nested objects!
            ],
          },
        };

        return this._httpService.post(url, esReqBody, {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          params: {
            if_seq_no: currentBundleSeqNo,
            if_primary_term: currentBundlePrimaryTerm,
          },
        });
      }),
      switchMap((res) => of(res['data'] as IDocumentUpdateResult)),
      map((docUpdateResult) => docUpdateResult.result),

      catchError((err) => {
        console.log('Error: ', err);
        if (err.response.status == 409) {
          return throwError(
            new ConflictException(
              `Conflicting Version Error. Reason: ${err.response.reason}`,
            ),
          );
        }
        return throwError(err);
      }),
    );
  }
}
