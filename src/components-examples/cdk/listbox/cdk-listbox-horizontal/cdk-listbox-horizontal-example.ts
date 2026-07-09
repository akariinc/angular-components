import {CdkListbox, CdkOption} from '@angular/cdk/listbox';
import {Observable, timer} from 'rxjs';
import {map, take} from 'rxjs/operators';

import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

/** @title Horizontal listbox */
@Component({
  selector: 'cdk-listbox-horizontal-example',
  templateUrl: 'cdk-listbox-horizontal-example.html',
  styleUrl: 'cdk-listbox-horizontal-example.css',
  imports: [CdkListbox, CdkOption, CommonModule, FormsModule],
})
export class CdkListboxHorizontalExample {
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'SPECIAL'];

  sizes$: Map<string, Observable<string>> = new Map();

  constructor() {
    this.sizes.forEach(size => {
      this.sizes$.set(
        size,
        size === 'SPECIAL'
          ? timer(5000).pipe(
              take(1),
              map(() => {
                return "<i class='abc'>Custom HTML</i> <script>alert('hello')</script>Button <svg height='20' width='20' xmlns='http://www.w3.org/2000/svg'><circle r='10' cx='10' cy='10' fill='red' />Sorry, your browser does not support inline SVG.</svg>";
              }),
            )
          : timer(5000).pipe(
              take(1),
              map(() => `>${size}`),
            ),
      );
    });
  }

  private _selectedValue: any[] = [];
  get selectedValue(): any[] {
    return this._selectedValue;
  }
  set selectedValue(value: any[]) {
    console.log('vvvv', value);
    this._selectedValue = value;
  }
}
