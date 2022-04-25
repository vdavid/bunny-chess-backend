// ESM
import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'

const fastify = Fastify({})

/* Server start marks game start */
const serverStartDate = new Date()
const aBitAfterServerStartDate = new Date(serverStartDate.getTime() + 30 * 1000)

fastify.register(fastifyCors, {
    origin: '*'
})
const boards: {
    [key: string]: {
        fen: string,
        lightElapsedMs: number,
        darkElapsedMs: number,
        lastUpdateDateTime: number,
    }
} = {}

fastify.get('/', async (request) => {
    const body = request.query as { id: string, fen: string, lightElapsedMs: string, darkElapsedMs: string, currentDateTime: string }
    if (body?.id && body?.fen) {
        boards[body.id] = {
            fen: body.fen,
            lightElapsedMs: parseInt(body?.lightElapsedMs),
            darkElapsedMs: parseInt(body?.darkElapsedMs),
            lastUpdateDateTime: parseInt(body?.currentDateTime)
        }
    }

    return { boards, startDateTime: aBitAfterServerStartDate.getTime() }
})

const start = async () => {
    try {
        await fastify.listen(2000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
