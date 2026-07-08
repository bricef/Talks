# Appendix — how `PRED` works

```ts
const PRED = n => f => x => n(g => h => h(g(f)))(u => x)(u => u);
```

This is the one lambda in the talk that looks like line noise. Here's why it's
hard, the one-sentence trick, and a step-by-step trace that shows it's not magic.

## Why predecessor is the hard one

Every other numeral operation *adds* structure, and adding is easy:

- `SUCC n` = "do `f` one **more** time" — just wrap the result in another `f`.
- `ADD m n` = "do `f`, `m` times, then `n` more times."

`PRED` has to go the other way: given `fⁿ` — a function that applies `f`
n times — produce `fⁿ⁻¹`. But you **can't un-apply `f`**. Once a numeral has
baked in "apply `f` n times," there's no inverse to peel one off.

So we don't subtract. We **rebuild the number from zero and stop one step early.**

## The trick in one sentence

> Count up from `x` to `fⁿ(x)`, but keep the value in a box that's always **one
> step behind** — because the very first step throws its `f` away.

## The three moving parts

The body is `n(B)(init)(id)`, i.e. apply `B` to `init` n times, then open the
result with `id`. Read the pieces as:

| Piece | Code | Role |
|-------|------|------|
| **the box** | `h => h(value)` | holds a `value`, waiting to hand it to whatever function `h` you give it |
| **the seed** | `init = u => x` | a box that **ignores** its first `f` and just yields `x` — this is where the off-by-one is born |
| **advance** | `B = g => h => h(g(f))` | open box `g` with `f` (moving its value forward by one `f`), then wrap the result in a fresh box |
| **read it out** | `id = u => u` | open the final box with the identity to get the raw value |

Key move: `init` **swallows** the `f` handed to it on the first `B` step. Every
step after that applies a real `f`. So after `n` steps you've applied `f` only
`n − 1` times. That's the predecessor.

## Step-by-step β-reduction of `PRED THREE`

The rigorous version: nothing but substitution, one redex at a time, until we
land on `TWO`. We α-rename `THREE`'s bound variables to `s`/`z` so they can't be
confused with the `f`/`x` introduced by `PRED`, and abbreviate the two constant
sub-terms once they appear:

```
PRED  ≡ λn. λf. λx. n (λg. λh. h (g f)) (λu. x) (λu. u)
THREE ≡ λs. λz. s (s (s z))

B ≡ λg. λh. h (g f)      -- "advance": open box g with f, re-wrap the result
K ≡ λu. x                -- the seed: ignores its argument, yields x
I ≡ λu. u                -- identity: used at the end to read the box out
```

**Feed `THREE` to `PRED`** (substitute `n := THREE`), then work inside the
`λf. λx.` — at which point `B`, `K`, `I` are exactly the terms above:

```
   PRED THREE
=  (λn. λf. λx. n (λg.λh. h (g f)) (λu.x) (λu.u)) THREE
→β λf. λx. THREE (λg.λh. h (g f)) (λu.x) (λu.u)
≡  λf. λx. THREE B K I
```

**Apply `THREE` to `B`** — a numeral applied to a function just means "do it
three times", so `THREE B` becomes `B∘B∘B`, then hand it the seed `K`:

```
   THREE B
=  (λs. λz. s (s (s z))) B
→β λz. B (B (B z))
   (THREE B) K
→β B (B (B K))
```

**Reduce the tower inside-out.** Each `B` opens the box below it with `f` and
re-wraps — and the *first* one hits the seed `K`, which throws `f` away. Write
`Pₖ` for each resulting box:

```
(1)  B K   = (λg.λh. h (g f)) K   →β λh. h (K f)
     K f   = (λu.x) f             →β x            ← the swallow: f discarded
     ⟹ B K →β λh. h x                              ≡ P₁

(2)  B P₁  = (λg.λh. h (g f)) P₁  →β λh. h (P₁ f)
     P₁ f  = (λh. h x) f          →β f x           ← first real application
     ⟹ B P₁ →β λh. h (f x)                          ≡ P₂

(3)  B P₂  = (λg.λh. h (g f)) P₂  →β λh. h (P₂ f)
     P₂ f  = (λh. h (f x)) f      →β f (f x)        ← second real application
     ⟹ B P₂ →β λh. h (f (f x))                      ≡ P₃
```

**Read the box out** by applying the identity `I`:

```
   P₃ I = (λh. h (f (f x))) I
→β I (f (f x)) = (λu.u) (f (f x))
→β f (f x)
```

**Put the `λf. λx.` back on:**

```
PRED THREE →β λf. λx. f (f x)  ≡  TWO   ∎
```

Three `B`-steps, but only **two** real applications of `f` — because step (1)
fed `f` into the seed `K`, which discarded it. That single swallowed `f` *is* the
subtraction. Everything else is honest counting.

## Confirm it by running (instrumented)

Watch what value the box holds after each `B`, opening it with `id` to peek.
Written with `f` shown as `·f` so you can count the applications:

```
step 0 (init):     box holds  x         ← seed
step 1 (B once):   box holds  x         ← first f was swallowed (the lag!)
step 2 (B twice):  box holds  x·f
step 3 (B thrice): box holds  x·f·f
```

After `n` boxings the box holds `fⁿ⁻¹(x)`. The final `(id)` just reads it out:

- `PRED(THREE)` → box holds `f(f(x))` → `TWO` ✓
- `PRED(ONE)`   → box holds `x`       → `ZERO` ✓
- `PRED(ZERO)`  → no steps, `init(id)` = `x` → `ZERO` ✓ (truncated: no negatives)

*(Reproduce this: the instrumented trace lives in the talk notes — swap `f` for
`s => s + "·f"` and `x` for `"x"`, then open each intermediate box with `id`.)*

## The general pattern

Each `B` step turns a box holding `fᵏ⁻¹(x)` into a box holding `fᵏ(x)`:

```
Bₖ :  h => h(fᵏ⁻¹(x))   ── open with f ──▶   h => h(fᵏ(x))
```

...but because step 1 started from `init` (which gave back `x`, not `f(x)`), the
whole sequence runs one behind. After `n` steps: `fⁿ⁻¹(x)`.

## The intuition to say out loud

You don't reverse `f`. You **recount from scratch and quit one early.** It's a
tape that records each value just *before* it advances — so when the count
finishes, the tape is still showing the previous frame. That "previous frame"
is the predecessor.

Everything downstream is easy again once you have `PRED`:

```ts
const SUB = m => n => n(PRED)(m);           // apply PRED n times  → m − n (truncated)
const LEQ = m => n => ISZERO(SUB(m)(n));    // m ≤ n  ⟺  m − n == 0
```
