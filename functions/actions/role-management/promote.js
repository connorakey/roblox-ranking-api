const noblox = require('noblox.js');

async function promoteUser(groupid, userid) {
    try {
        await noblox.promote(groupid, userid)

        } catch(error) {
            console.error(`An error occurred promoting ${userid}`)
            return false;
    }
    return true;
};

module.exports = { promoteUser };