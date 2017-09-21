let sut;

describe('Instances', () => {
    before(() => {
        sut = require('../../index');
        return createInstanceWithSamePort()
            .then(createInstanceWithSameAddress)
            .then(createInstanceWithSamePortAndAddress);
    });

    describe('.create', () => {
        it('should succeed and insert when all information are correct', (done) => {
            sut.actions.instances
                .subscribe({
                    data: {
                        realm: 'realm',
                        port: 4587,
                        access_token: 'ssdfdfh152'
                    },
                    'HTTP.request': {
                        ip: '192.168.0.15'
                    }
                })
                .then(getInstanceCount)
                .should.be.fulfilled
                .and.eventually.deep.equals(4)
                .and.notify(done);
        });

        it('should succeed and insert when 2 instances have same port different address', (done) => {
            sut.actions.instances
                .subscribe({
                    data: {
                        realm: 'realm',
                        port: 6473,
                        access_token: 'ssdfdfh152'
                    },
                    'HTTP.request': {
                        ip: '192.168.0.214'
                    }
                })
                .then(getInstanceCount)
                .should.be.fulfilled
                .and.eventually.deep.equals(5)
                .and.notify(done);
        });

        it('should succeed and insert when 2 instances have same address different port', (done) => {
            sut.actions.instances
                .subscribe({
                    data: {
                        realm: 'realm',
                        port: 4754,
                        access_token: 'ssdfdfh152'
                    },
                    'HTTP.request': {
                        ip: '192.168.0.2'
                    }
                })
                .then(getInstanceCount)
                .should.be.fulfilled
                .and.eventually.deep.equals(6)
                .and.notify(done);
        });

        it('should succeed and update when 2 instances have same address same port and different realm', (done) => {
            sut.actions.instances
                .subscribe({
                    data: {
                        realm: 'realmB',
                        port: 6475,
                        access_token: 'ssdfdfh152'
                    },
                    'HTTP.request': {
                        ip: '192.168.0.3'
                    }
                }).then(ensureInstanceRealmUpdated)
                .then(getInstanceCount)
                .should.be.fulfilled
                .and.eventually.deep.equals(6)
                .and.notify(done);
        });
    });

    after(() => {
        sut.models.Instance.remove();
    });
});

function ensureInstanceRealmUpdated() {
    return sut.models.Instance.findOne({
        port: 6475,
        address: '192.168.0.3'
    })
        .then(i => i || Promise.reject())
        .then(i => (i.realm !== 'realmB') ? Promise.reject('instance not updated') : true);
}

function getInstanceCount() {
    return sut.models.Instance.count({}, count => count);
}

function createInstanceWithSamePort() {
    return sut.models.Instance
        .create({
            realm: 'realm',
            port: 6473,
            access_token: 'ssdfdfh152',
            address: '192.168.0.1'
        });
}

function createInstanceWithSameAddress() {
    return sut.models.Instance
        .create({
            realm: 'realm',
            port: 6474,
            access_token: 'ssdfdfh152',
            address: '192.168.0.2'
        });
}

function createInstanceWithSamePortAndAddress() {
    return sut.models.Instance
        .create({
            realm: 'realmA',
            port: 6475,
            access_token: 'ssdfdfh152',
            address: '192.168.0.3'
        });
}

