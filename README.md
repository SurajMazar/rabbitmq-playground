# Simple Demo for rabbit mq

Set up run 

```
docker compose up
```

Build and run the consumer
```
cd consumer
yarn watch
node dist/index.js
```


Build and run the producer
```
cd producer
yarn watch
node dist/index.js
```
