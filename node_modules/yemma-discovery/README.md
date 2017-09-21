# Yemma-Discovery

[![Build Status](https://travis-ci.org/Digipolitan/yemma-discovery.svg?branch=master)](https://travis-ci.org/Digipolitan/yemma-discovery)
[![Test Coverage](https://codeclimate.com/github/Digipolitan/yemma-discovery/badges/coverage.svg)](https://codeclimate.com/github/Digipolitan/yemma-discovery/coverage)



`Yemma-Discovery` is a thin layer to help you manage your nodes in a micro-services architectures maintained in a **Registry** by [Yemma](https://github.com/Digipolitan/yemma)

Either your application represent a micro-service, either your application is a Gateway and wants to access a node with some specifications.

1. Install `Yemma-Discovery`

```bash
npm i --save yemma-discovery
```

2. To register yourself as a service

`Yemma-Discovery` automatically register itself as a service as soon as it is instanciated.

Before registering yourself, `Yemma-Discovery` will look into some environment variables:

```bash
# Related to the registry
YEMMA_URI=http://localhost.com:9000 #required information about where the registry is hosted
YEMMA_TOKEN=ytoken                  #since the registry is a yemma application it will verify each request with a token (set during yemma configuration)

# Related to the node itself
REALM=admin                          #required to tell the registry for which part of the business the node is responsible
PORT=3030                            #required also, the port where the node is listening
ACCESS_TOKEN=xF%eeT$mbS&             #required also, the secret used to ensure only trusted issuer can make requests
HOST=customHost.org                  #[optional] if the node is behind a proxy, you can set a host, if not, the registry will try to resolve the node'ip address during registration.
```


```javascript
const DisoveryService = require('yemma-discovery');
new DiscoveryService(); // will automatically register the node to the registry
```

**That's it**, you are now **discoverable** from the registry.

You can disable this behavior by passing an option in the constructor.
Meaning you don't have to set information related to the node itself.

```javascript
const DisoveryService = require('yemma-discovery');
new DiscoveryService({ heartBeats: false }); // disable the heartbeat
```


3. Proxy request to registered instances.

If you develop a Gateway, it can be helpful to have a direct access to the registered nodes.


```javascript
const DisoveryService = require('yemma-discovery');
const registry = new DiscoveryService({ heartBeats: false }); // disable the heartbeat

const express = require('express');
const server = express();

server.use(proxy);

function proxy(req, res, next) {
    const components = req.originalUrl.split('/')
    const realm = components[1];

    registry
        .next({realm: realm})
        .then(instance => instance.request('/api/users'))
        .then(response => {
            res.headers = response.headers;
            res.status(response.status(response.statusCode).send(response.data);
        })
        .catch(response => {
            res.status(response.statusCode).send(response.data);
        });
}

server.listen(3000);
console.log('Gateway listening on port 3000');
```



