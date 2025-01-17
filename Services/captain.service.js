const CaptainModel = require("../models/Captain.model")

module.exports.createCaptain =  async ({
    username, email, password, phoneno,  adharno, location  
}) => {
    if (!username || !email || !password || !phoneno || !adharno || !location) {            
        throw new Error('All fields are required');
    }
    const captain = new CaptainModel({  
        username,
        email,
        password,
        adharno,    
        phoneno ,
        location
    });

    await captain.save();
    return captain;
}


module.exports.getCaptainsByLocation =async (location) => {
    

    if (!location) {
        throw new  Error ("location is needed")
    }

    try {
        const captains = await CaptainModel.find({ location });
        return captains;
    } catch (error) {
        throw new Error("error in fetching captains");
    }
};
