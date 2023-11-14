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
        zigbeeModel: ['4512770'],
        model: '4512770',
        vendor: 'Namron',
        description: 'Namron multi sensor',
        fromZigbee: [fz.battery, fz.ignore_basic_report, fz.ias_occupancy_alarm_1, fz.temperature, fz.humidity, fz.occupancy_timeout,
        fz.illuminance],
        toZigbee: [tz.occupancy_timeout],
        exposes: [e.occupancy(), e.battery_low(), e.temperature(), e.humidity(), e.illuminance(), e.battery(),
        e.numeric('occupancy_timeout', ea.ALL).withUnit('s').withValueMin(3).withValueMax(28800)],
        
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(2);
            await reporting.bind(endpoint, coordinatorEndpoint, ['msIlluminanceMeasurement', 'msOccupancySensing', 'msTemperatureMeasurement', 'msRelativeHumidity']);
         //   await endpoint.read('msOccupancySensing', ['pirOToUDelay']);  //new
            device.powerSource = 'Battery';
            device.save();
        },
    },
];