import * as dotenv from 'dotenv';
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

dotenv.config();
const searchToken = process.env.SEARCH_TOKEN;
const analyzerToken = process.env.ANALYZER_TOKEN;

let urlsQueue = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ 
  logger: true,
  bodyLimit: 30 * 1024 * 1024 // Default Limit set to 30MB 
});

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


// +---------------------- Analyzer ----------------------+

async function getAllNewImagesFromDb() {
  return await Image.findAll({
    where: {
      status: 'new'
    }
  });
}

async function getVerificationUrl(imageUrl) {
  const baseUrl = 'https://api.replicate.com/v1/predictions';

  try {
    const res = await axios.post(baseUrl, {
      version: "a4a8bafd6089e1716b06057c42b19378250d008b80fe87caa5cd36d40c1eda90",
      input: {
        image: imageUrl,
        clip_model_name: 'ViT-L-14/openai',
        mode: 'fast'
      }
    },
    { headers: { Authorization: `Token ${analyzerToken}`, "Content-Type": "application/json" } },
    );

    if (res.data?.status === 'starting') {
      return res.data?.urls?.get;
    }
  } catch (err) {
    console.log(err);
  }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

async function checkImages() {
  const newImages = await getAllNewImagesFromDb();
  
  if (!newImages || newImages.length === 0) {
    return;
  }

  for await (const image of newImages) {
    if (!image.path) {
      return;
    }

    const base64Image = readFileSync(image.path, { encoding: 'base64' });
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const { mime } = await fileTypeFromBuffer(imageBuffer);
    const promptUrl = await getVerificationUrl(`data:${mime};base64,${base64Image}`);
    
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

    await delay(200); // Send one prediction request every 200ms ~ 5 requests per second
  }
}

async function verifyImagePromptStatus(item) {
  try {
    const res = await axios.get(item.promptUrl,
    { headers: { Authorization: `Token ${analyzerToken}`, "Content-Type": "application/json" } },
    );

    if (res.data?.status === 'succeeded') {
      await Image.update(
        { status: 'ready', prompt: res.data?.output },
        { where: { id: item.id } }
      );

      urlsQueue = urlsQueue.filter(x => x.id !== item.id);
    }
  } catch (err) {
    console.log(err);
  }
}

async function verifyQueue() {
  if (urlsQueue.length > 0) {

    const items = urlsQueue.slice(0, 10);

    for await (const item of items) {
      await verifyImagePromptStatus(item);
    }
  } else {
    await checkImages();
  }
}

setInterval(verifyQueue, 2000);

// +---------------------- Plugins ----------------------+

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

// +---------------------- Routes ----------------------+

// this endpoint return the scores for the prompts similarity to the query string
fastify.get('/search', async (request, reply) => {
  // get the query string from the request
  const searchQuery = request.query.query;

  // check to make sure that the query string was passed in
  if (searchQuery == undefined) {
    // if it wasn't, set the status code to 400 (bad request) and send back an error message
    reply.statusCode = 400;
    reply.send({ error: "query not found" });
  }

  const images = await Image.findAll({
    where: {
      status: 'ready'
    }
  });

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

// this is the endpoint that returns a list of all the images
fastify.get('/', async (request, reply) => {
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

  /**
   * Save image to disk.
   */

  const base64Data = data.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const imageType = await fileTypeFromBuffer(imageBuffer);

  const saveName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '__' + (name.split(' ').filter(x => x).join('_')) + '.' + imageType.ext;
  
  if (!existsSync(join(__dirname, 'uploads'))) {
    mkdirSync(join(__dirname, 'uploads'));
  }
  
  const imagePath = join(__dirname, 'uploads', saveName);
  writeFileSync(imagePath, imageBuffer);

  const hostUrl = request.protocol + '://' + request.hostname;
  const imageUrl = hostUrl + '/uploads/' + saveName;

  await Image.upsert({ name, src: imageUrl, id: saveName, status: 'new', path: imagePath });

  reply.send({ id: saveName, name: name, src: imageUrl, path: imagePath });
})

// +---------------------- Start Server ----------------------+

fastify.listen({ port: 3000 }, async err => {
  if (err) throw err

  // Clean up the database.
  await sequelize.sync({ force: true });
  
  // Add the example images to the database.
  for await (const entry of data_examples) {
    console.log(`adding '${entry.name}' to database`);
    if (entry.prompt) {
      await Image.upsert({ name: entry.name, prompt: entry.prompt, src: entry.src, id: entry.id, status: 'ready' })
    }
  }

  console.log(`server listening on ${fastify.server.address().port}`)
})

