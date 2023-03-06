# image-search-with-ai-description
A small project for a Hackathon. Use AI to generate image description which can be used by a search engine.

Run server in server folder:

```bash
cd server
node server.cjs
```
Run UI in client folder:

```bash
cd client
npm run dev
```

### Tech Stack
- Server: Node.js with Fastify
- Client: SvelteKit
- Database: SQLite
- Client Hosting: Vercel
- Server Hosting: ███████████
- Semantic Search API: https://huggingface.co/tasks/sentence-similarity
- Image Description API: [clip-interrogator](https://replicate.com/pharmapsychotic/clip-interrogator/versions/a4a8bafd6089e1716b06057c42b19378250d008b80fe87caa5cd36d40c1eda90)

:information_source: All of them can run on `localhost`. Make sure to add the correct host in the `fetch` functions.
