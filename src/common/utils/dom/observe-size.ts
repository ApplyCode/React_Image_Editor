type Callback = (e: {width: number; height: number}) => void;

export function observeSize(el: HTMLElement, callback: Callback): () => void {
  const observer = new ResizeObserver(entries => {
    const rect = entries[0].contentRect;
    callback({width: rect.width, height: rect.height});
  });
  observer.observe(el);
  return () => observer.unobserve(el);
}
