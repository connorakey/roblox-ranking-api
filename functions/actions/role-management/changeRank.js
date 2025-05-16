const noblox = require('noblox.js');

async function changeRank(groupid, userid, change){
    try {
        await noblox.changeRank(groupid, userid, change)
        } catch {
            return false;
    }
    return true;
}

module.exports = { changeRank };