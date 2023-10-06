module.exports = {
    loadGlobals: app => {
        require(`../middleware`).bootstrap();
        require(`../helper`).bootstrap();
        require(`../validators`).bootstrap();

        const lodash = require('lodash');
        global._ = lodash;
    }
}