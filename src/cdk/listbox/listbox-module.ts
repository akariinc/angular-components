/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CdkListbox, CdkOption} from './listbox';

import {CdkCustomSanitizer} from '../custom-sanitizer';
import {DomSanitizer} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

const EXPORTED_DECLARATIONS = [CdkListbox, CdkOption];

@NgModule({
  imports: [...EXPORTED_DECLARATIONS],
  exports: [...EXPORTED_DECLARATIONS],
  providers: [{provide: DomSanitizer, useClass: CdkCustomSanitizer}],
})
export class CdkListboxModule {}
