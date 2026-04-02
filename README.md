# Add to 20

React (JSX) lesson: each **round** is a **shuffled set of four** prompts. Every prompt uses a pair **`(num1, num2)`** with **sum strictly between 10 and 20** (inclusive **11–20**), integer addends in **1…15**. The learner adjusts a **stepper** (**1–20**) and taps **Check**. On match: **canvas-confetti**, reveal the blank in the equation line, fade the input row, **“Great job!”**, then advance after **4s**. Wrong answers apply a **shake** on **Check**.

**Live site:** [https://content-interactives.github.io/add_to_20](https://content-interactives.github.io/add_to_20)

Standards and curriculum: [Standards.md](Standards.md).

---

## Stack

| Layer | Notes |
|--------|--------|
| Build | Vite 7, `@vitejs/plugin-react` |
| UI | React 19 (`.jsx` only—**not** TypeScript) |
| Styling | Tailwind 3, `AddTo20.css` (e.g. `shake`), `fade.css` from `ui/reused-animations/` |
| Effects | `canvas-confetti` |
| Deploy | `gh-pages -d dist`, `predeploy` → `vite build` |

---

## Layout

```
vite.config.js          # base: '/add_to_20/'
src/
  main.jsx → App.jsx → components/AddTo20.jsx
  components/AddTo20.css
  components/ui/reused-ui/Container.jsx  # header, optional sound/reset
```

---

## Data model

`generateEquationsSet` builds **four objects** (independent random pairs):

| `type`           | Display idea              | `answer` field |
|------------------|---------------------------|----------------|
| `missing-first`  | `_ + num2 = sum`         | `num1`         |
| `missing-second` | `num1 + _ = sum`         | `num2`         |
| `missing-sum`    | `num1 + num2 = _`        | `sum`          |
| `word-problem`   | `num1 more than num2 is _` | `sum` (= num1 + num2) |

**Pair generation:** loop until **`num1 + num2`** is in **(10, 20]** (i.e. **11–20**). Each addend is **`Math.floor(Math.random() * 15) + 1`** → **1…15**.

The four items are **Fisher–Yates shuffled**; **`currentEquationIndex`** walks **0 → 3**, then **`generateEquationsSet`** runs again for a new set.

---

## Interaction flow

- **`check`:** if **`input === equations[currentEquationIndex].answer`**, sets **`isWaitingForNext`**, **`showAnswerInEquation`**, **`inputSectionFadingOut`**, confetti, **`setTimeout` 500 ms** → **`showSuccessMessage`**, **`setTimeout` 4000 ms** → **`nextEquation()`** (both timers start at submit—total delay to advance is **4 s** from click, not 4.5 s).
- **`nextEquation`:** increments index or regenerates; resets **`input`** to **1** and clears animation flags.
- Stepper capped **[1, 20]**; correct answers for this generator always lie in **1…15** for addends and **11…20** for sums, so the upper bound is loose but safe.

---

## `Container`

- **`showSoundButton={true}`** with **no `onSound`** — speaker UI is inert unless wired.
- **`showResetButton={false}`**.

---

## `vite.config.js`

**`base: '/add_to_20/'`** must match the GitHub Pages repo path.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | `dist/` |
| `npm run preview` | Preview build |
| `npm run lint` | ESLint |
| `npm run deploy` | Build + gh-pages |

---

## Embedding

- Spacer **`div`** with **`h-[124px]`** reserves bottom space for the fixed input/success region.
- No LMS / `postMessage` API.

---

## Maintenance

- **`useRef`** is imported in `AddTo20.jsx` but **unused**—remove or use for timeout cleanup on unmount.
- **`renderCurrentEquation`** redefines **`textSize` / `blankStyle`** locals that duplicate values from **`generateEquationsSet`** (harmless dead code in the callback body).
