const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const tuya = require('zigbee-herdsman-converters/lib/tuya');
const extend = require('zigbee-herdsman-converters/lib/extend');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const utils = require('zigbee-herdsman-converters/lib/utils');
const e = exposes.presets;
const ea = exposes.access;

module.exports = [
    {
        zigbeeModel: ['4512750'],
        model: '4512750',
        vendor: 'Namron',
        description: 'Namron Zigbee dimmer 2.0',
        fromZigbee: extend.light_onoff_brightness().fromZigbee.concat(),
        toZigbee: extend.light_onoff_brightness().toZigbee,
        configure: async (device, coordinatorEndpoint, logger) => {
            await extend.light_onoff_brightness().configure(device, coordinatorEndpoint, logger);
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff', 'genLevelCtrl']);
            await reporting.brightness(endpoint);
        },
        exposes: [e.light_brightness()],
        },
];
