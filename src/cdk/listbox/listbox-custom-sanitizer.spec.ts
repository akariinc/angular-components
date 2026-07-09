import {htmlToPlainText, sanitizeHtml} from './listbox-custom-sanitizer';

describe('custom sanitizer (SVG-preserving)', () => {
  describe('sanitizeHtml', () => {
    it('should keep plain text and basic formatting', () => {
      expect(sanitizeHtml('Hello <b>world</b> <i class="abc">!</i>')).toBe(
        'Hello <b>world</b> <i class="abc">!</i>',
      );
    });

    it('should keep inline SVG with its presentation attributes', () => {
      const result = sanitizeHtml(
        '<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg">' +
          '<circle r="10" cx="10" cy="10" fill="red"></circle></svg>',
      );
      expect(result).toContain('<svg');
      expect(result).toContain('<circle');
      expect(result).toContain('fill="red"');
      expect(result).toContain('height="20"');
    });

    it('should remove script elements, including unclosed ones', () => {
      expect(sanitizeHtml('a<script>alert(1)</script>b')).toBe('ab');
      expect(sanitizeHtml('a<script src="https://evil.example/x.js">b')).toBe('a');
      expect(sanitizeHtml('<svg><script>alert(1)</script></svg>')).not.toContain('script');
    });

    it('should remove dangerous containers', () => {
      for (const html of [
        '<iframe src="https://evil.example"></iframe>',
        '<iframe src="https://evil.example">',
        '<object data="x"></object>',
        '<embed src="x">',
        '<form action="x"></form>',
        '<style>*{display:none}</style>',
        '<meta http-equiv="refresh" content="0">',
        '<link rel="stylesheet" href="x">',
        '<base href="https://evil.example/">',
        '<template><img src="x" onerror="alert(1)"></template>',
        '<math><mtext></mtext></math>',
        '<svg><foreignObject><span>x</span></foreignObject></svg>',
      ]) {
        const result = sanitizeHtml(html);
        expect(result).not.toContain('iframe');
        expect(result).not.toContain('object');
        expect(result).not.toContain('embed');
        expect(result).not.toContain('form');
        expect(result).not.toContain('style');
        expect(result).not.toContain('meta');
        expect(result).not.toContain('link');
        expect(result).not.toContain('base');
        expect(result).not.toContain('template');
        expect(result).not.toContain('math');
        expect(result).not.toContain('foreignObject');
      }
    });

    it('should remove SMIL animation elements (attribute injection vector)', () => {
      const result = sanitizeHtml(
        '<svg><a href="#x"><animate attributeName="href" values="javascript:alert(1)"></animate>' +
          '<circle r="10"></circle></a></svg>',
      );
      expect(result).not.toContain('animate');
      expect(result).toContain('<circle');
    });

    it('should remove event handler attributes, quoted or not', () => {
      expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).not.toContain('onerror');
      expect(sanitizeHtml("<img src='x' onerror='alert(1)'>")).not.toContain('onerror');
      expect(sanitizeHtml('<img src=x onerror=alert(1)>')).not.toContain('onerror');
      expect(sanitizeHtml('<svg onload=alert(1)></svg>')).not.toContain('onload');
      expect(sanitizeHtml('<div OnClick=alert(1)>x</div>')).not.toContain('lick');
    });

    it('should remove javascript: and other unsafe URLs', () => {
      expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>');
      expect(sanitizeHtml('<a href="JaVaScRiPt:alert(1)">x</a>')).toBe('<a>x</a>');
      expect(sanitizeHtml('<a href="jav\tascript:alert(1)">x</a>')).toBe('<a>x</a>');
      expect(sanitizeHtml('<a href="&#106;avascript:alert(1)">x</a>')).toBe('<a>x</a>');
      expect(sanitizeHtml('<a href="data:text/html;base64,PHNjcmlwdD4=">x</a>')).toBe('<a>x</a>');
      expect(sanitizeHtml('<img src="javascript:alert(1)">')).toBe('<img>');
    });

    it('should keep safe URLs', () => {
      expect(sanitizeHtml('<a href="https://example.com/a?b#c">x</a>')).toContain(
        'href="https://example.com/a?b#c"',
      );
      expect(sanitizeHtml('<a href="/relative/path">x</a>')).toContain('href="/relative/path"');
      expect(sanitizeHtml('<a href="#fragment">x</a>')).toContain('href="#fragment"');
      expect(sanitizeHtml('<a href="mailto:a@b.c">x</a>')).toContain('href="mailto:a@b.c"');
      expect(
        sanitizeHtml('<img src="data:image/png;base64,iVBORw0KGgo=">'),
      ).toContain('data:image/png;base64');
    });

    it('should only allow fragment references on <use>', () => {
      expect(sanitizeHtml('<svg><use href="#icon"></use></svg>')).toContain('href="#icon"');
      expect(sanitizeHtml('<svg><use href="https://evil.example/x.svg#i"></use></svg>')).not.toContain(
        'href=',
      );
    });

    it('should remove comments and unknown attributes', () => {
      expect(sanitizeHtml('a<!-- comment -->b')).toBe('ab');
      expect(sanitizeHtml('<div data-x="1" srcdoc="x" formaction="x">a</div>')).toBe('<div>a</div>');
    });

    it('should return an empty string for empty input', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml(null as unknown as string)).toBe('');
    });
  });

  describe('htmlToPlainText', () => {
    it('should extract the text content of HTML', () => {
      expect(htmlToPlainText('Info <b>about</b> the action')).toBe('Info about the action');
      expect(htmlToPlainText('a<svg><circle r="1"></circle></svg>b')).toBe('ab');
      expect(htmlToPlainText('')).toBe('');
    });

    it('should collapse whitespace', () => {
      expect(htmlToPlainText('<div>a</div>\n\n  <div>b</div>')).toBe('a b');
    });
  });
});
