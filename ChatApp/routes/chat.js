var express = require('express');
var router = express.Router();

router.get('/*/init', (request, response) => {
    console.log(request.url)
    response.send('service running correctly');
});

module.exports = router;
