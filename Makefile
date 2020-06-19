.PHONY: build
# build all
build: build-functions build-client

# backend
.PHONY: build-api
build-api:
	env GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ./api/bin/numbers ./api/main.go

# for netlify functions
.PHONY: build-functions
build-functions: clean build-api
	mkdir -p functions
	cp ./api/bin/numbers functions

.PHONY: clean
clean:
	rm -rf ./api/bin
	rm -rf ./functions

.PHONY: build-client
build-client:
	npm run-script build

# dev
.PHONY: run-dev-server
run-dev-server:
	go run api/main.go --port 8000

.PHONY: run-client
run-client:
	npm start

# tests
.PHONY: test-api
test-api:
	go test ./...

# test setup
.PHONY: setup-tests
setup-tests:
	./setup-dev.sh

.PHONY: cleanup-tests
cleanup-tests:
	aws s3 rb s3://${S3_TEST_BUCKET} --force
