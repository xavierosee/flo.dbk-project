# Thin wrapper around bun scripts for Linux/macOS convenience.
# Windows developers: use `bun run <target>` directly.
.PHONY: install lint test run build preview help

install: ## Install project dependencies
	bun install

lint: ## Run linter(s)
	bun run lint

test: ## Run test suite
	bun run test

run: ## Start the dev server
	bun run dev

build: ## Production build (OG images + Vite)
	bun run build

preview: ## Preview the production build
	bun run preview

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'
