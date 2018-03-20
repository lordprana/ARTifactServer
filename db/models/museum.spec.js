/* global describe beforeEach it */

const { expect } = require('chai')
const db = require('../index')
const museum = db.model('museum')

describe('museum model', () => {
    beforeEach(() => {
      return db.sync({ force: true })
    })

    it('has the expected schema definition', () => {
      expect(museum.attributes.name).to.be.an('object');
      expect(museum.attributes.location).to.be.an('object');

    });
  })
