import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'

/* Create server and allow everyone to call it */
const fastify = Fastify({})
fastify.register(fastifyCors, { origin: '*' })

/* Set up the store */
const boards: {
    [key: string]: {
        fen: string,
        lightElapsedMs: number,
        darkElapsedMs: number,
        lastUpdateDateTime: string,
        gameStartDateTime: string,
    }
} = {}

/* Bind request handler */
fastify.get('/', async (request) => {
    const body = request.query as { id: string, fen: string, lightElapsedMs: string, darkElapsedMs: string, currentDateTime: string }
    if (body && body.id && body.fen) {
        boards[body.id] = {
            fen: body.fen,
            lightElapsedMs: parseInt(body.lightElapsedMs) >= 0 ? parseInt(body.lightElapsedMs) : (boards[body.id]?.lightElapsedMs || 0),
            darkElapsedMs: parseInt(body.darkElapsedMs) >= 0 ? parseInt(body.darkElapsedMs) : (boards[body.id]?.darkElapsedMs || 0),
            lastUpdateDateTime: body.currentDateTime || '',
            gameStartDateTime: boards[body.id]?.gameStartDateTime || body.currentDateTime
        }
    }

    return boards
})

/* Start the server */
fastify.listen(2000).then(() => {})
