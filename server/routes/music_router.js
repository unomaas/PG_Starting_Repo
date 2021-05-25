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
  console.log('Connected to POSTGRES on Port:', pool.port);
});
pool.on('error', (error) => {
  console.log('Error to POSTGRES:', error);
});


let musicLibrary = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    res.send(musicLibrary);
});

router.post('/', (req, res) => {
    musicLibrary.push(req.body);
    res.sendStatus(200);
});

module.exports = router;