/**
 * Utility functions for detecting and fixing RTL text alignment.
 */

/**
 * Regex to detect Arabic Unicode range.
 */
export const ARABIC_REGEX = /[\u0600-\u06FF]/;

/**
 * Checks if a string contains Arabic characters.
 */
export const hasArabic = (text: string): boolean => {
  return ARABIC_REGEX.test(text);
};

/**
 * Finds all elements that contain Arabic text nodes.
 */
export const findArabicElements = (root: HTMLElement | Document = document): HTMLElement[] => {
  const arabicElements: HTMLElement[] = [];
  const walker = document.createTreeWalker(
    root instanceof Document ? root.body : root,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent && hasArabic(node.textContent)) {
      const parent = node.parentElement;
      if (parent && !arabicElements.includes(parent)) {
        arabicElements.push(parent);
      }
    }
  }
  return arabicElements;
};

/**
 * Finds the nearest common ancestor of a list of elements.
 */
export const findCommonAncestor = (elements: HTMLElement[]): HTMLElement | null => {
  if (elements.length === 0) return null;
  if (elements.length === 1) return elements[0];

  const getParents = (el: HTMLElement): HTMLElement[] => {
    const parents: HTMLElement[] = [];
    let curr: HTMLElement | null = el;
    while (curr) {
      parents.push(curr);
      curr = curr.parentElement;
    }
    return parents;
  };

  const parentsList = elements.map(getParents);
  let common: HTMLElement | null = null;
  
  // Start with the parents of the first element
  const firstElParents = parentsList[0];
  
  for (const parent of firstElParents) {
    const isCommon = parentsList.every(list => list.includes(parent));
    if (isCommon) {
      common = parent;
      break;
    }
  }

  return common;
};

/**
 * Applies the RTL attributes and styles to an element.
 */
export const applyRTL = (element: HTMLElement) => {
  element.setAttribute('dir', 'rtl');
  element.setAttribute('data-rtlfree', 'rtl');
  element.style.direction = 'rtl';
  element.style.textAlign = 'right';
};

/**
 * The core script logic as a single function.
 */
export const runRTLFix = (root: HTMLElement | Document = document) => {
  const elements = findArabicElements(root);
  if (elements.length === 0) return null;
  
  const parent = findCommonAncestor(elements);
  if (parent) {
    applyRTL(parent);
    return parent;
  }
  return null;
};
