/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Injectable, SecurityContext} from '@angular/core';

/**
 * Custom sanitizer that allows &lt;svg&gt; but removes dangerous content
 * @docs-private
 */
@Injectable({providedIn: 'root'})
export class CdkListboxCustomSanitizer extends DomSanitizer {
  constructor() {
    super();
  }

  /** Main sanitization function */
  sanitize(context: SecurityContext, value: string | null): string | null {
    if (context === SecurityContext.HTML && typeof value === 'string') {
      return this._sanitizeHtml(value);
    }
    return value;
  }

  /** Function to sanitize HTML while keeping &lt;svg&gt; */
  private _sanitizeHtml(html: string): string {
    /** Remove &lt;script&gt;, &lt;iframe&gt;, &lt;object&gt;, &lt;embed&gt;, &lt;form&gt;, &lt;style&gt;, &lt;meta&gt;, &lt;link&gt;, &lt;base&gt; */
    html = html.replace(
      /<(script|iframe|object|embed|form|meta|style|link|base)[^>]*>[\s\S]*?<\/\1>/gi,
      '',
    );

    // Remove dangerous attributes (onX events, javascript: links)
    html = html.replace(/\son\w+="[^"]*"/gi, ''); // Remove event handlers (e.g., onclick)
    html = html.replace(/\son\w+='[^']*'/gi, ''); // Remove event handlers (single quotes)
    html = html.replace(/\shref=['"](javascript:)[^'"]*['"]/gi, 'href="#"'); // Prevent javascript: links
    html = html.replace(/\ssrc=['"](javascript:)[^'"]*['"]/gi, ''); // Prevent javascript: in src

    return html;
  }

  /** Bypass security trust for safe HTML */
  bypassSecurityTrustHtml(value: string): SafeHtml {
    return value;
  }

  bypassSecurityTrustStyle(value: string): SafeHtml {
    return value;
  }

  bypassSecurityTrustScript(value: string): SafeHtml {
    return value;
  }

  bypassSecurityTrustUrl(value: string): SafeHtml {
    return value;
  }

  bypassSecurityTrustResourceUrl(value: string): SafeHtml {
    return value;
  }
}
