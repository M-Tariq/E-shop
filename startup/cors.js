const cors = require('cors');

module.exports = function (app) {
    const corsOption = { exposedHeaders : '*'};
    app.use(cors(corsOption));
}