import {createRabbitMqConnection} from "./rabbitmq.connection";

const main = async () => {
    try {
        const connection = await createRabbitMqConnection()
        const rabbit = await connection.createChannel()

        await rabbit.assertQueue('default_stream', {
            durable: true,
            arguments: {
                "x-queue-type": "stream",
            }
        })

        console.log(`Waiting for messages in default_stream`);

        await rabbit.prefetch(1);

        const lastOffset =  1;

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours in milliseconds
        const timestamp24HoursAgo = twentyFourHoursAgo.getTime();

        // Consume messages
        rabbit.consume('default_stream', (msg) => {
            if (msg !== null) {
                console.log('Received:', {
                    offset:msg?.properties?.headers?.['x-stream-offset'],
                    content: msg?.content?.toString()
                });

                // Acknowledge the message
                rabbit.ack(msg);
            }
        }, {
            consumerTag:'first-consumer',
            arguments: {
                'x-stream-offset': lastOffset
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

main()
