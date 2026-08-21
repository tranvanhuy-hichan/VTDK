export function flyToCart(imageUrl: string, sourceEl: HTMLElement) {
  if (typeof window === "undefined") return;

  const candidates = document.querySelectorAll<HTMLElement>('[data-cart-icon="true"]');
  let targetRect: DOMRect | undefined;
  for (const el of Array.from(candidates)) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      targetRect = rect;
      break;
    }
  }
  if (!targetRect) return;
  const finalTargetRect = targetRect;

  const sourceRect = sourceEl.getBoundingClientRect();

  const size = 44;
  const flyer = document.createElement("img");
  flyer.src = imageUrl;
  flyer.style.position = "fixed";
  flyer.style.left = `${sourceRect.left + sourceRect.width / 2 - size / 2}px`;
  flyer.style.top = `${sourceRect.top + sourceRect.height / 2 - size / 2}px`;
  flyer.style.width = `${size}px`;
  flyer.style.height = `${size}px`;
  flyer.style.borderRadius = "9999px";
  flyer.style.objectFit = "cover";
  flyer.style.zIndex = "9999";
  flyer.style.pointerEvents = "none";
  flyer.style.boxShadow = "0 6px 18px rgba(0,0,0,0.3)";
  flyer.style.border = "2px solid white";
  document.body.appendChild(flyer);

  const deltaX = finalTargetRect.left + finalTargetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const deltaY = finalTargetRect.top + finalTargetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  const animation = flyer.animate(
    [
      { transform: "translate(0px, 0px) scale(1)", opacity: 1, offset: 0 },
      { transform: `translate(${deltaX * 0.55}px, ${deltaY * 0.35 - 70}px) scale(0.75)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.15)`, opacity: 0.4, offset: 1 },
    ],
    { duration: 700, easing: "cubic-bezier(0.32, 0, 0.67, 1)" }
  );

  animation.onfinish = () => {
    flyer.remove();
    window.dispatchEvent(new CustomEvent("cart-fly-landed"));
  };
}
