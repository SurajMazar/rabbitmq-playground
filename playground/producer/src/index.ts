import {createRabbitMqConnection} from "./rabbitmq.connection";

const main = async () => {
    try {
        const connection = await createRabbitMqConnection()
        const rabbit = await connection.createChannel()

        const defaultQueue = await rabbit.assertQueue('default_stream', {
            durable: true,
            arguments: {
                "x-queue-type": "stream",
            }
        })

        console.log(`Consumers number ${defaultQueue?.messageCount}`)

        const message = {
            content: `Queue message - ${new Date().toUTCString()}`,
            timestamp: new Date().toISOString()
        };

        rabbit.sendToQueue('rabbit', Buffer.from(JSON.stringify(message)), {
            persistent: true
        })
    } catch (exception) {
        console.log(exception)
    }
}

main()
