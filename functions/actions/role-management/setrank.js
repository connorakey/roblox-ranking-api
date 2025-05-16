const noblox = require('noblox.js')

async function setRank(groupid, userid, rankName){
    try {
        await noblox.setRank(groupid, userid, rankName);
        } catch(error) {
            console.log(`An error occurred setting the rank of: ${userid} to ${rankName}`);
            return false;
    }
    return true;
}

module.exports = { setRank };