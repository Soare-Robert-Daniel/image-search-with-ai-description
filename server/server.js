// Require the framework and instantiate it
const redis = require('redis')
const fastify = require('fastify')({ logger: true })

const path = require('path')
const data_examples = require('./mock-data')

fastify.register(require('@fastify/cors'), (instance) => {
  return (req, callback) => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: true
    };

    // do not include CORS headers for requests from localhost
    if (/^localhost$/m.test(req.headers.origin)) {
      corsOptions.origin = false
    }

    // callback expects two parameters: error and options
    callback(null, corsOptions)
  }
})


fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'assets'),
  prefix: '/images/',
})

const client = redis.createClient();
client.on('error', err => console.log('Redis Client Error', err));

// this is the search endpoint, which returns a list of prompts
// that match the search query. It uses the redisearch engine to
// perform the search

fastify.get('/search', async (request, reply) => {
  // get the query string from the request
  const searchQuery = request.query.query;

  // check to make sure that the query string was passed in
  if(searchQuery == undefined) {
    // if it wasn't, set the status code to 400 (bad request) and send back an error message
    reply.statusCode = 400;
    reply.send({error: "query not found"});
  }

  const search = searchQuery.split(" ").filter(s => s.trim().length !== 0).join("|");
  console.log(`search query: '${search}'`);

  // use the search function of the redis client to search the prompt index for the query string
  const results = await client.ft.search('idx:prompt', `@prompt:(${search})`);

  // send the results back to the client
  reply.send(results);

})

// This code will get the list of images from the redis database
// The images will be stored as a json object in the database
// The code will return a json object with the list of images

fastify.get('/', async (request, reply) => {
  // get all the items from the redis database
  const results = await client.ft.search('idx:prompt', '*');
  reply.send(results);
})

fastify.listen({ port: 9000 }, async err => {
  if (err) throw err
  await client.connect();

  // Clear the redis database
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

  // Add data to the redis database
  for await (const entry of data_examples) {
    console.log(`adding '${entry.name}' to database`);
    await client.hSet(`noderedis:images:${entry.id}`, entry); 
  }

  
  console.log(`server listening on ${fastify.server.address().port}`)
})

