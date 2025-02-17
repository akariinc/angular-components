import {CdkListbox, CdkOption} from '@angular/cdk/listbox';

import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {timer} from 'rxjs';

/** @title Horizontal listbox */
@Component({
  selector: 'cdk-listbox-horizontal-example',
  exportAs: 'cdkListboxhorizontalExample',
  templateUrl: 'cdk-listbox-horizontal-example.html',
  styleUrl: 'cdk-listbox-horizontal-example.css',
  standalone: true,
  imports: [CdkListbox, CdkOption, CommonModule],
})
export class CdkListboxHorizontalExample {
  sizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    "<i class='abc'>Custom HTML</i> <script>alert('hello')</script>Button <svg height='20' width='20' xmlns='http://www.w3.org/2000/svg'><circle r='10' cx='10' cy='10' fill='red' />Sorry, your browser does not support inline SVG.</svg>",
  ];

  sizes$ = this.sizes.map(size => {
    return timer(5000).pipe(map(() => size));
  });
}
