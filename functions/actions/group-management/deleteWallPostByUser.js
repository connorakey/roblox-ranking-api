const noblox = require('noblox.js');

async function deleteWallPostByUser(groupid, userid) {
    try {
        await noblox.deleteWallPostsByUser(groupid, userid)
        } catch {
            return false;
    }
    return true;
}

module.exports = { deleteWallPostByUser };