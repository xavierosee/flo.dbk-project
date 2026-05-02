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
