MAKEFLAGS += --silent

build:
	./scripts/build.sh

start:
	$(MAKE) stop
	$(MAKE) build
	./scripts/start.sh

stop:
	./scripts/stop.sh