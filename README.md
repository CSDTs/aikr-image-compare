# Joe's Lunch — AI Image Compare (`aikr-image-compare`)

**Joe's Lunch** is a client-side, in-browser machine-learning teaching tool built by [CSDT](https://csdt.org) (Culturally Situated Design Tools). It walks a student through a three-step wizard — **Select Images** (Group A vs Group B) → **Train Model** → **Evaluate** — that trains an image classifier right in the browser using [TensorFlow.js](https://www.tensorflow.org/js) transfer learning on top of MobileNet.

Everything, including model training, runs on the visitor's own machine. There is **no backend, no authentication, and no database**. The bundled demo dataset is a "homecooked vs. factorymade" food-image set — that's where the "Joe's Lunch" name comes from.

**Stack:** Vite 4 · React 18 · TypeScript 5 · Redux Toolkit · Bootstrap / react-bootstrap · SCSS / CSS Modules · TensorFlow.js

---

## Quick start

**Prerequisites:** [Node.js](https://nodejs.org) 20 LTS recommended (nothing is pinned in-repo), which includes npm, plus [git](https://git-scm.com).

```bash
git clone git@github.com:CSDTs/aikr-image-compare.git
cd aikr-image-compare
npm install
npm run dev
```

Then open **http://localhost:3000** — you should see the wizard.

## Scripts

| Command           | What it does                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server on http://localhost:3000 (live-reloads on edit).                                                |
| `npm run build`   | Type-check then build for production (`tsc && vite build`) → outputs to `dist/`.                                          |
| `npm run preview` | Serve the built `dist/` locally to preview a production build.                                                            |
| `npm run lint`    | ⚠️ Currently **broken** — the script and ESLint deps exist, but no ESLint config is committed, so it errors. Known issue. |

> There is **no test suite**. `package.json` has no `test` script, so `npm test` does not work. (A single orphan test file, `src/utils/__tests__/classNames.test.ts`, exists but no runner is wired up under Vite.)

## Configuration

There are **no environment variables** and no `.env` file to create. Runtime behavior is tweaked via URL query-string parameters, parsed in `src/app.tsx`:

- `?SHOW_HELP` — show/hide the in-wizard help affordance.
- `?SHOW_DOWNLOAD` — show/hide the download affordance (**defaults to on**).

A value of `1` or `true` enables a flag, e.g. `http://localhost:3000/?SHOW_HELP=true`.

## Project structure

```text
src/
  index.tsx            App entry point; mounts app.tsx
  app.tsx              The 3-step wizard; SHOW_HELP/SHOW_DOWNLOAD params + CORS proxy constant
  components/          21 React components (image selection, classifier UI, evaluator, predictions, …)
  lib/classifier/      TensorFlow.js training/prediction code (incl. loadPretrainedModel.ts)
  lib/dropzone/        Drag-and-drop file handling
  data/                Bundled datasets and training images
  assets/joeslunch/    The demo "homecooked vs. factorymade" dataset
  utils/               Shared helpers
  styles/              One CSS Module per component (*.module.css)
```

## External runtime dependencies

The app needs network access to actually classify images:

- **MobileNet model** is fetched live from `https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json` (`src/lib/classifier/loadPretrainedModel.ts`).
- A hard-coded **public Heroku CORS proxy**, `https://fast-cove-30289.herokuapp.com/` (`src/app.tsx`), is used to fetch remote images cross-origin. Free Heroku dynos are frequently retired — if image loading fails mysteriously, a dead proxy is the most likely cause.

## Deployment

Deployment is **manual** — there is no CI/CD pipeline:

1. `npm run build` locally to produce `dist/`.
2. Add the build output into the [`cultural-curriculum-workbooks`](https://github.com/CSDTs) repo.
3. That is then added onto the CSDT platform manually.

## Contact

For setup, access, or onboarding questions, email the CSDT team at **help@generativejustice.org**.
