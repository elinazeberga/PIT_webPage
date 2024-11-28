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

/*  An admin page consists of 3 parts:
        1) Navigation pane
        2) HTML content
        3) JavaScript file*
        * - Optional, usually provided for detailed views

    Pages can be split into 2 categories:
        1) Tables (catalogue, reservations, users, payments)
        2) Detailed views (vehicle, reservation, user, payment)

    Tables show a general view of all entries in the database.

    Detailed views show detailed information of a specific
    database entry and allows for entry editing and deletion.
*/
// Function to process all page elements
async function processPage(page, template, param) {
    // Fetch navigation pane
    const navigationPane = await fs.readFile(pages['navigation'], 'utf-8');
    const pageHandlers = { // Page handler definition
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
    // Get the handler for the associated page
    const handler = pageHandlers[page];
    if (!handler) { // Throw an error if it doesn't exist
        throw new Error(`No handler found for page: ${page}`);
    }
    // Execute the associated handler
    return handler();
}

module.exports = processPage;