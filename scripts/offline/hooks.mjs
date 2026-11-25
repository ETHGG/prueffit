const SHIM = new URL('./vitest.mjs', import.meta.url).href;
export async function resolve(specifier, context, next) {
  if (specifier === 'vitest') return { url: SHIM, shortCircuit: true };
  return next(specifier, context);
}
