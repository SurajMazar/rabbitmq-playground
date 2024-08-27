import amqplib from 'amqplib'

export const createRabbitMqConnection = async () => {

    /**
     * RABBIT MQ SERVER
     */
    const rabbitMqServer = 'amqp://guest:guest@localhost:5672'

    const connection = await amqplib.connect(rabbitMqServer)

    connection.on('connected', () => {console.log('Connected to Rabit mq.')})
    connection.on('disconnected', () => {throw new Error('Rabit mq disconnected.')})

    return connection
}
