const noblox = require('noblox.js');

async function exileUser(groupid, userid) {
    try {
        await noblox.exile(groupid, userid);
        } catch(error) {
            console.log(`An error occurred exiling: ${userid}`);
            return false;
    }
    return true;
};

module.exports = { exileUser };