"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_connection_1 = require("./rabbitmq.connection");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, rabbitmq_connection_1.createRabbitMqConnection)();
        const rabbit = yield connection.createChannel();
        yield rabbit.assertQueue('default_stream', {
            durable: true,
            arguments: {
                "x-queue-type": "stream",
            }
        });
        console.log(`Waiting for messages in default_stream`);
        yield rabbit.prefetch(1);
        const lastOffset = 1;
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours in milliseconds
        const timestamp24HoursAgo = twentyFourHoursAgo.getTime();
        // Consume messages
        rabbit.consume('default_stream', (msg) => {
            var _a, _b, _c;
            if (msg !== null) {
                console.log('Received:', {
                    offset: (_b = (_a = msg === null || msg === void 0 ? void 0 : msg.properties) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b['x-stream-offset'],
                    content: (_c = msg === null || msg === void 0 ? void 0 : msg.content) === null || _c === void 0 ? void 0 : _c.toString()
                });
                // Acknowledge the message
                rabbit.ack(msg);
            }
        }, {
            consumerTag: 'first-consumer',
            arguments: {
                'x-stream-offset': lastOffset
            }
        });
    }
    catch (error) {
        console.error('Error:', error);
    }
});
main();
