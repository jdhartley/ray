'use strict';

var Promise = require('bluebird');
var request = require('request-promise');
var sleep = require('sleep-promise');


// Auth Config
const { accessToken, bridgeId, username } = require('./config/hue-bridge.json');

// Light Groups
const
    GROUP_ALL_LIGHTS = 0,
    GROUP_LIVING_ROOM = 1,
    GROUP_BEDROOM = 2;


// Hue API Functions
const _handleError = (err) => { throw new Error(err) };

function getBridge() {
    const url = 'https://www.meethue.com/api/getbridge';
    const qs = { token: accessToken, bridgeid: bridgeId };
    const headers = { 'content-type': 'application/x-www-form-urlencoded' };

    return request.get({ url, qs, headers, json: true }).catch(_handleError);
}

function sendMessage(clipCommand) {
    const url = 'https://www.meethue.com/api/sendmessage';
    const clipmessage = { bridgeId: bridgeId, clipCommand };
    const formData = { token: accessToken, clipmessage: JSON.stringify(clipmessage) };

    return request.post({ url, formData, json: true }).catch(_handleError);
}


// API Helper Functions
function getGroup(group) {
    return getBridge().then((data) => data.groups[group].action);
}

function setGroup(group, body) {
    const url = '/api/0/groups/' + group + '/action';
    return sendMessage({ url, body, method: 'PUT' });
}


// Red Alert!
function redAlert(group) {
    const body = {
        // Make sure lights are on and super bright!
        on: true,
        transitiontime: 0,
        bri: 254,

        // Oh shit the borg!!! Blinky times!!!
        alert: 'lselect',

        // Set to a nice red color
        colormode: 'hs',
        hue: 339,
        sat: 254
    };

    const currentState = getGroup(group);
    const blinkyTimes = currentState.then(() => setGroup(group, body));
    const sleepyTimes = blinkyTimes.then(sleep(7 * 1000));

    return Promise.join(currentState, sleepyTimes, (oldAction) => {
        // reset alert to none so we don't keep blinking
        const newAction = { alert: 'none', transitiontime: 2 };
        return setGroup(group, Object.assign({}, oldAction, newAction));
    });
}


redAlert(GROUP_LIVING_ROOM);
