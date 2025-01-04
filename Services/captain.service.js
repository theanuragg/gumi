const CaptainModel = require("../models/Captain.model")

module.exports.createCaptain =  async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType, lat, long
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType || !lat || !long) {
        throw new Error('All fields are required');
    }
    const captain = new CaptainModel({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vechile: {
            color,
            plate,
            capacity,
            vehicleType,
            location: {
                lat,
                long
            }
        }
    });
}