// ==UserScript==
// @name        Amazon URL canonicalizer 
// @author      zfhrp
// @description Replace Amazon product page url with canonical form (`https://amazon.co.jp/dp/XXXXXXXX/`)
// @homepageURL https://openuserjs.org/users/zfhrp
// @version     1.0.0
// @match       *://*.amazon.co.jp/dp/*
// @match       *://*.amazon.co.jp/*/dp/*
// @match       *://*.amazon.co.jp/gp/product/*
// @match       *://*.amazon.co.jp/*/ASIN/*
// @match       *://*.amazon.com/dp/*
// @match       *://*.amazon.com/*/dp/*
// @match       *://*.amazon.com/gp/product/*
// @match       *://*.amazon.com/*/ASIN/*
// @icon        https://www.amazon.co.jp/favicon.ico
// @run-at      document-start
// ==/UserScript==

/**
 * get ASIN from page location.
 * ASIN is also known as productId and is some-digit alphanumeric ID.
 * @return {string|null} ASIN
 */
const getASIN = () => {
  const patterns = [
    /(?:.+\/)?dp\/([^/?]+)/,
    /gp\/product\/([^/?]+)/,
    /ASIN\/([^/?]+)/,
  ];
  for(const pattern of patterns){
    const asin = location.href.match(pattern);
    if (asin) {
      return asin[1];
    }
  }
  // cannot get ASIN
  return null;
}

const isCanonicalUrl = () => {
  const pathPattern = /^\/dp\/[a-zA-Z0-9]+\/?$/;
  return location.pathname.match(pathPattern) !== null;
}

const isGpProductUrl = () => {
  const pathPattern = /\/gp\/[a-zA-Z0-9-]+/;
  return location.pathname.match(pathPattern) !== null;
}

const ignorePattern = () => {
  return isGpProductUrl();
}

/**
 * location.replace(canonicalURL)
 */
const canonicalize = () => {
  const asin = getASIN();
  if (!asin) {
    return;
  }
  
  // i.e. https://www.amazon.co.jp/dp/XXXXXXXX/
  const canonicalUrl = `${location.protocol}//${document.domain}/dp/${asin}/`;
  location.replace(canonicalUrl);
}

const main = () => {
  if (!ignorePattern() && !isCanonicalUrl()) {
    canonicalize();
  }
}

main();
