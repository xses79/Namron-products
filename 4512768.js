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
        zigbeeModel: ['4512768'],
        model: '4512768',
        vendor: 'Namron',
        description: 'Zigbee 2 channel switch Namron',
        fromZigbee: [fz.on_off, fz.electrical_measurement, fz.metering, fz.power_on_behavior, fz.ignore_genOta,],
        toZigbee: [tz.on_off, tz.power_on_behavior],
        exposes: [
            e.switch().withEndpoint('l1'),
            e.switch().withEndpoint('l2'),
            e.power_on_behavior(['off', 'on', 'previous']),
            e.power(),
            e.energy(),
            e.numeric('voltage_l1', ea.STATE).withUnit('V').withDescription('Phase 1 voltage'),
            e.numeric('voltage_l2', ea.STATE).withUnit('V').withDescription('Phase 2 voltage'),
            e.numeric('current_l1', ea.STATE).withUnit('A').withDescription('Phase 1 current'),
            e.numeric('current_l2', ea.STATE).withUnit('A').withDescription('Phase 2 current'),
            e.numeric('power_l1', ea.STATE).withUnit('W').withDescription('Phase 1 power'),
            e.numeric('power_l2', ea.STATE).withUnit('W').withDescription('Phase 2 power'),
        ],
        endpoint: (device) => {
            const endpoints = {'l1': 1};
            if (device.getEndpoint(2)) {
                endpoints['l2'] = 2;
            }
            return endpoints;
        },
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint1 = device.getEndpoint(1);
            await reporting.bind(endpoint1, coordinatorEndpoint, ['genOnOff', 'haElectricalMeasurement', 'seMetering']);
            await reporting.onOff(endpoint1);
            await reporting.currentSummDelivered(endpoint1);
            await reporting.readEletricalMeasurementMultiplierDivisors(endpoint1);

            const endpoint2 = device.getEndpoint(2);
            if (endpoint2) {
                await reporting.bind(endpoint2, coordinatorEndpoint, ['genOnOff', 'haElectricalMeasurement', 'seMetering']);
                await reporting.onOff(endpoint2);
                await reporting.currentSummDelivered(endpoint2);
                await reporting.readEletricalMeasurementMultiplierDivisors(endpoint2);
            }
        },
    },
];

