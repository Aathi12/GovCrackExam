# Phase 35 — Difficulty Classification Methodology

## Overview
This document outlines the deterministic, rule-based methodology used to assign a practice difficulty label (`Easy`, `Medium`, or `Hard`) to all 228 verified questions in the GovCrackExam question bank.

**Disclaimer:** Difficulty labels are project-level practice classifications and are not official SSC CGL difficulty ratings.

## Classification Rules by Topic

### 1. Dictionary Order
- **Easy**: Words diverge early (1st or 2nd letter) and are short.
- **Medium**: Words diverge at the 3rd or 4th letter.
- **Hard**: Words diverge late (5th letter or beyond), or many words share identical long prefixes (e.g., 6+ words with the same 4-letter prefix).

### 2. Syllogism
- **Easy**: 2 statements, 2 conclusions. Direct affirmative/negative relationships (All A are B, No A is C).
- **Medium**: 3 statements, or conclusions involving 'Some not' or possibilities.
- **Hard**: 4+ statements, complex negations, or nested possibility structures.

### 3. Blood Relations
- **Easy**: Direct one-step statements (e.g., A is the father of B).
- **Medium**: Coded relationships with 2-3 steps (e.g., A + B - C).
- **Hard**: Coded relationships with 4+ steps (e.g., A + B - C * D / E), or paragraph-style family tree descriptions with ambiguous pronouns.

### 4. Mathematical Operations
- **Easy**: Simple sign interchanges (e.g., + means -, * means /) with < 4 operations.
- **Medium**: Sign and number interchanges simultaneously, or equation balancing with 4-5 operations.
- **Hard**: Finding which combination of signs balances a long equation containing large numbers and complex fractions/decimals.

### 5. Coded Language
- **Easy**: Direct letter-to-letter offset (e.g., +1, -1) or direct digit mapping.
- **Medium**: Variable letter offsets, reversed strings, or cross-pattern matching.
- **Hard**: Complex mathematical operations on positional values (e.g., sum of reverse alphabetical positions * number of vowels).

### 6. Letter-cluster Analogy / Series
- **Easy**: Constant step size across the series (e.g., +2, +2, +2).
- **Medium**: Variable but linear step sizes (e.g., +1, +2, +3), or reversing cluster halves.
- **Hard**: Alternating series, complex intertwined logic, or non-linear jumps.

### 7. Number/Figure Series
- **Easy**: Simple arithmetic progression (constant addition/subtraction).
- **Medium**: Squares, cubes, prime numbers, or two-tier differences.
- **Hard**: Three-tier differences, alternating mathematical operations (e.g., *2 + 1, *2 - 2), or intertwined dual series.

### 8. Classification (Odd One Out)
- **Easy**: Obvious categorical outliers (e.g., 3 animals, 1 plant).
- **Medium**: Shared numerical properties (e.g., 3 multiples of 7).
- **Hard**: Complex mathematical relationship between digit sums, squares, or deep logical properties.

### 9. Analogy (Word/Number)
- **Easy**: Common knowledge relationships (e.g., Country:Capital).
- **Medium**: Two-step mathematical operations (e.g., x -> x^2 + 2) or uncommon vocabulary.
- **Hard**: Three-step mathematical operations (e.g., x -> (x/2)^3 - 1) or highly obscure scientific/historical facts.

## Application
Every question is evaluated against its topic's specific criteria. A script categorizes the existing 228 baseline questions without mutating any existing fields.
