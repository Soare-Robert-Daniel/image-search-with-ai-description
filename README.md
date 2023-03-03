# image-search-with-ai-description
A small project for a Hackathon. Use AI to generate image description which can be used by a search engine.

Run server in server folder:

```bash
node /server.js
```
Run UI in client folder:

```bash
npm run dev
```

Redis Server with docker:
```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

:information_source: All of them run on `localhost`.