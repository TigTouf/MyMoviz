/* PENSEZ A LANCER VOTRE BACKEND SUR LE PORT 3000 ET VOTRE FRONT SUR LE 3001 */

const router = require('express').Router();
const mongoose = require('mongoose')
const request = require('request');

const apiKey = ''; // Votre clé API
const dbUrl = ''; // Votre url mlab

const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true
};
mongoose.connect(dbUrl, options, function(error) {
  if (error) {
    console.error(error);
  }
});

const movieSchema = mongoose.Schema({title: String, overview: String, poster_path: String, idMovieDB: Number});
const MovieModel = mongoose.model('movies', movieSchema);

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', {title: 'Express'});
// });

router.get('/movies', function(req, res, next) {
  //  Je veux récupérer les données de mon API et les afficher
  request(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&page=1&sort_by=popularity.desc&include_adult=false&include_video=false`, function(error, response, body) {
    body = JSON.parse(body);
    res.json({result: true, movieList: body.results});
  });
});

router.get('/mymovies', function(req, res, next) {
  // Je veux récupérer les données likées de ma DB
  MovieModel.find(function(error, movies) {
    res.json({result: true, movies});
  });
});

router.post('/mymovies', function(req, res) {
  // Envoyer un film à la db
  // On sauvegarde un "newMovie" selon le modèle MovieModel pour sauvegarder une data dans la DB
  var newMovie = new MovieModel({
    title: req.body.title,
    overview: req.body.overview,
    poster_path: req.body.poster_path,
    idMovieDB: req.body.idMovieDB
  });
  newMovie.save(function(error, movie) {
    res.json({result: true, movie});
  });
});

router.delete('/mymovies/:movieId', function(req, res) {
  // Supprimer un film de la db en utilisant le "params" spécifié dans l'url ":movieId"
  MovieModel.deleteOne({
    idMovieDB: req.params.movieId
  }, function(error, response) {
    res.json({result: true});
    // Lorsqu'on passe 2 paramètres a la fonction de callback du deleteOne/deleteMany, le second correspond à la réponse du delete et la propriété "n" correspond on nombre d'éléments supprimés (ici 0 ou 1 car on utilise deleteOne)
    // if (response.n != 0) {
    //   res.json({result: true, message: 'deleted 1 movie'});
    // } else {
    //   res.json({result: true, message: 'deleted 0 movie'});
    // }
  });
});

module.exports = router;
