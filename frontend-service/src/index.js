const express = require('express');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();

app.get('/', (req, res) =>
{
    res.send('Change the URL using the format "URL/user&password&email@dominio.com" to register a user');
})

app.get('/:user&:password&:email', async (req, res) =>
{
    const queue = "newUser";
    const msg = 
    {
        "function": "addUser",
        "data": req.params
    };
    console.log(msg);
    const resp = await send(msg, queue);
    if(resp.error !== '') res.send(resp.error);
    else res.send('Usuario creado correctamente');
})

async function send(msg, queue) 
{
    const con = await amqp.connect(`amqp://${process.env.AMQP_HOST || localhost}:5672`);
    const channel = await con.createChannel();
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));

    await channel.assertQueue("response");
    let msgjson = new Promise(resolve =>
    {
        channel.consume("response", msg =>
        {
            if (msg !== null)
            {
                channel.ack(msg);
                return resolve(JSON.parse(msg.content));
            }
            else return resolve(JSON.parse({"error": "error"}));
        })
    })
    await msgjson;
    channel.close();
    return msgjson;
}

app.listen(3002, () =>
{
    console.log("Server on port 3002");
})