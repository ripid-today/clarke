---
name: write-college-essays
description: >
  Expert framework for writing and assessing college and graduate admission essays
  (personal statements, MBA essays, scholarship essays). Use when the user wants to
  draft, revise, assess, or critique any admission essay. Includes: narrative anatomy,
  5-dimension assessment rubric, sentence craft techniques (rhythm, tempo, word choice),
  opening mastery, prompt decoding, and two writing style modes (Style A: narrative/
  immersive; Style B: strategic/forward-looking). Contains a permanent user profile
  for NTU IMBA application context. When invoked, load 01-essay-anatomy.md and
  02-assessment-framework.md first; load others on demand. Use even if the user has
  an existing essay they want reviewed rather than written from scratch.
user-invokable: false
---

# write-college-essays

## Quick Start

| Always Load | Load When Drafting or Revising | Load for NTU IMBA Work |
|---|---|---|
| `references/01-essay-anatomy.md` | `references/03-sentence-craft.md` | `references/08-user-profile.md` |
| `references/02-assessment-framework.md` | `references/04-opening-techniques.md` | |
| | `references/05-narrative-techniques.md` | |
| | `references/06-prompt-decoding.md` | |
| | `references/07-writing-styles.md` | |

---

## Core Principle

The best admission essays are not credential lists; they are time-bounded stories of growth told through specific detail, genuine tension, and honest reflection. Every word must earn its place. An essay that could have been written by a thousand applicants does not help the reader understand the one who wrote it.

---

## The 5 Assessment Dimensions

Score each dimension 1–5. **20–25 = strong. 15–19 = needs revision. Below 15 = rethink the approach.**

| Dimension | Question | Fail Signal | Pass Signal |
|---|---|---|---|
| **Authenticity** | Could only you write this? | "I have always been passionate about..." | A specific moment no one else could claim |
| **Specificity** | Are claims backed by evidence? | "I learned leadership" (assertion) | Concrete detail that proves the claim |
| **Arc** | Do we know you better at the end? | No change; list of accomplishments | Visible shift in thinking or belief |
| **Voice** | Does this sound like a human? | Jargon, passive voice, adverb overload | Natural rhythm, strong verbs, varied sentence length |
| **Relevance** | Does it answer the actual question? | Answering a question you wished they asked | Every paragraph serves the prompt's core ask |

---

## Chain-of-Thought Examples (from reading materials)

These are the examples to use when demonstrating how specific detail creates resonance:

**Sidd B.'s red glasses:** One small object becomes a symbol of personal evolution — the glasses track growth through the entire essay. Lesson: specificity beats breadth. A single concrete anchor carries an entire essay further than a list of accomplishments.

**Nisha D.'s Bharatanatyam dance:** One through-line (dance discipline) connects childhood, college, career, and service without breaking. Lesson: a single organizing metaphor creates cohesion across 800 words; the reader always knows where they are.

**Grace M.'s ripple effects:** Family fostering experience as a lens for understanding investment impact. Lesson: the personal and the professional can mirror each other when the metaphor is precise and not forced.

---

## Style Mode Instructions

- **Style A (Narrative/Immersive):** User requests "Style A" — load `references/07-writing-styles.md`, Section A.
- **Style B (Strategic/Forward-Looking):** User requests "Style B" — load `references/07-writing-styles.md`, Section B.
- **Hybrid:** User requests "open Style A, close Style B" — apply accordingly.
- **Default:** If the user does not specify a style, ask before drafting.

---

## Process Steps

Follow these steps in order for any draft or revision task:

1. **Decode the prompt** — load `references/06-prompt-decoding.md`; identify the three layers (surface, deeper, risk)
2. **Identify the story or experience** — what specific moment or event will anchor the essay?
3. **Map the arc** — Before → During → After; complete the sentence: "I was X. Then Y happened. Now I understand Z."
4. **Choose writing style** — ask if not specified (Style A or Style B or Hybrid)
5. **Draft** — use techniques from `references/03-sentence-craft.md`, `04-opening-techniques.md`, `05-narrative-techniques.md`
6. **Self-assess** — score each of the 5 dimensions using `references/02-assessment-framework.md`
7. **Revise** — focus on: opening move (banned or strong?), verbs (replace adverbs), sentence rhythm (vary length), closing (lands insight without announcing it)

---

## Output

For each essay task, deliver:

- **Assessment:** Score for each of the 5 dimensions (1–5), with specific evidence from the essay and targeted revision notes
- **Draft or revision:** Full essay text at the requested word count, following the chosen style mode (A, B, or Hybrid)
- **Inline notes:** Callouts identifying weak openings, passive constructions, adverb overuse, and arc gaps — each paired with a concrete fix

---

## What This Skill Does Not Contain

This skill is general-purpose. It contains no NTU-specific prompts. The user brings their specific essay prompts as context when invoking the skill. The user profile in `references/08-user-profile.md` provides personal background and essay-specific constraints for NTU IMBA applications.
