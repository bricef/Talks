# Bridge — where *Programming Ex Nihilo* meets *Building Objects with Functions*

Two talks, one staircase. This demo builds booleans, numbers, and decisions from
nothing but the function. The [*Building Objects with Functions*][talk] talk
([source][repo]) builds an object system — but it **starts one floor up**, on a
list of 12 "primitives" it declares it will rely on:

> `first`/`car` · `rest`/`cdr` · `list` · `cons` · `equal` · `cond` · `or` ·
> `and` · `not` · `setq` · `defun` · `defmacro`

The claim of this note: **those aren't bedrock.** Every one that carries *meaning*
is a composition of what we already built here — and the join point is Act 4.

## The split

| | Talk primitive | Where it comes from |
|---|---|---|
| **Semantic core** (9) | `and` | our `AND` (Act 2), reused verbatim |
| | `or`, `not` | one-liners over our `TRUE`/`FALSE` (Act 2) |
| | `cond` | nested / folded `IF` (Act 2) |
| | `equal` | our `EQ` (Act 4) — full chain below |
| | `cons`, `car`, `cdr`, `list` | the Church pair — already latent in `PRED` |
| **Outside the box** (3) | `setq`, `defun` | naming & persistence — substitution, not a value |
| | `defmacro` | pure syntactic sugar — doesn't change semantics |

The bottom three sit outside the box **by choice, not by gap.** `setq`/`defun`
are how you *name and keep* things (`let x = V in body` ≡ `(λx. body) V`; our
`const foo = …` is the same move). `defmacro`, as the talk uses it, is sugar over
forms you could always write by hand. None of them alter the logic — so the
*semantics* of the object system reduce, in full, to the value layer below.

## Thread 1 — decisions (the Act 4 through-line)

The object system's field lookup pivots on `(cond ((equal key k) …) (:else …))`.
Both halves are ours:

```
talk cond   ⟵  nested IF                                   (Act 2)
talk and    ⟵  AND                                         (Act 2, reused in Act 4)
talk equal  ⟵  EQ                                          (Act 4)
                 ⟵ AND (LEQ m n) (LEQ n m)
                     ⟵ LEQ = ISZERO ∘ SUB
                         ⟵ SUB = iterate PRED
                             ⟵ PRED, ISZERO                (Act 4)
                                 ⟶ bottom out in booleans  (Act 2)
```

`equal` is the deepest thread: it reaches down through Act 4 → Act 3 (its
`SUB`/`PRED` iterate over Church numerals) → Act 2 (`ISZERO`/`AND` hand back our
booleans). *(The talk's `equal` also compares keyword keys; symbol equality isn't
lambda-native — but encode a key as a numeral and it is exactly our `EQ`.)*

## Thread 2 — data cells (and the prettiest bridge)

`cons`/`car`/`cdr`/`list` are the Church pair — pure functions, with our booleans
acting as the selectors:

```
cons ≡ a → b → s → s a b
car  ≡ p → p(TRUE)        cdr ≡ p → p(FALSE)        ← selectors ARE our booleans
list ≡ repeated cons over NIL
```

And we already wrote this shape. Look at `PRED`'s accumulator box:

```
h => h(value)          -- a value waiting for a selector = a one-slot cons cell
```

That "value waiting for a selector" *is* the cons trick. The machinery the objects
talk uses to hold a `(key value)` field is the same machinery our predecessor uses
to hold "the previous number." **The box inside `PRED` is a cons cell.** (See
[`APPENDIX-PRED.md`](APPENDIX-PRED.md) for the full reduction.)

## The payoff

The object system's field access —

```
get-in   =   cond   +   equal        =        IF (Act 2)   +   EQ (Act 4)
```

— is nothing but **Act 2 ∘ Act 4.** Method dispatch (`tell`) adds inheritance by
walking a `:parent` link, but the atom it repeats is that same `cond` + `equal`.
So the decisions we built in Act 4 are *precisely* what the objects talk needs to
find a field by key.

**Net:** *Programming Ex Nihilo* is the sub-basement beneath *Building Objects
with Functions.* Nine of the twelve declared primitives are compositions of this
demo's pure functions; the other three are naming, persistence, and sugar that sit
outside the semantic core on purpose. The staircase between the talks is a single
step: **Act 4 → `equal`/`cond` → `get-in`.**

[talk]: https://fractallambda.com/building-objects-with-functions/
[repo]: https://github.com/bricef/building-objects-with-functions
