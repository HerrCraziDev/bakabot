BUILD_DIR=build
NAME=bakabot


FORCE:

build: FORCE
	tsc

run: build
	node $(BUILD_DIR)/index.js

deploy: build
	-scp -r $(BUILD_DIR)/* $(TARGET):~/bakabot/
	-scp -r package.json $(TARGET):~/bakabot/
	-scp -r data $(BUILD_DIR):~/bakabot/


clean:
	-rm -if index.js
	-rm -rif src/**/*.js
	-rm -rif src/*.js
	-rm -rif $(BUILD_DIR)/*
