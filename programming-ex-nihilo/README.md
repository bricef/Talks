# In the beginning there was the function

A ~15-minute live-coded talk introducing programmers to **lambda calculus** and
**functional programming** by building booleans, numbers, and arithmetic from
nothing but one-argument functions.

No slides. Just a REPL and the claim that a single construct — the function — is
enough to express all of computation.

## Files
- **`demo.ts`** — the full demo, sectioned by act, with expected outputs inline.
  Your safety net and oracle; present by typing it live.
- **`CUE-CARD.md`** — one-page presenter card: timings, patter, escape hatches.
- **`APPENDIX-PRED.md`** — deep-dive on the Church predecessor (`PRED`), the one
  lambda worth explaining slowly.
- **`APPENDIX-FOLDR.md`** — what `reduceRight` (`foldr`) looks like with nothing
  but functions; two encodings, and why Church numerals were folds all along.
- **`BRIDGE.md`** — how this demo stacks under the *Building Objects with
  Functions* talk: 9 of its 12 "primitives" are compositions built here, joined
  at Act 4 (`equal`/`cond` → `get-in`).

## Run it
```sh
npx tsx demo.ts      # or: deno run demo.ts
```

The code is deliberately untyped — plain arrow functions, so it reads as clean
lambda calculus and runs as-is. If presenting from a `.ts` file under strict
settings, set `"noImplicitAny": false` or just use the
[TypeScript Playground](https://www.typescriptlang.org/play).

## The arc
1. **The only rule** — one argument per function; currying is the whole structure.
2. **Booleans from nothing** — `TRUE`/`FALSE` as a choice; `if` is just calling it.
3. **Numbers from nothing** — Church numerals; a number is repetition. `MULT` is `compose`.
4. **Logic & decisions** — `ISZERO`/`LEQ`/`EQ`; a predicate turns a number back into a boolean, and `IF`/`AND` make a real decision.
5. **Completing the logic** † — `NOT`/`OR`; `cond` is just nested `IF`.
6. **Pairs & lists** † — `PAIR`/`FIRST`/`REST`/`NIL`/`LIST`; data from nothing, selectors are booleans. Rebuilds the exact 9-primitive core the *Building Objects* talk assumes (see `BRIDGE.md`).
7. **It was FP all along** — map/filter/reduce, composition, immutability.

Acts 5–6 (†) are *Part II — the bridge to Building Objects with Functions*; drop
them to keep the original ~15-minute core.
