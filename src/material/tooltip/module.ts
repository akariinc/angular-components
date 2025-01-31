/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatTooltip,
  TooltipComponent,
} from './tooltip';

import {A11yModule} from '@angular/cdk/a11y';
import {CdkScrollableModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {MatCommonModule} from '@angular/material/core';
import {NgModule} from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay';
import {TooltipSanitizer} from './tooltip-sanitizer';

@NgModule({
  imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule, MatTooltip, TooltipComponent],
  exports: [MatTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule],
  providers: [
    MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
    {provide: DomSanitizer, useClass: TooltipSanitizer},
  ],
})
export class MatTooltipModule {}
