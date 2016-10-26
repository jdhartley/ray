// Step 1: get current state and send in event

'use strict';

var aws = require('aws-sdk');

// Config
const config = require('./src/config/config.json');

// Get info on hue lights group
const getGroup = require('./src/hue.js').getGroup;

// Light Groups
const
    GROUP_ALL_LIGHTS = 0,
    GROUP_LIVING_ROOM = 1,
    GROUP_BEDROOM = 2;

exports.handler = (event, context, callback) => {
    var lambda = new aws.Lambda({ region: 'us-east-1' });

    try {
        const group = GROUP_LIVING_ROOM;

        getGroup(group)
            .catch((err) => { throw new Error(err) })
            .then((action) => {
                const payload = { group, action };

                console.log('payload is');
                console.log(JSON.stringify(payload, null, 2));

                lambda.invoke({
                    FunctionName: 'redAlertLights',
                    InvocationType: 'Event',
                    Payload: JSON.stringify(payload)
                }, function() {
                    console.log('lambda here!');
                    console.log(arguments);
                });

                console.log('sending callback');

                callback(null, {
                    version: '1.0',
                    sessionAttributes: {},
                    response: {
                        outputSpeech: {
                            type: 'SSML',
                            ssml: `<speak><audio src="${config.streamUrl}" /></speak>`
                        },
                        card: {
                            type: 'Simple',
                            title: 'Red Alert',
                            content: 'Red alert, shields up!'
                        },
                        shouldEndSession: true
                    }
                });
            })
    } catch(err) {
        console.log(err);
        callback(err);
    }
};
