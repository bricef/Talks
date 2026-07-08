# Appendix — `reduceRight` (`foldr`) in lambda calculus

Act 6's `LIST` builder leans on JS's `reduceRight`:

```ts
const LIST = (...xs) => xs.reduceRight((rest, x) => PAIR(x)(rest), NIL);
```

That's `foldr PAIR NIL` — a right fold. So what does `reduceRight` itself look
like with nothing but functions? There are two answers, and the second one loops
all the way back to Act 3.

## What `foldr` is

A right fold collapses a list by tucking a combining function `f` between the
elements, ending in a seed `z`:

```
foldr f z [a, b, c]  =  f a (f b (f c z))
```

`LIST`'s `reduceRight((rest, x) => PAIR(x)(rest), NIL)` is exactly this with
`f = PAIR` and `z = NIL`, which is why it produces `PAIR a (PAIR b (PAIR c NIL))`.

## Answer A — on the Act 6 pairs-list, `foldr` needs recursion

Our Act 6 list is `PAIR`s nested rightward, ending in `NIL`, read with
`FIRST` / `REST` / `ISEMPTY`. That encoding gives us no way to loop — and lambda
calculus has no `let rec`. `foldr` has to call itself:

```
foldr f z l  =  IF (ISEMPTY l)  z  (f (FIRST l) (foldr f z (REST l)))
```

To make `foldr` refer to itself with no name to bind it, use a **fixed-point
combinator** `Y`:

```
Y     ≡ λf. (λx. f (x x)) (λx. f (x x))
FOLDR ≡ Y (λrec. λf. λz. λl.
             IF (ISEMPTY l)  z  (f (FIRST l) (rec f z (REST l))))
```

In **normal-order** (lazy) lambda calculus that's complete: on `NIL`, `IF` selects
`z` and the recursive branch is never reduced, so it terminates.

### The eager-host wrinkle

Our demo runs in JavaScript, which is **eager** — it evaluates both branches of
`IF(cond)(then)(els)` before `IF` chooses, so the naive version recurses forever
even on `NIL`. (Same laziness gap noted for `cond` in Act 5.) Two fixes make it
run for real:

- Swap `Y` for the **Z combinator**, the applicative-order fixed point:
  `Z ≡ λf. (λx. f (λv. x x v)) (λx. f (λv. x x v))`
- **Thunk** the `IF` branches (`() => …`) and force the winner, so the recursive
  call isn't built until it's selected.

```ts
const Z = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));
const FOLDR = Z(rec => f => z => l =>
  IF (ISEMPTY(l)) (() => z)
                  (() => f(FIRST(l))(rec(f)(z)(REST(l))))());

FOLDR(ADD)(ZERO)(LIST(ONE, TWO, THREE))   // 6
FOLDR(ADD)(ZERO)(NIL)                      // 0
```

## Answer B — make the list *be* its own fold

Answer A works, but the recursion is a symptom of the *encoding*, not of folding
itself. Choose a different representation: encode a list by **what it does when
you fold it.**

```
NIL   ≡ λc. λn. n
CONS  ≡ λh. λt. λc. λn. c h (t c n)
FOLDR ≡ λf. λz. λl. l f z          -- reduceRight is just function application
```

```ts
const NIL  = c => n => n;
const CONS = h => t => c => n => c(h)(t(c)(n));
const FOLDR = f => z => l => l(f)(z);   // no combinator, no recursion, no thunks

FOLDR(ADD)(ZERO)(CONS(ONE)(CONS(TWO)(CONS(THREE)(NIL))))  // 6
```

No `Y`, no `Z`, no thunks. `FOLDR f z l` is literally `l(f)(z)`: the list **carries
its own fold**. Hand it the combining function and the seed and it runs itself.
This is the Church / Böhm–Berarducci encoding — the same move as Church booleans
*being* their own `if`, or Church numerals *being* their own repeat-loop.

Why does A need a combinator and B doesn't? In A the list is inert data you have
to walk from the outside. In B the recursion is **baked into `CONS`** at
construction time (`c h (t c n)` already threads the fold through the tail), so by
the time you fold, the looping is already done — you're just supplying `c` and `n`.

## The punchline — you wrote `reduceRight` in Act 3

Look at a Church numeral once more:

```ts
THREE = f => x => f(f(f(x)))       // = foldr f x over three units
```

That **is** `foldr`, with the elements discarded. A Church numeral is
`foldr SUCC ZERO` over a list of *n* items: `n f x` folds `f` over `x`, *n* times.
Answer B's list is the very same idea with the elements kept instead of thrown
away — which is why `FOLDR ≡ λf.λz.λl. l f z` mirrors how a numeral is used,
`λf.λx. n f x`.

```ts
FOLDR(ADD)(ZERO)(LIST(ONE, ONE, ONE))   // 3  — a fold of three units is the number 3
```

So `reduceRight` was never a new construct in this world. It's the shape the data
already had: **numbers, booleans, and lists in this talk are all just folds
waiting for the function you hand them.**

---

*Both encodings above are verified end-to-end (`foldr ADD ZERO [1,2,3] = 6`,
`= 0` on empty, and the numeral connection). See also
[`APPENDIX-PRED.md`](APPENDIX-PRED.md) and [`BRIDGE.md`](BRIDGE.md).*
