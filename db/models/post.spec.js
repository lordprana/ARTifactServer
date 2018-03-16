/* global describe beforeEach it */

const { expect } = require('chai')
const db = require('../index')
const post = db.model('post')

describe('post model', () => {
    beforeEach(() => {
      return db.sync({ force: true })
    })
  
    it('has the expected schema definition', () => {
      expect(post.attributes.userName).to.be.an('object');
      expect(post.attributes.subjectLine).to.be.an('object');
      expect(post.attributes.content).to.be.an('object');
      expect(post.attributes.score).to.be.an('object');
    });
  })