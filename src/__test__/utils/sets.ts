type Widen<T> = T | (TSReset.WidenLiteral<T> & {});

/**
 * `A ∩ B`.
 * Compute the intersection of unique elements contained in both {@link a} and {@link b}.
 * @param a
 * @param b
 * @returns
 */
export function intersection<A, B>(a: Widen<A>[], b: Widen<B>[]): Extract<Widen<A>, Widen<B>>[] {
  const setB = new Set<Widen<A> | Widen<B>>(b);
  return [...new Set<Widen<A>>(a)].filter((x): x is Extract<Widen<A>, Widen<B>> => setB.has(x));
}

/**
 * `A - B` a.k.a. `A / B`.
 * Compute the unique elements in {@link a} that do not also exist in {@link b}.
 * @param a
 * @param b
 * @returns
 */
export function difference<A, B>(a: A[], b: B[]): Widen<A>[] {
  const setB = new Set<A | B>(b);
  return [...new Set<A>(a)].filter((x): x is A => !setB.has(x));
}
