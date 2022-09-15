const { getAllService } = require("./user.service")

const getAll = (call, callback) => {
    const result = getAllService();
    callback(null, result);
}

module.exports.getAll = getAll;
