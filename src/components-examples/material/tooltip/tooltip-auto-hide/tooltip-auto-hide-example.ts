import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule, TooltipPosition} from '@angular/material/tooltip';

import {CdkScrollable} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {map} from 'rxjs/operators';
import {timer} from 'rxjs';

/**
 * @title Tooltip that demonstrates auto-hiding when it clips out of its scrolling container.
 */
@Component({
  selector: 'tooltip-auto-hide-example',
  templateUrl: 'tooltip-auto-hide-example.html',
  styleUrl: 'tooltip-auto-hide-example.css',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CdkScrollable,
    MatButtonModule,
    MatTooltipModule,
    CommonModule,
  ],
})
export class TooltipAutoHideExample {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  tooltipContent =
    "Info <i class='abc'>about</i> <script>alert('hello')</script>the action <svg height='20' width='20' xmlns='http://www.w3.org/2000/svg'><circle r='10' cx='10' cy='10' fill='red' />Sorry, your browser does not support inline SVG.</svg>";
  tooltipContent$ = timer(5000).pipe(map(() => this.tooltipContent));
}
