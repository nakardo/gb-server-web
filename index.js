'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);


// Sockets

const sub = redis.duplicate();
sub.subscribe('frame');
sub.on('message', (channel, png) => io.emit('frame', png));

const pub = redis.duplicate();
let peers = 0;

io.on('connection', (socket) => {
    socket.on('keydown', (keyCode) => pub.publish('keydown', keyCode));
    socket.on('keyup', (keyCode) => pub.publish('keyup', keyCode));
});

// Server

app.use(express.static('public'));
app.get('/ping', (req, res) => res.sendStatus(200));

server.listen(process.env.PORT || 3000);
