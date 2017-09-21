process.on('unhandledRejection', () => {
}); // workaround about https://github.com/domenic/chai-as-promised/issues/173

let sut;

describe('.next', () => {
    before(() => {
        sut = require('../index');
        return createInstances();
    });

    let firstInstance;

    it('should return an instance if at least one is available', () =>
        sut
            .next({ realm: 'realm' })
            .then(instance => instance.realm === 'realm' || Promise.reject('invalid realm'))
            .should.be.fulfilled
    );

    it('should return a different instance if some available', () =>
        sut
            .next({ realm: 'realm' })
            .then(instance => firstInstance = instance)
            .then(instance => sut.next({ realm: 'realm' }))
            .then(instance => (instance._id.toString() === firstInstance._id.toString()) ? Promise.reject('Same instance returned twice') : true)
            .should.be.fulfilled
    );

    it('should fail if no instance available', () =>
        sut
            .next({ realm: 'bar' })
            .should.be.rejected
            .and.eventually.have.property('message', 'service.bar.unavailable')
    );

    after(() => sut.models.Instance.remove());
});

function createInstances() {
    return Promise.all([
        sut.models.Instance.create({
            realm: 'realm',
            port: 8080,
            access_token: 'ssdfdfh152',
            address: '10.558.0.1'
        }),
        sut.models.Instance.create({
            realm: 'realm',
            port: 6060,
            access_token: 'ssdfdfh152',
            address: '11.12.25O.1'
        })
    ]);
}
