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
        const defaultQueue = yield rabbit.assertQueue('default_stream', {
            durable: true,
            arguments: {
                "x-queue-type": "stream",
            }
        });
        console.log(`Consumers number ${defaultQueue === null || defaultQueue === void 0 ? void 0 : defaultQueue.messageCount}`);
        const message = {
            content: `Queue message - ${new Date().toUTCString()}`,
            timestamp: new Date().toISOString()
        };
        rabbit.sendToQueue('rabbit', Buffer.from(JSON.stringify(message)), {
            persistent: true
        });
    }
    catch (exception) {
        console.log(exception);
    }
});
main();
