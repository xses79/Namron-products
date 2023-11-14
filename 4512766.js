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
    {zigbeeModel: ['4512766', '4512767'],
    model: '4512766 / 4512767',
    vendor: 'NAMRON',
    description: 'Namron Zigbee smart plug',
    fromZigbee: [fz.on_off, fz.electrical_measurement, fz.metering, fz.ignore_basic_report, fz.device_temperature],
    toZigbee: [tz.on_off],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff', 'haElectricalMeasurement', 'seMetering', 'genDeviceTempCfg']);
        endpoint.saveClusterAttributeKeyValue('seMetering', {divisor: 100000, multiplier: 1});
        endpoint.saveClusterAttributeKeyValue('haElectricalMeasurement', {
            acVoltageMultiplier: 1, acVoltageDivisor: 1, acCurrentMultiplier: 1, acCurrentDivisor: 1000, acPowerMultiplier: 1,
            acPowerDivisor: 1,
        });
        try {
            await reporting.deviceTemperature(endpoint);
            await reporting.currentSummDelivered(endpoint);
            await reporting.rmsVoltage(endpoint, {change: 5});
            await reporting.rmsCurrent(endpoint, {change: 50});
            await reporting.activePower(endpoint, {change: 10});
        } catch (error) {}
        await endpoint.read('genOnOff', ['onOff']);
        
    },
    options: [exposes.options.measurement_poll_interval()],
    exposes: [e.switch(), e.power(), e.current(), e.voltage(),
        e.energy(), e.device_temperature().withDescription('Device temperature'),],
    },
];