
# Node.js streaming using REST and GRPC 
How-to upstream, downstream and duplexstream (bidirectional) files using node <br>
Learn more about on <a href="" >medium</a>
## Run Locally  
Clone the project  

~~~bash  
  git clone https://github.com/vieirinhaabr/nodejs-rest-grpc-stream.git
~~~

Install dependencies and build the protos

~~~bash  
  cd proto
  npm i
  npm install -g grpc-tools@1.11.3
  npm run build
~~~

Install dependencies and run from both client, service-rest and service-grpc

~~~bash  
  cd client
  npm i
  npm run start:dev

  cd service-rest
  npm i
  npm run start:dev

  cd service-grpc
  npm i
  npm run start:dev
~~~
