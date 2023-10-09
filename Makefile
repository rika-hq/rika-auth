AUTH_PROTO = proto/auth.proto
AUTH_PROTO_TS = $(AUTH_PROTO:proto/auth.proto=proto/auth.ts)

all: proto image

proto: $(AUTH_PROTO_TS)

image:
	docker build -t rika-auth:$(shell node version.js) .

$(AUTH_PROTO_TS): $(AUTH_PROTO)
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
			--ts_proto_out=./ \
			--ts_proto_opt=nestJs=true \
			./proto/auth.proto

clean:
	rm -rf $(AUTH_PROTO_TS)
	docker rmi -f rika-auth:$(shell node version.js)

.PHONY: all clean