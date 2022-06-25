

build: *.ts
	tsc

run: build
	node index.js

clean:
	-rm -if index.js
	-rm -rif src/**/*.js
	-rm -rif src/*.js