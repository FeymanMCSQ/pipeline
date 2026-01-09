// // generator/bandDescriptions.ts

// export const BAND_DESCRIPTIONS: Record<string, string> = {
//   '200_300': `
// ELO 200 — Pre-Wood (Micro-Intuition)
// - One-bit questions (Yes/No, This/That).
// - Ultra-guided, extremely short.
// - Recognition only.
// - Heavy scaffolding, picture-friendly.

// ELO 300 — Bridge Tier
// - Tiny MCQs, vocabulary-focused.
// - Recognise simple structures.
// - Light scaffolding, definition recall.
//   `,

//   '300_400': `
// ELO 300–400 — Transition into Wood
// - Basic MCQs, small conceptual steps.
// - Definitions, simple statements.
// - Still guided but starting formal structure.

// ELO 400 — Wood Tier
// - Short, low-friction MCQs.
// - Identify theorem names or factual statements.
// - This is the entry point to the main ladder.
//   `,

//   '400_600': `
// 400–600 Recognition & Manipulation
// - One-step formula recall.
// - Simple substitutions.
// - Early proficiency, small wins.
//   `,

//   '600_800': `
// 600–800 Procedural Repetition
// - Linear multi-step routines.
// - Fluency building.
// - Predictable structure.
//   `,

//   '800_1000': `
// 800–1000 Controlled Application
// - Apply standard methods in familiar contexts.
// - Problems have clear structure and limited complexity.
// - Requires choosing the right basic procedure, then executing it.
// `,

//   '1000_1200': `
// 1000–1200 Procedural Competence
// - Execute multi-step procedures reliably.
// - Steps are known and well-defined.
// - Minimal conceptual ambiguity.
// - Problems cue a familiar method but require careful execution.
// `,

//   '1200_1400': `
// 1200–1400 Structured Reasoning
// - Apply multiple rules in context.
// - Set-up correctness becomes essential.
//   `,

//   '1400_1600': `
// 1400–1600 Conceptual Integration
// - Choose the correct theorem/tool.
// - Cross-topic logical connection.
//   `,

//   '1600_1800': `
// 1600–1800 Analytic Synthesis
// - Semi-open questions.
// - Students must pick method + justify.
//   `,

//   '1800_1900': `
// 1800–1900 Adaptive Expertise
// - Open-ended, minimal scaffolding.
// - Strategy-first, elegant reasoning.
//   `,
// };

// generator/bandDescriptions.ts

export const BAND_DESCRIPTIONS: Record<string, string> = {
  '200_300': `
ELO 200–300 — Pre-Wood (Micro-Intuition)

Cognitive profile:
- Recognition only. No real execution.
- One-bit decisions.

Question structure:
- Yes/No, This/That, or tiny MCQs.
- Often visual or verbal.
- Extremely short prompts.

Triggers:
- Fully explicit.
- Question literally tells you what is being asked.

Moves:
- Exactly 1 micro-move.
- No algebra, no chaining.

Representation:
- Given directly.
- No basis choice, no conversion.

Must avoid:
- Any calculation beyond inspection.
- Any need to recall formulas.
`,

  '300_400': `
ELO 300–400 — Bridge into Formal Thinking

Cognitive profile:
- Vocabulary + simple structure recognition.
- First contact with formal symbols.

Question structure:
- Small MCQs or short-answer.
- Single concept per question.

Triggers:
- Explicit, but slightly less hand-holding.
- Definitions are referenced, not explained.

Moves:
- 1 clear move.
- Still no chaining.

Representation:
- Fully specified.
- Symbols introduced gently.

Must avoid:
- Multi-step reasoning.
- Ambiguous interpretation.
`,

  '400_500': `
ELO 400–500 — Early Wood (Recognition & Manipulation)

Cognitive profile:
- Can recall and apply a known rule once.

Question structure:
- Short free-response or MCQs.
- One-step computation or identification.

Triggers:
- Explicit (e.g. “normalize”, “compute probability”).

Moves:
- Exactly 1 archetype.
- No setup decisions.

Representation:
- Given basis and representation.
- No conversion required.

Must avoid:
- Any choice between methods.
- Any hidden interpretation.
`,

  '500_600': `
ELO 500–600 — Confident Single-Step Execution

Cognitive profile:
- Executes simple procedures reliably.

Question structure:
- One-step formulas with light algebra.
- Still clean and guided.

Triggers:
- Explicit, but may require recalling which formula applies.

Moves:
- 1 archetype, possibly with trivial algebra.

Representation:
- Given.
- No basis or representation choice.

Must avoid:
- Chaining multiple archetypes.
- Implicit method selection.
`,

  '600_700': `
ELO 600–700 — Early Procedural Fluency

Cognitive profile:
- Comfortable with basic quantum procedures.

Question structure:
- Short problems with 1–2 steps.
- Algebra no longer trivial but still routine.

Triggers:
- Explicit (“find ⟨A⟩”, “compute probability”).

Moves:
- 1–2 archetypes.
- Chain is obvious and safe.

Representation:
- Given explicitly.
- No need to choose between representations.

Must avoid:
- Ambiguity in setup.
- Representation switching.
`,

  '700_800': `
ELO 700–800 — Procedural Repetition

Cognitive profile:
- Can repeat known routines across contexts.

Question structure:
- Multi-step but linear.
- Same method applied start to finish.

Triggers:
- Explicit or strongly hinted.

Moves:
- 2 archetypes in a fixed order.

Representation:
- Given.
- Conversion only if explicitly requested.

Must avoid:
- Competing solution paths.
- Setup ambiguity.
`,

  '800_900': `
ELO 800–900 — Controlled Application (Low Ambiguity)

Cognitive profile:
- Begins selecting between a small set of known methods.

Question structure:
- Familiar context with slight variation.
- Still feels “textbook-like”.

Triggers:
- Method hinted but not named.

Moves:
- 2–3 archetypes.
- Chaining is required but obvious.

Representation:
- Mostly given.
- One light conversion may be required.

Must avoid:
- Multiple equally plausible starting moves.
- Hidden interpretation traps.
`,

  '900_1000': `
ELO 900–1000 — Controlled Application (High Reliability)

Cognitive profile:
- Reliable execution under mild ambiguity.

Question structure:
- Less scaffolding.
- Cleaner statement, fewer hints.

Triggers:
- Not explicit; must be inferred from context.

Moves:
- 3 archetypes.
- Wrong move wastes time but is recoverable.

Representation:
- Given, but solver may need to translate.

Must avoid:
- Heavy synthesis.
- Open-ended interpretation.
`,

  '1000_1100': `
ELO 1000–1100 — Procedural Competence

Cognitive profile:
- Comfortable choosing the correct procedure without being told.

Question structure:
- Real exam-style wording.
- No explicit “do X” instruction.

Triggers:
- Implicit but unambiguous.

Moves:
- 3 archetypes in sequence.
- Setup matters.

Representation:
- May require choosing or converting representation.
- Wrong choice causes inefficiency.

Must avoid:
- Fully open-ended questions.
- Cross-chapter synthesis.
`,

  '1100_1200': `
ELO 1100–1200 — Robust Setup & Execution

Cognitive profile:
- Can handle ambiguity in setup.
- Understands what matters and what doesn’t.

Question structure:
- Messier wording.
- Irrelevant information may be present.

Triggers:
- Implicit.
- Multiple plausible methods exist.

Moves:
- 3–4 archetypes.
- Wrong initial framing leads to dead-end.

Representation:
- Representation choice affects tractability.

Must avoid:
- Long conceptual essays.
- Novel theorem invention.
`,

  '1200_1300': `
ELO 1200–1300 — Structured Reasoning

Cognitive profile:
- Setup is half the problem.
- Solver must plan before executing.

Question structure:
- Realistic exam problems.
- Requires translation from words → math.

Triggers:
- Implicit and overlapping.

Moves:
- 4 archetypes.
- Chaining is non-trivial.

Representation:
- Must choose representation deliberately.

Must avoid:
- Fully open-ended exploration.
`,

  '1300_1400': `
ELO 1300–1400 — Pre-Synthesis Reasoning

Cognitive profile:
- Can integrate multiple ideas coherently.

Question structure:
- Minimal guidance.
- Requires justification of approach.

Triggers:
- Ambiguous.
- Several viable paths, only one efficient.

Moves:
- 4–5 archetypes.
- Errors are costly.

Representation:
- Representation choice is critical.

Must avoid:
- Research-level novelty.
`,

  '1400_1500': `
ELO 1400–1500 — Conceptual Integration

Cognitive profile:
- Chooses tools based on structure, not habit.

Question structure:
- Semi-open.
- “Explain why” appears naturally.

Triggers:
- High ambiguity.

Moves:
- 5 archetypes.
- Strategy-first thinking.

Representation:
- Solver decides representation.

Must avoid:
- Complete lack of constraints.
`,

  '1500_1600': `
ELO 1500–1600 — Advanced Integration

Cognitive profile:
- Independent reasoning under pressure.

Question structure:
- Exam-hard synthesis problems.
- Little to no scaffolding.

Triggers:
- Must be inferred from deep structure.

Moves:
- 5+ archetypes.
- Requires justification and compression.

Representation:
- Strategic choice essential.

Must avoid:
- Research-level originality.
`,
};
