# if got error "3221225781" need to run "npm install -g grpc-tools@1.11.3"
# if got "bad interpreter" run "sed -i -e 's/\r$//' ./gen.sh"

#!/bin/bash

grpc_tools_node_protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--js_out=import_style=commonjs,binary:./dist \
--grpc_out=grpc_js:./dist \
--ts_out=grpc_js:./dist \
-I ./src ./src/*.proto \

ls dist/ | grep "d.ts" | while read -r line ; do
    filename=${line::-5}
    echo "export * from './$filename'" >> dist/index.ts
done

tsc dist/index.ts --declaration

rm dist/index.ts