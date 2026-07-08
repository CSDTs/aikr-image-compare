# Joe's Lunch — AI Image Compare (`aikr-image-compare`)

**Joe's Lunch** is a client-side, in-browser machine-learning teaching tool built by [CSDT](https://csdt.org) (Culturally Situated Design Tools). It walks a student through a three-step wizard — **Select Images** (Group A vs Group B) → **Train Model** → **Evaluate** — that trains an image classifier right in the browser using [TensorFlow.js](https://www.tensorflow.org/js) transfer learning on top of MobileNet.

Everything, including model training, runs on the visitor's own machine. There is **no backend, no authentication, and no database**. The bundled demo dataset is a "homecooked vs. factorymade" food-image set — that's where the "Joe's Lunch" name comes from.

**Stack:** Vite 4 · React 18 · TypeScript 5 · Bootstrap / react-bootstrap · CSS Modules · TensorFlow.js

---

## Quick start

**Prerequisites:** [Node.js](https://nodejs.org) 20 LTS recommended (nothing is pinned in-repo), [pnpm](https://pnpm.io) (this project's package manager — pinned to `11.6.0` via `package.json`'s `packageManager` field; enable it with `corepack enable`), plus [git](https://git-scm.com).

```bash
git clone git@github.com:CSDTs/aikr-image-compare.git
cd aikr-image-compare
pnpm install
pnpm dev
```

Then open **http://localhost:3000** — you should see the wizard.

## Scripts

| Command            | What it does                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`         | Start the Vite dev server on http://localhost:3000 (live-reloads on edit).                                                |
| `pnpm build`       | Type-check then build for production (`tsc && vite build`) → outputs to `dist/`.                                          |
| `pnpm preview`     | Serve the built `dist/` locally to preview a production build.                                                            |
| `pnpm lint`        | Runs ESLint (`.eslintrc.cjs`). The codebase has a number of pre-existing style warnings/errors it does not yet pass cleanly, but the config itself resolves and runs. |

> There is **no test suite**. `package.json` has no `test` script, so `pnpm test` does not work, and there are no test files in the repo.

## Configuration

There are **no environment variables** and no `.env` file to create — `pnpm install` then `pnpm dev` is all you need, and the app has no runtime configuration knobs. (An earlier version read `?SHOW_HELP` / `?SHOW_DOWNLOAD` URL query-string flags in `src/app.tsx`, but that parsing — and the download feature itself — was removed during modernization; `src/app.tsx` no longer reads the query string.)

The one build-time exception: `vite.config.ts` reads an optional `VITE_BASE` variable to override the app's base path (defaults to `./`), relevant only when building for a non-root deployment path.

## Project structure

```text
src/
  index.tsx            App entry; wraps app.tsx in SelectionProvider and mounts it
  app.tsx              The 3-step wizard; reads dataset config from data/datasets.ts
  components/          17 React components (image selection, classifier UI, evaluator, predictions, …)
  context/             SelectionContext — image-selection state shared across the wizard
  hooks/               Custom hooks (e.g. useResetOnChange)
  lib/classifier/      TensorFlow.js training/prediction code (incl. loadPretrainedModel.ts)
  lib/dropzone/        Drag-and-drop file handling
  data/                Bundled datasets and training images
  assets/joeslunch/    The demo "homecooked vs. factorymade" dataset
  utils/               Shared helpers
  styles/              CSS Modules (*.module.css)
```

## Runtime model (bundled)

The app has **no external runtime dependencies** — it classifies fully offline once installed. The pretrained MobileNet model is bundled in the repo at `public/models/mobilenet_v1_0.25_224/` and loaded from a same-origin path (`src/lib/classifier/loadPretrainedModel.ts`); it is no longer fetched from Google's servers.

## Deployment

Deployment is **manual** — there is no CI/CD pipeline:

1. `pnpm build` locally to produce `dist/`.
2. Add the build output into the [`cultural-curriculum-workbooks`](https://github.com/CSDTs) repo.
3. That is then added onto the CSDT platform manually.

## Contact

For setup, access, or onboarding questions, email the CSDT team at **help@generativejustice.org**.
