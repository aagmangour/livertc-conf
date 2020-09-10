var fs = require('fs');
var PeerServer = require('peer').PeerServer;

var server = PeerServer({
    port: 9000,
    ssl: {
        key: fs.readFileSync('/home/ec2-user/private.key'),
        cert: fs.readFileSync('/home/ec2-user/certificate.crt')
    }
});
