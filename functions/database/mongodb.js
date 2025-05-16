const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI
const client = new MongoClient(uri);

async function apikeyValid(apiKey){
    try {
        await client.connect();
        const db = client.db("api_users");
        const collection = db.collection("users");
        
        const user = await collection.findOne({ api_token: apiKey })

        if (!user){
            return false;
            } else if (user.tokens_remaining <= 0) {
                return false;
            } else {
                return true;
        }

        } catch(error) {
            console.error("Error checking API key: ", error)
            return false
        } finally {
            await client.close();
    }
}

async function deductToken(apiKey){
    try {
        await client.connect();
        const db = client.db("api_users");
        const collection = db.collection("users");

        const user = await collection.findOne ({ api_token: apiKey })

        if (user && user.tokens_remaining > 0){
            await collection.updateOne(
                      { api_token: apiKey },
                      { $inc: { tokens_remaining: -1 } }
            );
            return true;
            } else {
                return false;
        };

        } catch(error) {
            console.error('An error occurred deducting tokens: ', error)
            return false
    }
};

async function checkApiTokens(apiKey) {
    try {
        await client.connect();
        const db = client.db("api_users");
        const collection = db.collection("users");

        const user = await collection.findOne({ api_token: apiKey });

        if (!user ) {
            return false;
        }

        return { tokens_remaining: user.tokens_remaining };

        } catch {
            return false;
        } finally {
            await client.close();
    }
}

module.exports = { apikeyValid, deductToken, checkApiTokens };