# Presenter cue card — *In the beginning there was the function*

**Format:** live-coded REPL / editor. Type it, don't paste — the build-up *is* the drama.
**Total:** ~20 min extended, or ~15 min core (drop the two † acts). **Safety net:** `demo.ts` (runs clean, outputs match comments).

| Time | Act | Type this | The beat |
|------|-----|-----------|----------|
| 0:00–1:15 | **Hook** | *(nothing yet)* | "What's the smallest possible language? No numbers, no `if`, no loops. One thing: functions. Watch me build a number system from nothing." |
| 1:15–3:00 | **1 · The only rule** | `identity`, `konst` | One arg per function. Need two? Return another. Currying is the *only* structural idea. |
| 3:00–5:15 | **2 · Booleans** | `TRUE`, `FALSE`, `IF`, `AND` | A boolean is a *choice between two things*. `if` isn't a keyword — it's calling the boolean. Build `AND` live. |
| 5:15–8:15 | **3 · Numbers** | `ZERO`→`THREE`, `toInt`, `SUCC`, `ADD`, `MULT` | A number is *how many times you do something*. Reveal: "I never defined `5`." Kicker: **multiplication is compose**. |
| 8:15–10:45 | **4 · Logic & decisions** | `ISZERO`, `PRED`, `SUB`, `LEQ`, `EQ` | Booleans meet numbers. A *predicate* turns a number back into a yes/no. Reuse `IF`/`AND` — no new keywords. `IF(LEQ …)` is a real decision. |
| 10:45–13:00 | **5 · Completing the logic** † | `NOT`, `OR`, `classify` | Round out the booleans. `cond` isn't a new primitive — it's `IF` nested in `IF`. `classify` shows a real multi-way branch. |
| 13:00–16:30 | **6 · Pairs & lists** † | `PAIR`, `FIRST`, `REST`, `NIL`, `ISEMPTY`, `LIST` | Data from nothing. A pair hands its two values to a selector *you* choose — and the selectors are our booleans. `LIST(1,2,3)` is just pairs nested right. **Payoff: we've now rebuilt all 9 primitives the *Building Objects* talk assumes.** |
| 16:30–18:15 | **7 · It was FP** | `compose`, `.map` | Name what they saw: functions-as-values, no mutation, composition over control flow. `MULT` *was* `compose`. |
| 18:15–20:00 | **Close** | *(mic down)* | Church, 1930s, before computers. Every FP feature in TS is clothing over what they just watched. |

† **Part II — the bridge to *Building Objects with Functions*.** Drop both to keep the original ~15-min core; then Act 7 follows Act 4 directly. Keep them if the audience will see (or you'll give) the objects talk — they reconstruct its exact 9-primitive foundation. See `BRIDGE.md`.

## The one honesty note (say it once, in Act 3)
`toInt` is the **only** place you touch a real number — it's the decoder ring for *display*. Everything else is pure lambdas. Owning that earns the room's trust.

## Escape hatches
- **Short on time?** Drop the two † acts (Part II) to land the ~15-min core. Within acts: drop `AND` (Act 2), `MULT` (Act 3), `EQ` (Act 4). `ADD` + `LEQ` alone still land both reveals.
- **`PRED` is the danger zone (Act 4).** It's the one lambda nobody will parse live. Say so out loud — *"this is the one weird trick; don't stare, here's the intuition: it rebuilds n and hands back the step before."* Then paste it and move straight to `LEQ`. Don't derive it on the whiteboard.
- **`cond` (Act 5) is a pattern, not a value.** Say it: *"there's no `cond` primitive — it's just `IF` inside `IF`."* One honest footnote if asked: our host (JS) is eager, so a *recursive* cond needs thunked branches; real Lisp is lazy there. Don't rabbit-hole on it live.
- **`NIL`/`ISEMPTY` (Act 6) is the subtle bit.** Don't derive it — state the trick: *"the empty list answers `TRUE` to any probe; a pair answers `FALSE` — that one difference is how we tell them apart."* Then move to traversal.
- **Ahead of time?** Flash the typed `Bool` / `Num` aside: *"the types spell out what a number does"* — `type Num = <T>(f: (x: T) => T) => (x: T) => T`. Don't type `ADD`/`MULT`/`PRED` live (variance rabbit hole).
- **Room is hot?** Before `SUCC`, ask them to guess it. Before `MULT`, ask "what's multiplication if a number is repetition?" Before `ISZERO`, ask "how would you turn a number back into a yes/no?" Before `FIRST`/`REST`, ask "if a pair is a function, what does it *do* with the selector you hand it?"

## Delivery
- Huge font. Clear screen between acts.
- Pre-open `demo.ts` in a second tab as the oracle if a live typo bites.
- Land each payoff line *before* you hit enter on the next block.
