/**
 * To create keys used by this test app run following commands:
 * `ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key` (do not add passphrase)
 * `openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub`
 * Copy content of jwtRS256.key.pub into AoC PEM (`jwtRS256.key` will be used here as private key. Expected to be next to this file)
 */
const jwt = require('njwt');
const fs = require('fs');
const https = require('https');

/**
 * This is the ID and Secret you get from the AoC Integration you create. 
 * Email is the user who is associated with the public/private key being used
 * Server is `api.ibmaspera.com` or `api.qa.ibmaspera.com` for QA
 * Org is the organization or subdomain of your AoC instance
 * Scope is the scope for the token.  Check AoC docs for different scopes.
 */
const clientData = {
    id: 'CLIENT_ID',
    secret: 'CLIENT_SECRET',
    email: 'USER_EMAIL',
    org: 'ORG_NAME',
    server: 'api.ibmaspera.com',
    scope: 'user:all',
};

// Get current time in Seconds (nbf and exp take Seconds)
const now = new Date().getTime() / 1000;
const privateKey = fs.readFileSync('jwtRS256.key');
const claims = {
    iss: clientData.id,
    sub: clientData.email,
    aud: `https://${clientData.server}/api/v1/oauth2/token`,
    nbf: now - 60000,
    exp: now + 60000,
};

// Specify alg here as RS256
const jwtToken = jwt.create(claims, privateKey, 'RS256');
const token = jwtToken.compact();

// Make POST with Basic Auth
const basicAuth = Buffer.from(`${clientData.id}:${clientData.secret}`).toString('base64');
const options = {
    hostname: clientData.server,
    port: 443,
    path: `/api/v1/oauth2/${clientData.org}/token?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&scope=${clientData.scope}&assertion=${token}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
    },
};

const req = https.request(options, res => {
    res.on('data', data => {
        const jsonData = JSON.parse(data.toString());
        console.log(`
            Scope: ${jsonData.scope}
            Expires In (Seconds): ${jsonData.expires_in}
            Bearer Token: ${jsonData.access_token}
        `);
    });
});
  
req.on('error', error => {
    console.error(error);
});

req.end();