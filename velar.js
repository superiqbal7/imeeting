const velar = require('velar');

var dir = 'src/assets/',
    vendors = {
        "twitter-bootstrap": "latest",
        "jquery": "latest",
        "font-awesome": "4.7.0"
    };

velar.create(vendors, dir);