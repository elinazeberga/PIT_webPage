const fs = require('fs').promises;
const pages = require('../templates/pages');
const {
    loadPayments,
    loadPayment
} = require('../dataLoaders/paymentLoading');
const {
    loadUsers,
    loadUser
} = require('../dataLoaders/userLoading');
const {
    loadReservations,
    loadReservation
} = require('../dataLoaders/reservationLoading');
const {
    loadCatalogue,
    loadVehicle
} = require('../dataLoaders/vehicleLoading');

async function processPage(page, template, param) {
    const navigationPane = await fs.readFile(pages['navigation'], 'utf-8');
    const pageHandlers = {
        catalogue: async () => [navigationPane, template.replace('{{tableData}}', await loadCatalogue())],
        vehicle: async () => {
            const vehicleScript = await fs.readFile(pages['vehiclescript'], 'utf-8');
            return [navigationPane, await loadVehicle(template, param), vehicleScript];
        },
        reservations: async () => [navigationPane, template.replace('{{tableData}}', await loadReservations())],
        reservation: async () => {
            const reservationScript = await fs.readFile(pages['reservationscript'], 'utf-8');
            return [navigationPane, await loadReservation(template, param), reservationScript];
        },
        users: async () => [navigationPane, template.replace('{{tableData}}', await loadUsers())],
        user: async () => {
            const userScript = await fs.readFile(pages['userscript'], 'utf-8');
            return [navigationPane, await loadUser(template, param), userScript];
        },
        payments: async () => [navigationPane, template.replace('{{tableData}}', await loadPayments())],
        payment: async () => {
            const paymentScript = await fs.readFile(pages['paymentscript'], 'utf-8');
            return [navigationPane, await loadPayment(template, param), paymentScript];
        },
        home: async () => [navigationPane, template]
    };

    const handler = pageHandlers[page];
    if (!handler) {
        throw new Error(`No handler found for page: ${page}`);
    }

    return handler();
}

module.exports = processPage;