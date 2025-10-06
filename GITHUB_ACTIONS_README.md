# GitHub Actions Setup

This repository includes comprehensive GitHub Actions workflows for continuous integration, deployment, and code quality.

## Workflows

### 1. CI/CD (`ci-cd.yml`) - **UNIFIED WORKFLOW**

- **Trigger**: Push to `main`/`develop` branches and pull requests
- **Node versions**: 20.19, 22.12 (Vite 7 compatible)
- **Quality Checks** (runs on all triggers):
  - TypeScript type checking
  - ESLint linting
  - Jest testing
  - Vite build validation
  - Multi-version compatibility testing
- **Deployment** (runs only on main branch):
  - Production build with GitHub Pages configuration
  - Automatic deployment to GitHub Pages
  - Only deploys if all quality checks pass

### 2. Code Quality (`code-quality.yml`)

- **Trigger**: Push to `main`/`develop` branches and pull requests
- **Steps**:
  - Run tests with coverage
  - Upload coverage to Codecov (optional)
  - SonarCloud analysis (optional)

### 3. Dependencies & Security (`dependencies.yml`)

- **Trigger**: Weekly schedule (Mondays) or manual dispatch
- **Steps**:
  - Security audit
  - Check for outdated packages
  - Auto-merge Dependabot PRs (patch/minor updates only)

## Key Benefits of Unified CI/CD

✅ **No Redundancy**: Quality checks run once, deployment is conditional
✅ **Atomic Deployments**: Never deploy without passing tests
✅ **Faster Execution**: No duplicate work between workflows
✅ **Simpler Maintenance**: One workflow file instead of two
✅ **Better Resource Usage**: Efficient use of GitHub Actions minutes

## Workflow Logic

```
Push to any branch → Quality Checks (TypeScript, Lint, Test, Build)
                                    ↓
Push to main branch → Quality Checks → Deployment (if checks pass)
                                    ↓
Pull Request → Quality Checks only (no deployment)
```

## Setup Instructions

### 1. GitHub Pages Deployment

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. Update the `VITE_BASE_PATH` in `deploy.yml` to match your repository name

### 2. Dependabot Configuration

1. Update the `reviewers` and `assignees` in `.github/dependabot.yml` with your GitHub username
2. Dependabot will automatically create PRs for dependency updates

### 3. Optional Integrations

#### Codecov (Code Coverage)

1. Sign up at [codecov.io](https://codecov.io)
2. Add your repository
3. Add `CODECOV_TOKEN` secret to your repository settings

#### SonarCloud (Code Quality)

1. Sign up at [sonarcloud.io](https://sonarcloud.io)
2. Import your repository
3. Add `SONAR_TOKEN` secret to your repository settings
4. Create a `sonar-project.properties` file in your repository root

## Package Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test -- --coverage` - Run tests with coverage
- `pnpm lint` - Run ESLint

## Environment Variables

- `VITE_BASE_PATH` - Base path for deployment (used in GitHub Pages)

## Security

All workflows use the latest versions of actions and follow security best practices:

- Minimal permissions
- Dependency caching
- Frozen lockfile installations
- Audit checks
