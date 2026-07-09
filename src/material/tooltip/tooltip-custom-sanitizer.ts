/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * DOM-based HTML sanitizer that preserves inline SVG.
 *
 * Angular's built-in sanitizer strips SVG elements, which is the reason this fork
 * exists. This implementation follows the same architecture as Angular's sanitizer
 * (parse into an inert document, walk the tree, keep only allowlisted elements and
 * attributes, validate URL-valued attributes) instead of regex rewriting, which is
 * bypassable (unquoted event handlers, unclosed tags, entity-encoded URLs, etc.).
 *
 * Intentionally NOT allowed: script, style, iframe, object, embed, form, meta,
 * link, base, template, math, foreignObject (mXSS vector), SMIL animation
 * elements (attribute-injection vector, e.g. `<animate attributeName="href">`).
 */

/** HTML elements that are safe to keep (same set Angular's sanitizer allows). */
const HTML_ELEMENTS =
  'address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,dd,dt,' +
  'figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,' +
  'li,ul,pre,section,summary,table,tbody,td,tfoot,th,thead,tr,a,abbr,acronym,audio,b,bdi,' +
  'bdo,big,br,cite,code,em,font,i,img,kbd,label,mark,picture,q,rp,rt,ruby,s,samp,small,' +
  'source,span,strike,strong,sub,sup,time,track,tt,u,var,video';

/** SVG elements that are safe to keep. */
const SVG_ELEMENTS =
  'svg,circle,clippath,defs,desc,ellipse,filter,feblend,fecolormatrix,fecomponenttransfer,' +
  'fecomposite,feconvolvematrix,fediffuselighting,fedisplacementmap,fedistantlight,' +
  'fedropshadow,feflood,fefunca,fefuncb,fefuncg,fefuncr,fegaussianblur,femerge,femergenode,' +
  'femorphology,feoffset,fepointlight,fespecularlighting,fespotlight,fetile,feturbulence,' +
  'g,image,line,lineargradient,marker,mask,path,pattern,polygon,polyline,radialgradient,' +
  'rect,stop,switch,symbol,text,textpath,title,tspan,use,view';

/** Attributes whose value is a URL and must match a safe pattern. */
const URL_ATTRIBUTES = 'background,cite,href,longdesc,src,xlink:href,xml:base';

/** Non-URL attributes that are safe to keep (HTML + SVG presentation attributes). */
const SAFE_ATTRIBUTES =
  'abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
  'color,cols,colspan,compact,controls,coords,datetime,dir,download,face,headers,height,' +
  'hidden,hreflang,hspace,ismap,itemprop,itemscope,lang,language,loop,media,muted,nohref,' +
  'nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,' +
  'srclang,srcset,start,style,summary,tabindex,target,title,translate,type,usemap,valign,' +
  'value,vspace,width,' +
  // SVG presentation and geometry attributes.
  'accent-height,alignment-baseline,baseline-shift,baseprofile,bbox,cap-height,clip,' +
  'clip-path,clip-rule,clippathunits,color-interpolation,color-interpolation-filters,' +
  'color-profile,color-rendering,cursor,cx,cy,d,direction,display,dominant-baseline,dx,dy,' +
  'fill,fill-opacity,fill-rule,filterunits,flood-color,flood-opacity,font-family,font-size,' +
  'font-size-adjust,font-stretch,font-style,font-variant,font-weight,fx,fy,' +
  'glyph-orientation-horizontal,glyph-orientation-vertical,gradienttransform,gradientunits,' +
  'image-rendering,in,in2,k1,k2,k3,k4,kerning,letter-spacing,lighting-color,marker-end,' +
  'marker-mid,marker-start,markerheight,markerunits,markerwidth,mask,maskcontentunits,' +
  'maskunits,mode,offset,opacity,operator,order,orient,overflow,paint-order,pathlength,' +
  'patterncontentunits,patterntransform,patternunits,points,preserveaspectratio,r,radius,' +
  'refx,refy,repeatcount,repeatdur,requiredextensions,requiredfeatures,restart,result,rotate,' +
  'rx,ry,scale,seed,shape-rendering,spreadmethod,startoffset,stddeviation,stop-color,' +
  'stop-opacity,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,' +
  'stroke-miterlimit,stroke-opacity,stroke-width,systemlanguage,text-anchor,text-decoration,' +
  'text-rendering,transform,transform-origin,u1,u2,unicode-bidi,vector-effect,version,' +
  'viewbox,visibility,white-space,word-spacing,writing-mode,x,x1,x2,xmlns,xmlns:xlink,' +
  'xml:lang,xml:space,y,y1,y2,zoomandpan';

const toSet = (csv: string) => new Set(csv.split(','));

const ALLOWED_ELEMENTS = toSet(HTML_ELEMENTS + ',' + SVG_ELEMENTS);
const ALLOWED_ATTRIBUTES = toSet(SAFE_ATTRIBUTES);
const URL_ATTRIBUTE_SET = toSet(URL_ATTRIBUTES);

/**
 * Safe URL pattern (same as Angular's): allows http(s), mailto, ftp, tel, sms
 * and relative URLs; rejects `javascript:`, `vbscript:` and other schemes.
 */
const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/i;

/** Safe `data:` URL pattern (same as Angular's): base64 image/video/audio only. */
const DATA_URL_PATTERN =
  /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

const isSafeUrl = (value: string): boolean => {
  const url = value.trim();
  return SAFE_URL_PATTERN.test(url) || DATA_URL_PATTERN.test(url);
};

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Parses HTML into an inert document so nothing executes or loads while sanitizing. */
const parseInert = (html: string): HTMLElement | null => {
  if (typeof DOMParser !== 'undefined') {
    return new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html').body;
  }
  if (typeof document !== 'undefined') {
    const inertDocument = document.implementation.createHTMLDocument('sanitization');
    inertDocument.body.innerHTML = html;
    return inertDocument.body;
  }
  return null;
};

const sanitizeAttributes = (element: Element): void => {
  const isUseElement = element.nodeName.toLowerCase() === 'use';
  for (const attribute of Array.from(element.attributes)) {
    const name = attribute.name.toLowerCase();
    if (URL_ATTRIBUTE_SET.has(name)) {
      // `<use>` may only reference same-document fragments; external or data:
      // references are a known SVG attack vector.
      const safe = isUseElement
        ? attribute.value.trim().startsWith('#')
        : isSafeUrl(attribute.value);
      if (!safe) {
        element.removeAttribute(attribute.name);
      }
    } else if (name.startsWith('on') || !ALLOWED_ATTRIBUTES.has(name)) {
      element.removeAttribute(attribute.name);
    }
  }
};

const sanitizeChildren = (node: Node): void => {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === 1 /* ELEMENT_NODE */) {
      const element = child as Element;
      if (!ALLOWED_ELEMENTS.has(element.nodeName.toLowerCase())) {
        // Drop disallowed elements entirely, including their subtree.
        node.removeChild(child);
        continue;
      }
      sanitizeAttributes(element);
      sanitizeChildren(element);
    } else if (child.nodeType !== 3 /* TEXT_NODE */) {
      // Remove comments, CDATA and processing instructions — all are mXSS vectors.
      node.removeChild(child);
    }
  }
};

/** Sanitizes an HTML string while keeping inline `<svg>` content. */
export const sanitizeHtml = (html: string): string => {
  if (!html) {
    return '';
  }
  const body = parseInert(html);
  if (body === null) {
    // No DOM available (e.g. server-side rendering): render as plain text.
    return escapeHtml(html);
  }
  sanitizeChildren(body);
  return body.innerHTML;
};

/** Extracts the plain text of an HTML string (e.g. for ARIA descriptions). */
export const htmlToPlainText = (html: string): string => {
  if (!html) {
    return '';
  }
  const body = parseInert(html);
  return (body === null ? html.replace(/<[^>]*>/g, ' ') : body.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();
};
