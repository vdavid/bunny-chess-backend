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

/* Fun stats added as an afterthought, completely messing up the response */
let requestCount = 0;
let moveCount = 0;

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
        moveCount++
    }
    // @ts-ignore
    boards['stats'] = {requestCount, moveCount}

    requestCount++;

    return boards
})

/* Start the server */
fastify.listen(2000, '0.0.0.0').then(() => {})
