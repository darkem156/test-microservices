const amqp = require('amqplib');
const sign = require('../modules/sign');
require('dotenv').config();

const queue = 'newUser';

(async () =>
{
    const con = await amqp.connect(`amqp://${process.env.AMQP_HOST || 'localhost'}:5672`);
    const channel = await con.createChannel();
    await channel.assertQueue(queue);
    channel.consume(queue, async msg =>
    {
        if (msg !== null)
        {
            let msgjson = JSON.parse(msg.content);
            console.log(msgjson);
            if (msgjson.function === "addUser") await response(con, await sign.up('Default Name', msgjson.data.user, msgjson.data.password, msgjson.data.email)); //response(await sign.up('Default Name', msgjson.data.user, msgjson.data.password, msgjson.data.email));
            channel.ack(msg);
        }
        else console.log('a');
    })
})();

const response = async(con, response) =>
{
    console.log(response);
    const channel = await con.createChannel()
    await channel.sendToQueue("response", Buffer.from(JSON.stringify(response)));
}