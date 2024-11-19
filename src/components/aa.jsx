import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Conversation } from '../models/conversationModel.js';
import mongoose, { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import Redis from 'ioredis';

import BusinessSubCategory from '../models/businessSubCategoryModel.js';
import BusinessKeyword from '../models/businessKeywordModel.js';
import BusinessCategory from '../models/businessCategoryModel.js';



const app = express();
const server = http.createServer(app);
const io = new Server(server);

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000", 
//         methods: ["GET", "POST"], 
//         allowedHeaders: ["Content-Type"], 
//         credentials: true 
//     }
// });

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => {
   console.log('Connected to Redis');
});

redis.on('error', (error) => {
    console.error('Error connecting to Redis:', error);
    process.exit(1);  // Exit the process with a failure code
});
const getAllData = async () => {
    try {
        // Fetch all keys
        const keys = await redis.keys('*');
        console.log('All Keys:', keys);
        // Fetch values for each key
        const allData = {};
        for (const key of keys) {
            const type = await redis.type(key);
            if (type === 'string') {
                allData[key] = await redis.get(key);
            } else if (type === 'hash') {
                allData[key] = await redis.hgetall(key);
            } else if (type === 'list') {
                allData[key] = await redis.lrange(key, 0, -1);
            } else if (type === 'set') {
                allData[key] = await redis.smembers(key);
            } else if (type === 'zset') {
                allData[key] = await redis.zrange(key, 0, -1);
            }
            // Handle other data types as needed
        }
        console.log('All Data:', allData);

        return allData;
    } catch (error) {
        console.error('Error retrieving all data from Redis:', error);
    }
};
// Example usage
getAllData();
// Clear the Redis database on server startup
const clearRedisDatabase = async () => {
    try {
        await redis.flushdb();
        console.log('Redis database has been cleared.');
    } catch (err) {
        console.error('Error clearing Redis database:', err);
    }
};
clearRedisDatabase();
const getFriendsOnline = async (userId) => {
	 if (!mongoose.Types.ObjectId.isValid(userId)) {
     return [];
    }
    // Check if the result is already in Redis
    let list = await redis.get(`friends:${userId}`);
    list = await JSON.parse(list)
    console.log('LISTTTT', list)
    if (!list) {
        // return JSON.parse.apply(friendsOnline);
        const result = await Conversation.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: new mongoose.Types.ObjectId(userId) },
                        { recieverId: new mongoose.Types.ObjectId(userId) },
                    ],
                },
            },
            {
                $project: {
                    interactedUser: {
                        $cond: [
                            { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
                            '$recieverId',
                            '$senderId',
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    userIds: { $addToSet: '$interactedUser' },
                },
            },
            {
                $project: {
                    _id: 0,
                    userIds: 1,
                },
            },
        ]);
        list = result.length > 0 ? result[0].userIds : [];
        await redis.set(`friends:${userId}`, JSON.stringify(list));
    }


    let friendsOnline = {};
    for (const userId of list) {
	   if (!mongoose.Types.ObjectId.isValid(userId)) {
           console.warn(`Invalid friendId: ${friendId}`);
           continue;
        }
        const socketId = await redis.hget('userSocketMap', userId.toString());
        if (socketId) {
            friendsOnline[userId.toString()] = socketId;
           // console.log(socketId, "from aj");
        }
    }


    return friendsOnline;
};

let waitingPlayer = null; // Store the player waiting to be matched

io.on('connection', async (socket) => {
	 console.log('Number of connected clients:', io.engine.clientsCount);
	console.log('A USER IS CONNECTED', socket.id,"userId:",socket.handshake.query.userid);
    const userId = socket.handshake.query.userId;
    if (userId) {
        await redis.hset('userSocketMap', userId, socket.id);
    }
    let myFriends = await getFriendsOnline(userId);
    for (const friend in myFriends) {
        //let users = await redis.hkeys('userSocketMap');
        //users = users.filter((user) => user !== friend);
        //io.to(myFriends[friend]).emit('getOnlineUsers', users);

	    let onlineFriendsOfEachPerson = await getFriendsOnline(friend)
        io.to(myFriends[friend]).emit('getOnlineUsers', Object.keys(onlineFriendsOfEachPerson));
    }
    let friendsOnline = await getFriendsOnline(userId);
    io.to(socket.id).emit('getOnlineUsers', Object.keys(friendsOnline));
    


socket.on('singleUser',async(query)=>{
        if(!query){
            socket.emit('getOnlineUser',[])
            return;
        }
        const recieverSocketId = await getRecieverSocketId(query.chatPersonId)
    if (recieverSocketId) {
        io.to(socket.id).emit("getOnlineUser", true)
    }else{
        io.to(socket.id).emit("getOnlineUser",false)
    }
    })


 socket.on('subCategory', async (query) => {
       
        if (!query) {
            socket.emit('subCategorySuggetions', [])
            return
        }
        try {

            const regex = new RegExp(`^${query.searchText}`, "i");
            const suggestions = await BusinessSubCategory.find({
                subCategory  : regex,
                categoryId: query.categoryId
            }).select("subCategory").limit(5);

            socket.emit('subCategorySuggetions', suggestions)


        } catch (error) {

            socket.emit('error', error.message)

        }


    })

    socket.on('category', async (query) => {


        if (!query) {
            socket.emit('categorySuggetions', [])
            return
        }
        try {

            const regex = new RegExp(`^${query}`, "i");

            const suggestions = await BusinessCategory.find({
                category: regex,

            }).select("category _id").limit(5);



            socket.emit('categorySuggetions', suggestions)


        } catch (error) {

            socket.emit('error', error.message)

        }


    })


    socket.on('keywords', async (query) => {

        if (!query) {

            socket.emit('keywordSuggetions', [])
            return
        }
        try {
            const regex = new RegExp(`^${query.searchText}`, "i");
            const suggestions = await BusinessKeyword.find({
                keyword: regex,
                categoryId: query.categoryId
            }).select("keyword").limit(5);

            socket.emit('keywordSuggetions', suggestions)


        } catch (error) {

            socket.emit('error', error.message)

        }


    })


    ///////////////////////////////////////
    socket.on('startGame', (userId) => {
        console.log(`Player ${userId} wants to start a game`);
        console.log(waitingPlayer,'waitingPlayer ==============');
        
        if (waitingPlayer) {
            // A player is already waiting for an opponent
            const opponent = waitingPlayer; // Get the waiting player's details
            waitingPlayer = null; // Clear the waiting player
            
            // Notify both players that the game has started
            io.to(opponent.socketId).emit(`gameStarted${opponent.userId}`, { opponentId: userId });
            io.to(socket.id).emit(`gameStarted${userId}`, { opponentId: opponent.userId });
    
            console.log(`Game started between ${opponent.userId} and ${userId}`);
        } else {
            // No player waiting, mark this player as the waiting one
            waitingPlayer = { userId, socketId: socket.id };
            console.log(`Player ${userId} is waiting for an opponent`);
        }
    });
    






	socket.on('disconnect', async () => {
        console.log('USER DISCONNECTED', socket.id);
        await redis.hdel('userSocketMap', userId);
        let myFriends = await getFriendsOnline(userId);
        for (const friend in myFriends) {
            //let users = await redis.hkeys('userSocketMap');
            //users = users.filter((user) => user !== friend);
            //io.to(myFriends[friend]).emit('getOnlineUsers', users);

		 let onlineFriendsOfEachPerson = await getFriendsOnline(friend)
            io.to(myFriends[friend]).emit('getOnlineUsers', Object.keys(onlineFriendsOfEachPerson));
        }


        /////////////////////////

        if (waitingPlayer && waitingPlayer.socketId === socket.id) {
            console.log(`Waiting player ${waitingPlayer.userId} disconnected`);
            waitingPlayer = null;
          }
      
    });
});
export const getRecieverSocketId = async (recieverId) => {

    return await redis.hget('userSocketMap', recieverId);

};
export { server, io, app, redis };








