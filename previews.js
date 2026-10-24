// Start lightweight previews only near the viewport; keep stills without JavaScript.
(() => {
  const images = [...document.querySelectorAll('img[data-animated-src]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();

  const update = () => {
    images.forEach((image) => {
      const source = !reducedMotion.matches && visible.has(image)
        ? image.dataset.animatedSrc : image.dataset.stillSrc;
      if (image.getAttribute('src') !== source) image.src = source;
    });
  };

  if (!images.length || !('IntersectionObserver' in window)) return;
  reducedMotion.addEventListener('change', update);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
    });
    update();
  }, { rootMargin: '120px' });
  images.forEach((image) => observer.observe(image));
  update();
})();
