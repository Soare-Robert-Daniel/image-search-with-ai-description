// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

const path = require('path')
const data_examples = require('./mock-data')
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(path.resolve(__dirname, './images.sqlite'), (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

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
})

// This code will get the list of images from the redis database
// The images will be stored as a json object in the database
// The code will return a json object with the list of images

fastify.get('/', (request, reply) => {
  // get all the items from the redis database
  db.all("SELECT * FROM images", (err, res) => {
    reply.send(res);
  });
})

fastify.listen({ port: 9000 }, async err => {
  if (err) throw err

  db.run("CREATE TABLE IF NOT EXISTS images (prompt TEXT, name TEXT, src TEXT, id INT PRIMARY KEY)");

  // Add data to the sqlite database
  for await (const entry of data_examples) {
    console.log(`adding '${entry.name}' to database`);
    db.run("INSERT OR IGNORE INTO images(prompt,name,src,id) VALUES (?, ?, ?, ?)", [ entry.prompt, entry.name, entry.src, entry.id ]);
  }

  console.log(`server listening on ${fastify.server.address().port}`)
})

