.PHONY: install lint test run

install: ## Install project dependencies
	# TODO: replace with stack-specific install command
	npm install

lint: ## Run linter(s)
	# TODO: replace with stack-specific lint command (e.g. eslint, ruff, golangci-lint)
	@echo "No linter configured yet" && exit 0

test: ## Run test suite
	# TODO: replace with stack-specific test command (e.g. jest, pytest, go test)
	@echo "No tests configured yet" && exit 0

run: ## Start the application
	# TODO: replace with stack-specific run command
	@echo "No run target configured yet" && exit 0

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'
