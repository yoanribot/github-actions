# React + TypeScript + Vite

[![CI/CD](https://github.com/yoanribot/github-actions/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yoanribot/github-actions/actions/workflows/ci-cd.yml)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Github Actions config / Best practices

- Add the GA status badge to the main page of the repo
  [Doc](https://docs.github.com/en/actions/how-tos/monitor-workflows/add-a-status-badge)
- Protect Main/master branch to avoid to merge failing PRs
  - Repo / Settings / branches
  - Create a new rule for the main branch
  - Activate:
    - Require status checks to pass
    - Require branches to be up to date before merging
- Run actions in parallel
- [TODO] Add E2E or integrations tests
  - Playwright
  - Cypress: [Ex](https://youtu.be/sIhm4YOMK6Q?t=2827)
- Cancel previous redundant build
- Use `pnpm install --frozen-lockfile` for better performance (similar to npm ci)
- Check the [Github marketplace](https://github.com/marketplace) for community reusable jobs and actions
- Use secrets and tokens [Ex](https://youtu.be/sIhm4YOMK6Q?t=3514): Good to create config variables per environments

### Examples

#### Cancel previous redundant build

```yml
# Concurrency control to cancel redundant builds
# This prevents multiple CI runs for the same PR/branch, saving resources
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

#### Fetch-depth

`fetch-depth: 0` (Full git history) vs `fetch-depth: 1` (Last commit)

#### When to use `fetch-depth: 0`

**Good Practice ✅**

- Code analysis tools (SonarCloud, CodeClimate) that need commit history
- Semantic versioning tools that analyze commit messages
- Git-based tools that need to compare against previous commits
- Changelog generation from Git history
- Monorepo tools that detect changed packages

**Not Good Practice ❌**

- Basic CI (build, test, lint) — doesn't need history
- Large repositories — significantly slower checkout
- Simple workflows — waste of time and bandwidth
- Most React/Vite projects — rarely need full history

#### Architecture options / Design solution

Option 1: Combined Workflow

```yml
name: CI/CD
jobs:
  test:
    # Multi-version testing
    strategy:
      matrix:
        node-version: ["20.19", "22.12"]

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    # Single version deployment
```

Option 2: Workflow Dependencies

```yml
# deploy.yml (Separate dedicated file)
on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: [main]
```

Option 3: Reusable Workflows

```yml
# .github/workflows/quality-checks.yml (reusable)
# .github/workflows/ci.yml (calls quality-checks)
# .github/workflows/deploy.yml (calls quality-checks)
```
