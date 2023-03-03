// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const path = require('path')

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'assets'),
  prefix: '/images/',
})

fastify.register(require('@fastify/redis'), { 
  host: 'db', 
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT, // Redis port
  family: 4   // 4 (IPv4) or 6 (IPv6)
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.listen({ port: 9000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
