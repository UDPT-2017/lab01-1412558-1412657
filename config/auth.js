module.exports = {

    'facebookAuth' : {
        'clientID'      : '1304675552973165', // your App ID
        'clientSecret'  : '74ef2a02bcb69e4d28e18fe5bc0f39c2', // your App Secret
        'callbackURL'   : 'postgres://sgerlaqitnjgaw:e7ff259a2f5b7e9ad34ce5381902494c5f192a6be060c73e52c81afed424c942@ec2-23-21-76-49.compute-1.amazonaws.com:5432/dfmt3a3fiqljkn'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8888/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8888/auth/google/callback'
    }

};