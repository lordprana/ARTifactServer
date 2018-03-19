// seed files stored in Google Drive https://docs.google.com/spreadsheets/d/1VQWPGZ467fxYb97rfgil2FwLHn94pjsrMJfHAW9YY54
// Google Sheets converted to JSON using https://www.csvjson.com/csv2json

const db = require('../db');
const { Piece, Artist } = require('../db/models');

const pieces = require('./piecesSeed.json');

function findOrCreateArtist(piece) {
  const birthYear = piece['Birth Year'] ? piece['Birth Year'] : null;
  const deathYear = piece['Death Year'] ? piece['Death Year'] : null;
  console.log(birthYear);
  console.log(deathYear);
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
      year
    });
  }
}


db.sync({ force: true })
  .then(() => {
    console.log('seeding database...');
    return seedPieces();
  })
  .catch(err => console.log(err))
  .finally(() => {
    db.close();
    console.log('db closed');
    return null;
  });
