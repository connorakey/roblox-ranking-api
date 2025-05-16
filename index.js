const express = require('express');
const app = express();
const noblox = require('noblox.js');

const PORT = 8000;

// TODO LIST
// ADD RETURN BEFORE EACH res.status TO STOP CODE EXECUTION AFTER THAT TO PREVENT ERRORS
// Finish Group-Management
// Finish Free Section
// Reset Tokens Each Month
// Create an API for token management (to check how many tokens are left, when tokens reset)
// Find out how to make a website for this with login using the database created with MongoDB

require('dotenv').config();

// Constant Variables of Modules from files in /functions/role-management
const { promoteUser } = require('./functions/actions/role-management/promote');
const { demoteUser } = require('./functions/actions/role-management/demote');
const { exileUser } = require('./functions/actions/role-management/exile');
const { setRank } = require('./functions/actions/role-management/setrank');
const { changeRank } = require('./functions/actions/role-management/changeRank');

// Constant Variables of Modules from files in /functions/group-management
const { shoutMessage } = require('./functions/actions/group-management/shout');
const { deleteWallPost } = require('./functions/actions/group-management/deleteWallPost');
const { deleteWallPostByUser } = require('./functions/actions/group-management/deleteWallPostByUser');


// Within /functions/database
const { apikeyValid, deductToken, checkApiTokens } = require('./functions/database/mongodb');

async function login() {
    await noblox.setCookie(process.env.COOKIE)
    console.log(`Logged in sucessfully`)
};

login().catch(err => console.error('Login failed:', err));

app.get('/api/role-management/:token/:groupid/:userid/:action{/:additionalinfo}', async (req, res) => {

    try {
        const { token, groupid, userid, action, additionalinfo } = req.params
        const isValid = await apikeyValid(token)
        if (isValid) {

        const actions = ['promote', 'demote', 'setrank', 'exile', 'changeRank']

        if (!actions.includes(action)) {
            return res.status(404).json({
                success: false,
                error: "Action not found",
                message: "The action you provided is invalid."
            });
        }
        
        if (action == "promote") {
            const result = await promoteUser(groupid, userid)
            if (result) {
                const deductTokenResult = await deductToken(token);
                if (deductTokenResult) {
                    return res.status(200).json({
                        success: true,
                        message: "Operation successful"
                    });
                    } else {
                        return res.status(500).json({
                            success: false,
                            error: "Failed to update Database",
                            message: "Failed to update tokens_remaining, the ranking still has gone through, take this as a free ranking"
                        });
                };

                } else {
                    return res.status(400).json({
                        success: false,
                        error: "Promotion could not be completed due to a bad request",
                        message: "Ensure you are following the API documentation correctly, and the client has the proper permissions"
                    })
            }
        }

        if (action == 'demote') {
            const result = await demoteUser(groupid, userid)
            if (result){
                const deductTokenResult = await deductToken(token);
                if (deductTokenResult){
                    return res.status(200).json({
                        success: true,
                        message: "Operation successful"
                    });
                        } else {
                            res.status(500).json({
                                success: false,
                                error: "Failed to update tokens_remaining, the ranking still has gone through, take this as a free ranking",
                                message: "If you would like to help please open a ticket in our Discord server, and send the exact API request you made (rewards may be given)"
                            });
                };

                } else {
                    return res.status(400).json({
                        success: false,
                        error: "Demotion could not be completed due to a bad request",
                        message: "Ensure you are following the API documentation correctly, and the client has the proper permissions"
                    })
            };
        };

        if (action == 'setrank') {
            if (additionalinfo) {
                const result = await setRank(groupid, userid, additionalinfo)
                if (result) {
                    const deductTokenResult = await deductToken(token);

                    if (deductTokenResult){
                        return res.status(200).json({
                            success: true,
                            message: "Operation successful"
                        });

                        } else {
                            return res.status(500).json({
                                success: false,
                                error: "Failed to update tokens_remaining, the ranking still has gone through, take this as a free ranking",
                                message: "If you would like to help please open a ticket in our Discord server, and send the exact API request you made (rewards may be given)"
                            })
                    }

                    } else {
                        return res.status(400).json({
                            success: false,
                            error: "Setting Rank could not be completed due to a bad request",
                            message: "Ensure you are following the API documentation correctly, and the client has the proper permissions"
                        })
                }


                } else {
                    return res.status(400).json({
                        success: false,
                        error: "Bad Request",
                        message: "Missing required string parameter for the action setRank (rankName)"
                    });
            }
        }

        if (action == 'exile'){
            const result = await exileUser(groupid, userid);
            if (result) {
                const deductTokenResult = await deductToken(token);

                if (deductTokenResult) {
                    return res.status(200).json({
                        success: true,
                        message: "Operation successful"
                    })

                    } else {
                        return res.status(500).json({
                            success: false,
                            error: "Failed to update tokens_remaining, the ranking still has gone through, take this as a free ranking",
                            message: "If you would like to help please open a ticket in our Discord server, and send the exact API request you made (rewards may be given)"
                        })
                }
                } else {
                    return res.status(400).json({
                        success: false,
                        error: "Setting Rank could not be completed due to a bad request",
                        message: "Ensure you are following the API documentation correctly, and the client has the proper permissions"
                    })
            }
        }

        } else {
            return res.status(403).json({
                success: false,
                error: "Permission Denied",
                message: "Your API token is not valid"
            });
    };

    if (action == 'changeRank') {
        const result = await changeRank(groupid, userid)

        if (result) {

            const deductTokenResult = await deductToken(token);

            if (deductTokenResult) {

                return res.status(200).json({
                    success: true,
                    message: "Operation successful"
                })

                } else {
                return res.status(500).json({
                    success: false,
                    error: "Failed to update tokens_remaining, the ranking still has gone through, take this as a free ranking",
                    message: "If you would like to help please open a ticket in our Discord server, and send the exact API request you made (rewards may be given)"
                })
            }

            } else {
                return res.status(400).json({
                    success: false,
                    error: "Changing Rank could not be completed due to a bad request",
                    message: "Ensure you are following the API documentation correctly, and the client has proper permissions"
                })
        }
    };


    } catch(error) {
        console.error('An error occurred: ', error)
        return res.status(500).json({
            success: false,
            error: "An error with the server has occurred",
            message: "If this issue keeps occurring please open a ticket, if you are a server administrator please check the logs."
        })
    }
});


app.get('/api/group-management/:token/:groupid/:action{/:additionalinfo}', async (req, res) => {
    const { token, groupid, action, additionalinfo } = req.params;
    const userid = req.query.userid;

    try {
        const isValid = await apikeyValid(token);

        if (isValid) {

            const actions = ['shout', 'deleteWallPost', 'deleteWallPostByUser'];

            if (!actions.includes(action)) {
                return res.status(404).json({
                    success: false,
                    error: "Action not found",
                    message: "The action you provided is not valid"
                });
            }

            if (action == 'shout') {
                const result = await shoutMessage(groupid, additionalinfo);
                if (result) {
                    const deductTokenResult = await deductToken(token);
                    if (deductTokenResult) {
                        return res.status(200).json({
                            success: true,
                            message: "Operation successful"
                        });
                    } else {
                        return res.status(500).json({
                            success: false,
                            error: "Failed to update tokens_remaining, the shout still has gone through, take this as a free shout with our API",
                            message: "If you would like to help please open a ticket in our Discord server, and send the exact API request you made (rewards may be given)"
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        error: "Shout Message could not be completed due to a bad request",
                        message: "Ensure you are following the API documentation correctly, and the client has the proper permissions"
                    });
                }
            }

            if (action == 'deleteWallPost') {
                const result = await deleteWallPost(groupid, additionalinfo);

                if (result) {
                    const deductTokenResult = await deductToken(token);
                    if (deductTokenResult) {
                        return res.status(200).json({
                            success: true,
                            message: "Operation successful"
                        });
                    } else {
                        return res.status(500).json({
                            success: false,
                            error: "Failed to update tokens_remaining, the deleteWallPost has still gone through, take this as a free use of our API",
                            message: "If you would like to help please open a ticket in our Discord server, and send the exact API request you made (rewards may be given)"
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        error: "Delete Wall Post could not be completed due to a bad request",
                        message: "Ensure you are following the API documentation correctly, and the client has proper permissions"
                    });
                }
            }

            if (action == 'deleteWallPostByUser') {
                if (!userid) {
                    return res.status(400).json({
                        success: false,
                        error: "Missing userid",
                        message: "userid query parameter is required for deleteWallPostByUser"
                    });
                }
                const result = await deleteWallPostByUser(groupid, userid);

                if (result) {
                    const deductTokenResult = await deductToken(token);
                    if (deductTokenResult) {
                        return res.status(200).json({
                            success: true,
                            message: "Operation successful"
                        });
                    } else {
                        return res.status(500).json({
                            success: false,
                            error: "Failed to update tokens_remaining, the deleteWallPostByUser has still gone through, take this as a free use of our API"
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        error: "Delete Wall Post By User could not be completed due to a bad request",
                        message: "Ensure you are following the API documentation correctly, and the client has proper permissions"
                    });
                }
            }

        } else {
            return res.status(403).json({
                success: false,
                error: "Permission Denied",
                message: "Your API token is not valid, this may either be because the token you entered doesn't exist or you have run out of api_tokens"
            });
        }
    } catch (error) {
        console.error('An error has occurred: ', error);
        return res.status(500).json({
            success: false,
            error: "An error with the server has occurred",
            message: "If this issue keeps occurring please open a ticket, if you are a server administrator please check the logs."
        });
    }
});


app.get('/api/api-stats/:token/:action', async (req, res) => {
    const { token, action } = req.params;

    try {

        const isValid = await apikeyValid(token)

        if (isValid) {
            const actions = ['checkAPITokens'];

            if (!action.includes(actions)) {
                return res.status(404).json({
                    success: false,
                    error: "Action not found",
                    message: "The action you provided is not valid"
                });
            };

            if (action == 'checkAPITokens') {
                const result = await checkApiTokens(token)


                if (result == false) {
                    return res.status(400).json({
                        success: false,
                        error: "API Key Not Found",
                        message: "The API key you entered likely does not exist, or another error has occurred."
                    })  
                    
                    } else {
                        return res.status(200).json({
                            api_tokens: result,
                            success: true,
                            message: "Grabbing of remaining api_token was successful",
                            disclaimer: "This event does NOT use any API Tokens"
                        })
                }
            };

            } else {
                return res.status(403).json({
                    success: false,
                    error: "Permission Denied",
                    message: "Your API token is not valid"
                })
        };

        } catch(error) {
            console.error('An error has occurred: ', error);
            return res.status(500).json({
                success: false,
                error: "An error with the server has occurred",
                message: "If this issue keeps occurring please open a ticket, if you are a server administrator please check the logs."
            });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});