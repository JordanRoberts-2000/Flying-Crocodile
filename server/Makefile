test:
	cargo test --test mod --quiet
reset:
	@read -p "Are you sure you want to reset the database? This will drop all data! (y/n): " confirm && \
	if [ "$$confirm" = "y" ]; then \
		diesel database reset; \
	else \
		echo "Database reset canceled."; \
	fi