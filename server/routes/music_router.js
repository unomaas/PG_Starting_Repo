const express = require('express');
const router = express.Router();
// Bare minimum for setting up PG:
// PG Configuration Below (Local Only): 
const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool({
  database: 'music_library', // Needs to match whatever it's named as in Postico. 
  host: 'localhost',
  port: 5432, // Where the database is running, not our server on 5000. 
});
// Niceties configurations below:
// Whenever pool connects, it'll run this console log
pool.on('connect', () => {
  console.log('Connected to POSTGRES');
});
pool.on('error', (error) => {
  console.log('Error to POSTGRES:', error);
});


// Retrieve all of the songs from the DB, send back in res. 
router.get( '/', ( req, res ) => {
  const queryText = `SELECT * FROM "songs" ORDER BY "id" DESC;`; // Make sure it works in Postico query before putting it in JS. Always use back ticks. 
  // 'pool' variable is our database in this file, due to PG setup. 
  // Goal is to send query to DB:
  pool.query( queryText ) // pool.query is a promise, like .Ajax.  Takes time.
  // .then runs when pool.query gets back:
  .then( result => {
    // This is our only guarantee that the query is done:
    console.log( result.rows ); // Result is huge, result.rows is our selected data. 
    res.send(  result.rows );
  }).catch( error => {
    // If the pool.query fails:
    console.log( error );
    res.sendStatus( 500 ); // Server error, not client error. 
  })
});

router.post('/', (req, res) => {
  // musicLibrary.push(req.body);
  // QUERY:
  let queryText = `insert into "songs" ("rank", "track", "artist", "published")
  values ($1, $2, $3, $4);`;
  // SECURITY ALERT: Sanitize your inputs:
  let values = [req.body.rank, req.body.track, req.body.artist, req.body.published];

  pool.query( queryText, values )
  .then( result => {
    console.log( result.rows ); 
    res.sendStatus( 201 );
  }).catch( error => {
    console.log( error );
    res.sendStatus( 500 );  
  });
});

module.exports = router;

// let musicLibrary = [
//     {
//         rank: 355, 
//         artist: 'Ke$ha', 
//         track: 'Tik-Toc', 
//         published: '1/1/2009'
//     },
//     {
//         rank: 356, 
//         artist: 'Gene Autry', 
//         track: 'Rudolph, the Red-Nosed Reindeer', 
//         published: '1/1/1949'
//     },
//     {
//         rank: 357, 
//         artist: 'Oasis', 
//         track: 'Wonderwall', 
//         published: '1/1/1996'
//     }
// ];