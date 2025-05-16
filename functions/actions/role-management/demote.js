const noblox = require('noblox.js');

async function demoteUser(groupid, userid) {
    try {
        await noblox.demote(groupid, userid);
        } catch(error) {
            console.log(`An error occurred demoting: ${userid}`);
            return false;
    }
    return true;
};

module.exports = { demoteUser };