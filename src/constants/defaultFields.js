const DEFAULT_FIELDS = {
    vehicle: {
        vehicleID: "Automatically Generated",
        vehicleMake: "",
        vehicleModel: "",
        vehicleRegNr: "",
        vehicleYear: "",
        vehiclePrice: "",
        vehicleNotes: "",
        vehicleImages: ""
    },
    user: {
        userID: "Automatically Generated",
        userName: "",
        userSurname: "",
        userEmail: "",
        userPhone: "",
        userLicense: ""
    },
    reservation: {
        reservationID: "Automatically Generated",
        reservationDate: "",
        reservationStart: "",
        reservationEnd: "",
        reservationPrice: ""
    },
    payment: {
        paymentID: "Automatically Generated",
        paymentAmount: "",
        paymentDate: "On save"
    }
};

module.exports = DEFAULT_FIELDS;