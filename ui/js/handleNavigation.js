import { injectHTML } from './utils.js';
import { loadCarList } from './handleCars.js';
import { attachBookingFormHandler } from './handleBookings.js';
import { attachPaymentFormHandler } from './handlePayments.js';
import { attachFormHandlers } from './handleAuth.js';
import { loadUserProfile } from './handleUser.js';

export function navigate(page, payload = null) {
    injectHTML(`pages/${page}.html`, 'content', () => {
        if (page === 'car-list') {
            loadCarList();
        } else if (page === 'booking') {
            attachBookingFormHandler(payload);
        } else if (page === 'payment') {
            attachPaymentFormHandler(payload);
        } else if (page === 'login' || page === 'register') {
            attachFormHandlers();
        } else if (page === 'profile') {
            loadUserProfile();
        }
    });
}