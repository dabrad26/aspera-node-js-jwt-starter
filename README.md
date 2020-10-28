# Aspera on Cloud NodeJS JWT Quick Start Application

This application gets you up and running creating JWT tokens and getting back the Bearer token for making calls to the Aspera on Cloud API.  This is provided as a quick start application and has no warranty and should be used to guide your application's development.

## Getting Started

- Create an integration Client via the Admin application in Aspera on Cloud.  Use `blank` or `none` for Redirect URI field in order to save.  After saving switch to JWT Tab and enable JWT and save.
- To create keys used by this test app run following command (do not enter a passphrase)
```bash
    ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
```
- Then run:
```bash
    openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```
- Copy content of jwtRS256.key.pub into AoC PEM (can add to the Integration directly or for a specific user)
- `jwtRS256.key` will be used here as private key. Expected to be next to the index.js file

## Getting the key

- Run `npm install` to setup Node
- Fill out the information in the `clientData` object in [index.js](index.js)
- Run `npm start` this will console the following:
```bash
    Scope: user:all
    Expires In (Seconds): 86399
    Bearer Token: [TOKEN]
```
- Copy the token and use it for making API calls to Aspera on Cloud.