/** Soft sage + warm cream canvas for auth pages */

export function AuthSceneBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-cream" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-cream-dark)_0%,var(--color-cream)_55%)]" />
      <div className="absolute -bottom-[20%] left-1/2 h-[50vh] w-[140%] -translate-x-1/2 rounded-[50%] bg-sage/80" />
      <div className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-sage/40 blur-3xl" />
      <div className="absolute right-[10%] top-[22%] h-32 w-32 rounded-full bg-white/50 blur-3xl" />
    </div>
  );
}

/** @deprecated */
export function AuthLeftDecor() {
  return <AuthSceneBackground />;
}

/** @deprecated */
export function AuthSceneDecor() {
  return <AuthSceneBackground />;
}
