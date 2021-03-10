import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { CreateBundleDto } from './create-bundle.dto';

import { BundleService } from './bundle.service';

@Controller('api/bundle')
export class BundleController {
  constructor(private _bundleService: BundleService) {}

  /**
   * Retrieve a given bundle.
   * curl http://<host>:<port>/api/bundle/<id>
   */
  @Get(':id')
  getBundle(@Param('id') id: string): Observable<CreateBundleDto> {
    return this._bundleService.getBundle(id);
  }

  /**
   * Create a new bundle with the specified name.
   * curl -X POST http://<host>:<port>/api/bundle?name=<name>
   */
  @Post()
  @UsePipes(ValidationPipe)
  createBundle(@Body() createdBundleDto: CreateBundleDto): Observable<string> {
    return this._bundleService.createBundle(createdBundleDto);
  }

  /**
   * Set the specified bundle's name with the specified name.
   * curl -X PUT http://<host>:<port>/api/bundle/<id>/name/<name>
   */
  @Post(':id/name/:name')
  updateBundleName(
    @Param('id') id: string,
    @Param('name') name: string,
  ): Observable<string> {
    return this._bundleService.updateBundleName(id, name.trim());
  }

  /**
   * Put a book into a bundle by its id.
   * curl -X PUT http://<host>:<port>/api/bundle/<id>/book/<pgid>
   */
  @Post(':id/book/:pgBookId')
  addBookIntoBundle(
    @Param('id') bundleId: string,
    @Param('pgBookId') pgBookId: string,
  ): Observable<any> {
    return this._bundleService.addBookIntoBundle(bundleId, pgBookId);
  }
}
