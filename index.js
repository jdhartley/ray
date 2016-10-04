const
    // Config
    config = require('./config/hue-bridge.json'),

    // Light Groups
    GROUP_ALL_LIGHTS = 0,
    GROUP_LIVING_ROOM = 1,
    GROUP_BEDROOM = 2;


var request = require('request');

function sendMessage(clipCommand) {
    const url = 'https://www.meethue.com/api/sendmessage';
    const formData = {
        token: config.accessToken,
        clipmessage: JSON.stringify({
            bridgeId: config.bridgeId,
            clipCommand
        })
    };

    request.post({ url, formData }, (err, res) => {
        if (err) {
            return console.error('request failed:', err);
        }

        console.log(res.body);
    });
}

function toggle(group, on) {
    return sendMessage({
        url: '/api/0/groups/' + group + '/action',
        method: 'PUT',
        body: { on }
    });
}

function turnOn(group) {
    return toggle(group, true);
}

function turnOff(group) {
    return toggle(group, false);
}

// turnOn(GROUP_ALL_LIGHTS);


function redAlert(group) {
    return sendMessage({
        url: '/api/0/groups/' + group + '/action',
        method: 'PUT',
        body: {
            hue: 0,
            alert: 'lselect'
        }
    });
}

redAlert(GROUP_LIVING_ROOM);
