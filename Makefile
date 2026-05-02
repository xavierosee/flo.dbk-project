# Thin wrapper around npm scripts for Linux/macOS convenience.
# Windows developers: use `npm run <target>` directly.
.PHONY: install lint test run help

install: ## Install project dependencies
	npm run install:deps

lint: ## Run linter(s)
	npm run lint

test: ## Run test suite
	npm run test

run: ## Start the application
	npm run start

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'
