# Appendix — the Y combinator (recursion from nothing)

```
Y ≡ λf. (λx. f (x x)) (λx. f (x x))
```

Every recursion in this world — the `foldr` of [`APPENDIX-FOLDR.md`](APPENDIX-FOLDR.md),
any loop at all — runs on this. Here's the problem it solves, where it comes from,
and the one property that makes it work.

## The problem: recursion needs a name

Try to write factorial with the demo's own primitives:

```
FACT = λn. IF (ISZERO n) ONE (MULT n (FACT (PRED n)))
                                       ^^^^
```

It calls `FACT` in its own body. But a `λ` is **anonymous** — at the moment we're
defining it, there is no name `FACT` to call yet. In a language built from nothing
but functions, *self-reference is not given to you.* You have to manufacture it.

## The idea: hand the function itself, as an argument

If you can't refer to yourself by name, take yourself as a **parameter**. Write the
recipe that, *given a copy of itself* (`rec`), produces one layer of the function:

```
FACT-STEP ≡ λrec. λn. IF (ISZERO n) ONE (MULT n (rec (PRED n)))
```

`FACT-STEP` is **not** recursive — `rec` is just an argument. It's a plain
function. What we need is something that feeds `FACT-STEP` a copy of *the very
function `FACT-STEP` builds* — so that `rec` is the real factorial. That
"something" is a fixed point.

## Fixed points

A **fixed point** of `g` is a value `x` with `g x = x`. We want a `FACT` such that

```
FACT-STEP FACT  =  FACT
```

— because then the `rec` inside `FACT-STEP` *is* `FACT`, and the recursion closes.
`Y` is the machine that, handed any `g`, produces a fixed point of `g`.

## Deriving it: self-application

The one trick lambda calculus has for "feeding a thing to itself" is
**self-application**, `x x` — a function applied to itself. Package it so that
applying the package re-applies it, wrapped in `f`:

```
Y ≡ λf. (λx. f (x x)) (λx. f (x x))
```

The two identical halves `(λx. f (x x))` are the gears: each, when applied to
itself, hands `f` another copy of the self-applying machine.

## The one property that matters

Watch `Y g` take a single step:

```
   Y g
=  (λx. g (x x)) (λx. g (x x))              -- substitute f := g
→β g ( (λx. g (x x)) (λx. g (x x)) )        -- apply the left half to the right
=  g (Y g)                                   -- the thing in parens IS Y g again
```

So **`Y g →β g (Y g)`**. Unfold it as far as you like:

```
Y g  =  g (Y g)  =  g (g (Y g))  =  g (g (g (Y g)))  =  …
```

`Y g` is `g` applied to itself endlessly, peeling off exactly one layer each time
something forces it. For `FACT-STEP`, each peel is one more multiplication — and
the `IF (ISZERO n)` base case is what stops the peeling.

## The eager-host wrinkle → the Z combinator

In **normal-order** (lazy) reduction, `Y` terminates: `g` only forces the next
`(Y g)` layer when it actually needs it, and the base case cuts it off. Our host,
JavaScript, is **applicative-order (eager)**: it reduces `x x` *before* `g` runs,
so plain `Y` unfolds forever and blows the stack before the base case is reached.

The fix is a one-token delay: **eta-expand** the self-application `x x` into
`λv. x x v`. That's a *function* — a value — so it sits inert until it's applied,
which only happens when `g` actually asks for the next layer. That is the **Z
combinator**:

```
Z ≡ λf. (λx. f (λv. x x v)) (λx. f (λv. x x v))
```

`Y` and `Z` compute the same fixed points; `Z` is just the version that survives
strict evaluation. (This is the same eager/lazy gap flagged for `cond` in Act 5
and for `foldr` in the FOLDR appendix.)

## Worked example: factorial from the demo's own primitives

Putting it together — `MULT` (Act 3), `ISZERO`/`PRED` (Act 4), `IF` (Act 2), and
`Z` to tie the recursive knot. Branches are thunked (`() => …`) and forced, so the
eager host doesn't build the recursive branch until the base case has had its say:

```ts
const Z = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));

const FACT = Z(rec => n =>
  IF (ISZERO(n)) (() => ONE)
                 (() => MULT(n)(rec(PRED(n))))());

toInt(FACT(ZERO))    // 1
toInt(FACT(THREE))   // 6
toInt(FACT(FIVE))    // 120
```

And the fixed-point property is directly observable — `FACT` and `FACT-STEP FACT`
compute the same thing, because the second *is* one unfolding of the first:

```ts
toInt(FACT(FOUR))                  // 24
toInt((rec => n => …)(FACT)(FOUR)) // 24  — FACT-STEP FACT = FACT
```

*(All verified end-to-end: `0! 1! 3! 4! 5!` = `1 1 6 24 120`, plus a sum-to-n
variant, plus the fixed-point check.)*

## Why this matters

Recursion is **not a primitive.** No language feature grants it here — no `while`,
no named `def`, nothing to call by name. Yet `Y` conjures unbounded self-reference
out of pure application. That is the final plank in the argument the whole talk is
making: the untyped lambda calculus is **Turing-complete** — loops, iteration,
arbitrary computation, all of it, from the function alone.

Booleans, numbers, decisions, pairs, lists (the [9-primitive core](BRIDGE.md)) —
and now *recursion itself*. There is nothing left to assume.

---

*See also [`APPENDIX-FOLDR.md`](APPENDIX-FOLDR.md) (where `Y`/`Z` first appear) and
[`APPENDIX-PRED.md`](APPENDIX-PRED.md).*
