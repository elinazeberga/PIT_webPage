const carModel = require('../models/car');
const DEFAULT_FIELDS = require('../constants/defaultFields');
const createVehicleTableRow = require('../renderers/vehicleRenderer');
const {processSelectFields, replaceTemplateFields} = require('../renderers/rendererUtils');

// Load vehicle table content
async function loadCatalogue() {
    try {
        // Load all cars
        const cars = await carModel.find();
        // Create rows for each car and join them together
        return cars.map(car => createVehicleTableRow(car.toObject())).join('');
    } catch (error) {
        throw new Error(`Failed to load catalogue: ${error.message}`);
    }
}
// Load data for a single vehicle
async function loadVehicle(template, param) {
    // If we are creating a vehicle user, replace template fields
    if (param === 'new') {
        return replaceTemplateFields(template, DEFAULT_FIELDS.vehicle);
    }

    try {
        // Load vehicle information
        const car = await carModel.findById(param);
        if (!car) throw new Error('Car not found');
        // Replace default fields
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
        // Process select fields to
        // show the associated values
        template = processSelectFields(template, car, ['type', 'gearboxType', 'fuelType', 'status']);
        return replaceTemplateFields(template, fields); // Replace input fields and return processed template
    } catch (err) { // Error handling
        throw new Error('Error fetching car');
    }
}

module.exports = {loadCatalogue, loadVehicle};