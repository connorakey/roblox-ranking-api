const noblox = require('noblox.js');

async function deleteWallPost(groupid, postid){
    try {
        await noblox.deleteWallPost(groupid, postid);
        } catch {
            return false;
    }
    return true;
}

module.exports = { deleteWallPost };