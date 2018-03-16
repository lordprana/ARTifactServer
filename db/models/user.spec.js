const { expect } = require('chai');
const db = require('../index'); 
const user = db.model('user');

describe('user model', () => {
    beforeEach(() => {
       return db.sync({foce: true})
    })
    it('has the correct schema definition', () => {
        expect(user.attributes.userName).to.be.an('object');
        expect(user.attributes.gallery).to.be.an('object');
        expect(user.attributes.email).to.be.an('object');
    })
});