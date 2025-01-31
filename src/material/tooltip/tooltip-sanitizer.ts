import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Injectable, SecurityContext} from '@angular/core';

/** Custom sanitizer that allows <svg> but removes dangerous content */
@Injectable()
export class TooltipSanitizer extends DomSanitizer {
  constructor() {
    super();
  }

  /** Main sanitization function */
  sanitize(context: SecurityContext, value: string | null): string | null {
    if (context === SecurityContext.HTML && typeof value === 'string') {
      return this.sanitizeTooltipHtml(value);
    }
    return value;
  }

  /** Function to sanitize HTML while keeping <svg> */
  private sanitizeTooltipHtml(html: string): string {
    // Remove <script>, <iframe>, <object>, <embed>, <form>, <style>, <meta>, <link>, <base>
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
