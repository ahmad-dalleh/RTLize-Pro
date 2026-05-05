(function() {
  const ARABIC_REGEX = /[\u0600-\u06FF]/;

  const findArabicElements = (root) => {
    const elements = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent && ARABIC_REGEX.test(node.textContent)) {
        const parent = node.parentElement;
        if (parent && !elements.includes(parent)) {
          elements.push(parent);
        }
      }
    }
    return elements;
  };

  const findCommonAncestor = (elements) => {
    if (elements.length === 0) return null;
    if (elements.length === 1) return elements[0];

    const getParents = (el) => {
      const parents = [];
      let curr = el;
      while (curr) {
        parents.push(curr);
        curr = curr.parentElement;
      }
      return parents;
    };

    const parentsList = elements.map(getParents);
    let common = null;
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

  const applyRTL = (element) => {
    if (element.getAttribute('data-rtlfree') === 'rtl') return;
    
    element.setAttribute('dir', 'rtl');
    element.setAttribute('data-rtlfree', 'rtl');
    element.style.direction = 'rtl';
    element.style.textAlign = 'right';
    console.log('RTLize Pro: Applied RTL to parent node', element);
  };

  const runFix = () => {
    const arabicElements = findArabicElements(document.body);
    if (arabicElements.length > 0) {
      const ancestor = findCommonAncestor(arabicElements);
      if (ancestor) {
        applyRTL(ancestor);
      }
    }
  };

  // Run on load
  runFix();

  // Watch for dynamic content (Ajax/SPA)
  let timeout;
  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(runFix, 1000);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
