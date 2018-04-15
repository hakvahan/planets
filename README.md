For running the application you will need:

 mongodb instance running on localhost otherwise the host shall be changed in config/dev.json
 to point to monogdb instance

 command you need to run
    npm install
    npm start

 By default the program uses port 8080


 For authorization use the endpoint  localhost:8080/login
 POST:
 params: username=admin, password=1234 ( in body )
 you will be given an api key

 Use that key by appending it to you query ( Ex: localhost:8080/planetId/12312312/commment?key=theKey
 or send it with headers with name "api_key"


Notes:
 internal id is kept using the "_id"
 while the swapi api is the "swapi_key"
 in the response
 
Api calls use the internal ids

Tests can be found in test folder
