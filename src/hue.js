'use strict';

var request = require('request-promise');

// Config
const config = require('./config/config.json');


exports.getGroup = function getGroup(group) {
    return getBridge().then((data) => data.groups[group].action);
}

exports.setGroup = function setGroup(group, body) {
    const url = '/api/0/groups/' + group + '/action';
    return sendMessage({ url, body, method: 'PUT' });
}



const _handleError = (err) => { throw new Error(err) };

function getBridge() {
    const url = 'https://www.meethue.com/api/getbridge';
    const qs = { token: config.accessToken, bridgeid: config.bridgeId };
    const headers = { 'content-type': 'application/x-www-form-urlencoded' };

    return request.get({ url, qs, headers, json: true }).catch(_handleError);
}

function sendMessage(clipCommand) {
    const url = 'https://www.meethue.com/api/sendmessage';
    const clipmessage = { bridgeId: config.bridgeId, clipCommand };
    const formData = { token: config.accessToken, clipmessage: JSON.stringify(clipmessage) };

    return request.post({ url, formData, json: true }).catch(_handleError);
}
