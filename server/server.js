// Require the framework and instantiate it
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

// fastify.register(require('@fastify/redis'), { 
//   host: 'localhost', // Momentan rulez pe local (instanta de docker spearata), dar pe viitor poate fi pus pe docker compose.
//   port: 6379, // Redis port
//   family: 4   // 4 (IPv4) or 6 (IPv6)
// })

fastify.get('/', async (request, reply) => {
  return data_examples;
})

fastify.listen({ port: 9000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
