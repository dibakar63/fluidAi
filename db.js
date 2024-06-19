const mongoose = require('mongoose');

const connections = {};

const getDbConnection = async (customerId) => {
    if (!connections[customerId]) {
        const dbUri = `mongodb+srv://dibakardey63:QcGlGmtwkZ4PzopS@recipes.rglhoml.mongodb.net/fluidAi`;
        const connection = mongoose.createConnection(dbUri);
        
        connection.on('connected', () => {
            console.log(`Connected to MongoDB for hotel ${customerId}`);
        });

        connection.on('error', (err) => {
            console.log(`Failed to connect to MongoDB for hotel ${customerId}: ${err}`);
        });

        connections[customerId] = connection;
    }
    return connections[customerId];
};

module.exports = getDbConnection;
