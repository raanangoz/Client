 var express = require('express');
 var path = require('path');
 var express2 = express();

 express2.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
 });
//
express2.use(express.static(__dirname)); // set static files location, in this case the route, add a file name if not
 express2.listen(process.env.PORT || 3000);