// Require the framework and instantiate it
import { createClient, SchemaFieldTypes } from 'redis'
import Fastify from 'fastify';
import { writeFileSync } from 'fs'
import path, { join } from 'path'
import data_examples from './mock-data.mjs'
import { fileTypeFromBuffer } from 'file-type'
import cors from '@fastify/cors';
import fastStatic from '@fastify/static';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

fastify.register(cors, (instance) => {
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


fastify.register(fastStatic, {
  root: join(__dirname, 'assets'),
  prefix: '/images/',
})

const client = createClient();
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

  console.log(`search query ${searchQuery}`);

  // use the search function of the redis client to search the prompt index for the query string
  const results = await client.ft.search('idx:prompt', `@prompt:(${searchQuery})`);

  // send the results back to the client
  reply.send(results);

})

// This code will get the list of images from the redis database
// The images will be stored as a json object in the database
// The code will return a json object with the list of images

fastify.get('/', async (request, reply) => {
  // get all the items from the redis database
  const results = await client.hGetAll('*');
  reply.send(results);
})


fastify.post('/image', async (request, reply) => {
  if( request.body == undefined ) {
    reply.statusCode = 400;
    reply.send({error: "body not found"});
  }

  if( request.body.data == undefined ) {
    reply.statusCode = 400;
    reply.send({error: "data not found"});
  }

  if( request.body.name == undefined ) {
    reply.statusCode = 400;
    reply.send({error: "name not found"});
  }

  const { data, name } = request.body;

  const base64Data = data.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const imageType = await fileTypeFromBuffer(imageBuffer);

  const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '__' + ( name.split(' ').filter(x => x).join('_') ) + '.' + imageType.ext;
  const imagePath = join(__dirname, 'assets', hash);
  writeFileSync(imagePath, imageBuffer);

 
  reply.send({id: hash, name: name, path: imagePath});
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
      type: SchemaFieldTypes.TEXT,
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

