// Require the framework and instantiate it
import Fastify from 'fastify';
import { writeFileSync } from 'fs'
import path, { join } from 'path'
import data_examples from './mock-data.mjs'
import { fileTypeFromBuffer } from 'file-type'
import cors from '@fastify/cors';
import fastStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import { Sequelize, DataTypes, Model } from 'sequelize';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, './images.sqlite')
});

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


const Image = sequelize.define('Image', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  src: {
    type: DataTypes.STRING
  },
  prompt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.NUMBER ,
    primaryKey: true
  }
}, { timestamps: false });


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

// this is the search endpoint, which returns a list of prompts
// that match the search query. It uses the redisearch engine to
// perform the search
const token = "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";
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

  // make an call to remote api to find the 
  // similarity betwen search query and database prompts
  const images = await Image.findAll();
  console.log(JSON.stringify(images));
  const requestBody = {
    inputs: {
      source_sentence: searchQuery,
      sentences: images.map(image => image.prompt)
    }
  };

  const result = await axios.post(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2", 
    requestBody, 
    { headers: { Authorization: `Bearer ${token}` , "Content-Type": "application/json" } });

  
  const data = images.map((image, index) => ({
    score: result.data[index],
    src: image.src,
    name: image.name,
    id: image.id,
    prompt: image.prompt
  }))

  reply.send(data);
})

// This code will get the list of images from the redis database
// The images will be stored as a json object in the database
// The code will return a json object with the list of images

fastify.get('/', async (request, reply) => {
  // get all the items from the redis database
  const results = await Image.findAll();
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
  await sequelize.sync({ force: true });
  // Add data to the sqlite database
  for await (const entry of data_examples) {
    console.log(`adding '${entry.name}' to database`);
    if(entry.prompt) {
      await Image.upsert({ name:entry.name, prompt:entry.prompt, src:entry.src, id:entry.id })
    }
  }

  console.log(`server listening on ${fastify.server.address().port}`)
})

