# Project Guidelines

## Branch Rules

- **Never commit directly to `main`.**
- Branch naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`
- One concern per branch; keep branches short-lived.

## Commit Format

Conventional Commits are enforced by commitlint:

```
type(scope): short description

[optional body]

[optional footer — e.g. Closes #123]
```

Allowed types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `ci`, `perf`, `revert`

Rules:
- Subject in **lower-case**, no trailing period
- Max header length: 100 characters
- Body lines wrapped at 72 characters

## Pull Request Rules

- Reference the relevant issue in the PR description (`Closes #N` or `Ref #N`).
- Keep diffs **under 400 lines** of meaningful change per PR; split larger work.
- PR title must follow the same conventional commit format as commit messages (checked by CI).
- All CI checks must pass before merging.

## Commands

npm scripts are the canonical cross-platform interface. The Makefile is a thin
wrapper for Linux/macOS convenience — it just delegates to npm scripts.

| npm script (all platforms) | make alias (Linux/macOS) | Purpose |
|---|---|---|
| `npm run install:deps` | `make install` | Install dependencies |
| `npm run lint` | `make lint` | Run linter(s) |
| `npm run test` | `make test` | Run test suite |
| `npm run start` | `make run` | Start the application |

**Windows developers:** use `npm run <script>` directly — `make` is not required.
**Linux/macOS developers:** `make <target>` or `npm run <script>` both work.

## Testing

- Write tests for every new function or module.
- Do not mark a task complete if `make test` fails.
- Tests live alongside source files or in a `tests/` directory at the project root.

## Stack

Stack TBD — update this section and the `Makefile` targets once decided.

## gstack

Use the `/browse` skill from gstack for **all web browsing**. Never use
`mcp__claude-in-chrome__*` tools.

Available gstack skills:

| Skill | Purpose |
|---|---|
| `/office-hours` | General guidance and Q&A session |
| `/plan-ceo-review` | Review plan from CEO perspective |
| `/plan-eng-review` | Review plan from engineering perspective |
| `/plan-design-review` | Review plan from design perspective |
| `/design-consultation` | Design consultation session |
| `/design-shotgun` | Rapid parallel design exploration |
| `/design-html` | Generate HTML/CSS designs |
| `/review` | Code review |
| `/ship` | Ship a feature end-to-end |
| `/land-and-deploy` | Land changes and deploy |
| `/canary` | Canary deploy and monitoring |
| `/benchmark` | Run performance benchmarks |
| `/browse` | Headless browser — use this for ALL web browsing |
| `/connect-chrome` | Connect to a running Chrome instance |
| `/qa` | Full QA pass (plan + execute) |
| `/qa-only` | Execute QA without planning |
| `/design-review` | Review designs |
| `/setup-browser-cookies` | Configure browser auth cookies |
| `/setup-deploy` | Configure deployment pipeline |
| `/setup-gbrain` | Configure gbrain integration |
| `/retro` | Run a retrospective |
| `/investigate` | Deep investigation / root cause analysis |
| `/document-release` | Document a release |
| `/codex` | Codex-style autonomous coding |
| `/cso` | Chief Strategy Officer review |
| `/autoplan` | Auto-generate an implementation plan |
| `/plan-devex-review` | Review plan from DevEx perspective |
| `/devex-review` | Developer experience review |
| `/careful` | Extra-careful mode for risky changes |
| `/freeze` | Freeze a branch from further changes |
| `/guard` | Guard against regressions |
| `/unfreeze` | Unfreeze a frozen branch |
| `/gstack-upgrade` | Upgrade gstack itself |
| `/learn` | Learn about a codebase or topic |

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
