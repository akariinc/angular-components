/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** Function to sanitize HTML while keeping &lt;svg&gt; */
export const sanitizeHtml = (html: string): string => {
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
};
