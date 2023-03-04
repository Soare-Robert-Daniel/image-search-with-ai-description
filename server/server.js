// Require the framework and instantiate it
const redis = require('redis')
const fastify = require('fastify')({ logger: true })
const path = require('path')
const data_examples = require('./mock-data')


const client = redis.createClient();
client.on('error', err => console.log('Redis Client Error', err));

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'assets'),
  prefix: '/images/',
})

fastify.get('/search', async (request, reply) => {
  const { redis } = fastify
  const searchQuery = request.query.query;

  if(searchQuery == undefined) {
    reply.statusCode = 400;
    reply.send({error: "query not found"});
  }

  console.log(`search query ${searchQuery}`);

  const results = await client.ft.search('idx:prompt', `@prompt:{${searchQuery}}`);

  reply.send(results);

})

fastify.get('/', async (request, reply) => {
  const results = await client.json.get('noderedis:images', {});
  reply.send(results);
})

fastify.listen({ port: 9000 }, async err => {
  if (err) throw err
  await client.connect();

  await client.flushAll('ASYNC', (err, succeeded) => {
    console.log(`Redis cleaned: ${succeeded}`); 
  });
  
  // create redis search index
  await client.ft.create('idx:prompt', {
    prompt: {
      type: redis.SchemaFieldTypes.TEXT,
      SORTABLE: true
    } 
  }, {
    ON: 'HASH',
    PREFIX: 'noderedis:images'
  });

  data_examples.forEach(async entry => {
    console.log(`adding '${entry.name}' to database`);
    await client.json.set('noderedis:images', '$', entry);
  });
  
  console.log(`server listening on ${fastify.server.address().port}`)
})

