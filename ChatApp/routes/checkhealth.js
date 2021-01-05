var express = require('express');
var router = express.Router();

router.get('/', (request, response) => {
    response.send('service running correctly');
});

module.exports = router;
