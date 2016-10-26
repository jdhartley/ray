// Step 2: start blinky times, then reset to original state in payload

'use strict';

var sleep = require('sleep-promise');

// Config
const config = require('./src/config/config.json');

// Set state of hue lights group
const setGroup = require('./src/hue.js').setGroup;

exports.handler = (data) => {
    const group = data.group;
    const newAction = Object.assign({}, data.action, {
        alert: 'none',
        transitiontime: 2
    });

    console.log('here with the data');
    console.log(JSON.stringify(data, null, 2));

    const blinkyAction = {
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

    setGroup(group, blinkyAction)
        .then(sleep(9.5 * 1000)) // Wait for audio to finish playing (approx...)
        .then(() => setGroup(group, newAction));
}
