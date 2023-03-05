// Require the framework and instantiate it
import Fastify from 'fastify';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import path, { join } from 'path'
import data_examples from './mock-data.mjs'
import { fileTypeFromBuffer } from 'file-type'
import cors from '@fastify/cors';
import fastStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { Sequelize, DataTypes, Model } from 'sequelize';

const searchToken = process.env.SEARCH_TOKEN;
const analyzerToken = process.env.ANALYZER_TOKEN;

console.log(searchToken)

let urlsQueue = [];

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
  id: {
    type: DataTypes.NUMBER,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  src: {
    type: DataTypes.STRING
  },
  prompt: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  },
  path: {
    type: DataTypes.STRING
  }
}, { timestamps: false });


async function getAllNewImagesFromDb() {
  return await Image.findAll({
    where: {
      status: 'new'
    }
  });
}

async function getVerificationUrl(imageUrl) {
  const baseUrl = 'https://api.replicate.com/v1/predictions';
  const token = 'fake-token';

  try {
    const res = await axios.post(baseUrl, {
      version: "a4a8bafd6089e1716b06057c42b19378250d008b80fe87caa5cd36d40c1eda90",
      input: {
        image: 'https://images.unsplash.com/photo-1674574124649-778f9afc0e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        clip_model_name: 'ViT-L-14/openai',
        mode: 'fast'
      }
    },
    { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" } },
    );

    if (res.data?.status === 'starting') {
      return res.data?.urls?.get;
    }
  } catch (err) {
    console.log(err);
  }
}

async function checkImages() {
  const newImages = await getAllNewImagesFromDb();
  
  newImages.forEach(async (image) => {
    if (!image.path) {
      return;
    }

    const base64Image = readFileSync(path, { encoding: 'base64' });
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const { mime } = await fileTypeFromBuffer(imageBuffer);
    const promptUrl = getVerificationUrl(`data:${mime};base64,${base64Image}`);
    if (!promptUrl) {
      return;
    }
    
    await Image.update(
      { status: 'processing' },
      { where: { id: image.id } }
    );

    urlsQueue.push({
      id: image.id,
      promptUrl: promptUrl
    });
  });
}

async function verifyImagePromptStatus(item) {
  try {
    const res = await axios.get(item.promptUrl,
    { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" } },
    );

    if (res.data?.status === 'succeeded') {
      await Image.update(
        { status: 'finished', prompt: res.data?.output },
        { where: { id: item.id } }
      );

      urlsQueue = urlsQueue.filter(x => x.id !== item.id);
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
  }
}

async function verifyQueue() {
  await checkImages();

  if (urlsQueue.length > 0) {
    const item = urlsQueue[0];
    verifyImagePromptStatus(item);
  }
}

setInterval(verifyQueue, 2000);

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

fastify.register(fastStatic, {
  root: join(__dirname, 'uploads'),
  prefix: '/uploads/',
  decorateReply: false
})

// this is the search endpoint, which returns a list of prompts
// that match the search query. It uses the redisearch engine to
// perform the search

fastify.get('/search', async (request, reply) => {
  // get the query string from the request
  const searchQuery = request.query.query;

  // check to make sure that the query string was passed in
  if (searchQuery == undefined) {
    // if it wasn't, set the status code to 400 (bad request) and send back an error message
    reply.statusCode = 400;
    reply.send({ error: "query not found" });
  }

  console.log(`search query ${searchQuery}`);

  // make an call to remote api to find the 
  // similarity betwen search query and database prompts
  const images = await Image.findAll({
    where: {
      status: 'ready'
    }
  });

  console.log('Count',images.length);

  const result = await axios.post(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    {
      inputs: {
        source_sentence: searchQuery,
        sentences: images.map(image => image.prompt)
      }
    },
    { headers: { Authorization: `Bearer ${searchToken}`, "Content-Type": "application/json" } },
  );


  const data = images.map((image, index) => ({
    score: result.data[index],
    src: image.src,
    name: image.name,
    id: image.id,
    prompt: image.prompt
  }))

  reply.send({
    total: data.length,
    documents: data
  });
})

// This code will get the list of images from the redis database
// The images will be stored as a json object in the database
// The code will return a json object with the list of images

fastify.get('/', async (request, reply) => {
  // get all the items from the redis database
  const results = await Image.findAll();
  reply.send({
    total: results.length,
    documents: results
  });
})


fastify.post('/image', async (request, reply) => {
  if (request.body == undefined) {
    reply.statusCode = 400;
    reply.send({ error: "body not found" });
  }

  if (request.body.data == undefined) {
    reply.statusCode = 400;
    reply.send({ error: "data not found" });
  }

  if (request.body.name == undefined) {
    reply.statusCode = 400;
    reply.send({ error: "name not found" });
  }

  const { data, name } = request.body;

  const base64Data = data.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const imageType = await fileTypeFromBuffer(imageBuffer);

  const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '__' + (name.split(' ').filter(x => x).join('_')) + '.' + imageType.ext;
  
  // check if folder uploads exists
  if (!existsSync(join(__dirname, 'uploads'))) {
    mkdirSync(join(__dirname, 'uploads'));
  }
  
  const imagePath = join(__dirname, 'uploads', hash);
  writeFileSync(imagePath, imageBuffer);

  const hostUrl = request.protocol + '://' + request.hostname;
  const imageUrl = hostUrl + '/uploads/' + hash;

  await Image.upsert({ name, src: imageUrl, id: hash, status: 'new', path: imagePath });

  reply.send({ id: hash, name: name, src: imageUrl, path: imagePath });
})

fastify.listen({ port: 9000 }, async err => {
  if (err) throw err
  await sequelize.sync({ force: true });
  // Add data to the sqlite database
  for await (const entry of data_examples) {
    console.log(`adding '${entry.name}' to database`);
    if (entry.prompt) {
      await Image.upsert({ name: entry.name, prompt: null, src: entry.src, id: entry.id, status: 'new' })
    }
  }

  console.log(`server listening on ${fastify.server.address().port}`)
})

