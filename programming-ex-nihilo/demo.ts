// ─────────────────────────────────────────────────────────────────────────────
//  In the beginning there was the function.
//
//  A 15-minute live demo: build booleans, numbers, and arithmetic from nothing
//  but one-argument functions — the whole of computation from a single construct.
//
//  Run it:   npx tsx demo.ts      (or: deno run demo.ts)
//  Present:  type it live, act by act. This file is your safety net + oracle.
// ─────────────────────────────────────────────────────────────────────────────

// The decoder ring. The ONLY place in this file that touches a real number or
// string — everything below is pure functions. Kept at the top so the audience
// sees, up front, exactly where we "peek inside" and nowhere else.
const toInt = n => n(x => x + 1)(0);
const show  = b => b("yes")("no");

// ── Act 1 ─ The only rule ────────────────────────────────────────────────────
// A function takes one argument and returns one value. Need two arguments?
// Return another function. That currying is the only structural idea we have.

const identity = x => x;
const konst    = x => y => x;   // take two things, always return the first

console.log("Act 1 — the only rule");
console.log(identity(42));      // 42
console.log(konst(1)(2));       // 1
console.log();

// ── Act 2 ─ Booleans from nothing ────────────────────────────────────────────
// A boolean is just a choice between two things. TRUE picks the first option,
// FALSE picks the second. An `if` isn't a keyword — it's calling the boolean.

const TRUE  = t => f => t;
const FALSE = t => f => f;

const IF  = cond => then => els => cond(then)(els);
const AND = p => q => p(q)(p);   // if p then q else p

console.log("Act 2 — booleans");
console.log(show(TRUE));                     // yes
console.log(show(FALSE));                    // no
console.log(IF(TRUE)("then")("else"));       // then
console.log(show(AND(TRUE)(TRUE)));          // yes
console.log(show(AND(TRUE)(FALSE)));         // no
console.log();

// ── Act 3 ─ Numbers from nothing (the payoff) ────────────────────────────────
// A number is "how many times you do something." ZERO applies f zero times,
// THREE applies it three times. The numbers ARE the repetition.

const ZERO  = f => x => x;
const ONE   = f => x => f(x);
const TWO   = f => x => f(f(x));
const THREE = f => x => f(f(f(x)));

// Arithmetic — with no numbers underneath, only functions plugged into functions.
const SUCC = n => f => x => f(n(f)(x));            // add one
const ADD  = m => n => f => x => m(f)(n(f)(x));    // do m, then do n
const MULT = m => n => f => m(n(f));               // ...just composition

console.log("Act 3 — numbers");
console.log(toInt(THREE));                   // 3
console.log(toInt(SUCC(THREE)));             // 4  — I never defined FOUR
console.log(toInt(ADD(TWO)(THREE)));         // 5  — I never defined FIVE
console.log(toInt(MULT(TWO)(THREE)));        // 6  — multiplication IS compose
console.log();

// ── Act 4 ─ Land it: this is functional programming ──────────────────────────
// Everything above, in idiomatic TS. MULT was literally compose. map/filter/
// reduce are functions-as-values. No statements, only expressions.

const compose = (g, f) => a => g(f(a));

console.log("Act 4 — it was FP all along");
console.log([1, 2, 3].map(x => x * 2));      // [ 2, 4, 6 ]
console.log(compose(x => x + 1, x => x * 2)(10)); // 21
