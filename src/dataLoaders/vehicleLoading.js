const carModel = require('../models/car');
const DEFAULT_FIELDS = require('../constants/defaultFields');
const createVehicleTableRow = require('../renderers/vehicleRenderer');
const {processSelectFields, replaceTemplateFields} = require('../renderers/rendererUtils');

async function loadCatalogue() {
    try {
        const cars = await carModel.find();
        return cars.map(car => createVehicleTableRow(car.toObject())).join('');
    } catch (error) {
        throw new Error(`Failed to load catalogue: ${error.message}`);
    }
}

async function loadVehicle(template, param) {
    if (param === 'new') {
        return replaceTemplateFields(template, DEFAULT_FIELDS.vehicle);
    }

    try {
        const car = await carModel.findById(param);
        if (!car) throw new Error('Car not found');

        const fields = {
            vehicleID: param,
            vehicleMake: car.make,
            vehicleModel: car.model,
            vehicleRegNr: car.registrationNumber,
            vehicleYear: car.year,
            vehiclePrice: car.pricePerDay,
            vehicleImages: car.images.toString(),
            vehicleNotes: car.notes
        };

        template = processSelectFields(template, car, ['type', 'gearboxType', 'fuelType', 'status']);
        return replaceTemplateFields(template, fields);
    } catch (err) {
        throw new Error('Error fetching car');
    }
}

module.exports = {loadCatalogue, loadVehicle};