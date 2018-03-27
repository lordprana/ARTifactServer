// seed files stored in Google Drive https://docs.google.com/spreadsheets/d/1VQWPGZ467fxYb97rfgil2FwLHn94pjsrMJfHAW9YY54
// Google Sheets converted to JSON using https://www.csvjson.com/csv2json

const db = require('../db');
const { Piece, Artist, Post, User, Museum } = require('../db/models');

const pieces = require('./piecesSeed.json');
const posts = require('./postsSeed.json');
const users = require('./usersSeed.json');
const museums = require('./museumSeed.json');

function findOrCreateArtist(piece) {
  const birthYear = piece['Birth Year'] ? piece['Birth Year'] : null;
  const deathYear = piece['Death Year'] ? piece['Death Year'] : null;
  return Artist.findOrCreate({
    where: {
      name: piece['Artist Name'],
      birthYear,
      deathYear
    }
  });
}

async function seedPieces() {
  for (let i = 0; i < pieces.length; i++) {
    // If there is an empty record, break out of callback
    if (!pieces[i]['Piece name']) continue ;
    const year = pieces[i]['Year created'] ? pieces[i]['Year created'] : null;

    let [artist, _] = await findOrCreateArtist(pieces[i]);
    await Piece.create({
      name: pieces[i]['Piece name'],
      artistId: artist.id,

      year,
      pictureUrl: pieces[i]['pictureUrl'],
      museumId: 1, //set to 1 because all seed pieces are from the whitney
    });
  }
}

async function seedMuseum(){
  await Museum.create({
    name: 'Whitney',
    latitude: 12,
    longitude: 5
  })
}

async function seedUsers(){
  for (let i = 0; i < users.length; i++){
    let user = await User.create({
      userName: users[i].userName,
      email: users[i].email
    });
    user.addFavoritePiece(1);
    // Each user should have a unique favorite piece for testing the
    // recommendation engine
    if (user.id !== 1) user.addFavoritePiece(user.id);
}
}

async function seedPosts() {
  for (let i = 0; i < posts.length; i++) {
    // If there is an empty record, break out of callback
    // let [artist, _] = await findOrCreateArtist(pieces[i]);
    await Post.create({
      subjectLine: posts[i].subjectLine,
      content: posts[i].content,
      votes: posts[i].votes,
      userId: posts[i].userId,
      pieceId: posts[i].pieceId,
      parentId: posts[i].parentId
    });
  }
}

async function seedMuseums() {
  for(let i = 0; i < museums.length; i++){
    await Museum.create({
      name: museums[i].name,
      latitude: museums[i].latitude,
      longitude: museums[i].longitude
    })
  }
}

db.sync({ force: true })
  .then(() => {
    return seedMuseums();
  })
  .then(() => {
    console.log('seeding database...');
    return seedMuseum();
  })
  .then(() => {
    return seedPieces();
  })
  .then(() => {
    return seedUsers();
  })
  .then(() => {
    return seedPosts();
  })
  .catch(err => console.log(err))
  .finally(() => {
    db.close();
    console.log('db closed');
    return null;
  });
