const noblox = require('noblox.js')

async function shoutMessage(groupid, message){
    try {
        await noblox.shout(groupid, message);
        } catch(error){
            console.error('An error has occurred ', error)
            return false;
    }
    return true;
}

module.exports = { shoutMessage };