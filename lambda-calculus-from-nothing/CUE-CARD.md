# Presenter cue card — *In the beginning there was the function*

**Format:** live-coded REPL / editor. Type it, don't paste — the build-up *is* the drama.
**Total:** ~15 min. **Safety net:** `demo.ts` (runs clean, outputs match comments).

| Time | Act | Type this | The beat |
|------|-----|-----------|----------|
| 0:00–1:30 | **Hook** | *(nothing yet)* | "What's the smallest possible language? No numbers, no `if`, no loops. One thing: functions. Watch me build a number system from nothing." |
| 1:30–4:00 | **1 · The only rule** | `identity`, `konst` | One arg per function. Need two? Return another. Currying is the *only* structural idea. |
| 4:00–7:00 | **2 · Booleans** | `TRUE`, `FALSE`, `IF`, `AND` | A boolean is a *choice between two things*. `if` isn't a keyword — it's calling the boolean. Build `AND` live. |
| 7:00–11:30 | **3 · Numbers** | `ZERO`→`THREE`, `toInt`, `SUCC`, `ADD`, `MULT` | A number is *how many times you do something*. Reveal: "I never defined `5`." Kicker: **multiplication is compose**. |
| 11:30–14:00 | **4 · It was FP** | `compose`, `.map` | Name what they saw: functions-as-values, no mutation, composition over control flow. `MULT` *was* `compose`. |
| 14:00–15:00 | **Close** | *(mic down)* | Church, 1930s, before computers. Every FP feature in TS is clothing over what they just watched. |

## The one honesty note (say it once, in Act 3)
`toInt` is the **only** place you touch a real number — it's the decoder ring for *display*. Everything else is pure lambdas. Owning that earns the room's trust.

## Escape hatches
- **Short on time?** Drop `AND` (Act 2) and `MULT` (Act 3). `ADD` alone still lands the reveal.
- **Ahead of time?** Flash the typed `Bool` / `Num` aside: *"the types spell out what a number does"* — `type Num = <T>(f: (x: T) => T) => (x: T) => T`. Don't type `ADD`/`MULT` live (variance rabbit hole).
- **Room is hot?** Before writing `SUCC`, ask them to guess it. Before `MULT`, ask "what's multiplication if a number is repetition?"

## Delivery
- Huge font. Clear screen between acts.
- Pre-open `demo.ts` in a second tab as the oracle if a live typo bites.
- Land each payoff line *before* you hit enter on the next block.
