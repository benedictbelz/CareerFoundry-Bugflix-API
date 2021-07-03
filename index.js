const express = require('express');
const morgan = require('morgan');

const Models = require('./models.js');
const Movie = Models.Movie;
const User = Models.User;
const Director = Models.Director;
const Genre = Models.Genre;

const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/Bugflix', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// VALIDATION
const { check, validationResult } = require('express-validator');

// CROSS ORIGIN RESOURCE SHARING
const cors = require('cors');
app.use(cors());

// AUTHENTIFICATION
const auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// HOMEPAGE
app.get('/', (req, res) => {
	res.status(200).send('Welcome to Bugflix');
});

// GET A LIST OF ALL MOVIES
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movie.find()
		.then(movies => {
			res.status(201).json(movies);
		})
		.catch(error => {
			console.error(error);
      		res.status(500).send('Error: ' + error);
		})
});

// GET INFORMATION ABOUT ONE MOVIE
app.get('/movies/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movie.findOne({ Title: req.params.name })
    	.then(user => {
      		res.status(201).json(user);
    	})
    	.catch(error => {
      		console.error(error);
      		res.status(500).send('Error: ' + error);
    	});
});

// GET INFORMATION ABOUT ONE GENRE
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
	Genre.findOne({ Name: req.params.name })
    	.then(user => {
      		res.status(201).json(user);
    	})
    	.catch(error => {
      		console.error(error);
      		res.status(500).send('Error: ' + error);
    	});
});

// GET INFORMATION ABOUT ONE DIRECTOR
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
	Director.findOne({ Name: req.params.name })
    	.then(user => {
      		res.status(201).json(user);
    	})
    	.catch(error => {
      		console.error(error);
      		res.status(500).send('Error: ' + error);
    	});
});

// GET A LIST OF ALL USERS
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
	User.find()
    	.then(users => {
      		res.status(201).json(users);
    	})
    	.catch(error => {
      		console.error(error);
      		res.status(500).send('Error: ' + error);
    	});
});

// GET INFORMATION ABOUT ONE USER
app.get('/users/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
	User.findOne({ Username: req.params.name })
    	.then(user => {
      		res.status(201).json(user);
    	})
    	.catch(error => {
      		console.error(error);
      		res.status(500).send('Error: ' + error);
    	});
});

// POST A NEW USER
app.post('/users', 
	[
    	check('Username', 'Username is required').isLength({min: 5}),
    	check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    	check('Password', 'Password is required').not().isEmpty(),
    	check('Email', 'Email does not appear to be valid').isEmail()
  	],
	(req, res) => {
	let errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
	let hashedPassword = User.hashPassword(req.body.Password);
	User.findOne({ Username: req.body.Username })
		.then(user => {
			if (user)
				return res.status(400).send(req.body.Username + ' already exists.');
			else {
				User
					.create({
						Username: req.body.Username,
						Password: hashedPassword,
						Email: req.body.Email,
						Birthday: req.body.Birthday
					})
					.then(user => res.status(201).json(user))
					.catch(error => {
						console.error(error);
						res.status(500).send('Error: ' + error);
					})
			}
		})
		.catch(error => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		})
});

// UPDATE AN EXISTING USER
app.put('/users/:name', 
	[
		check('Username', 'Username is required').isLength({min: 5}),
		check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail()
	],
	passport.authenticate('jwt', { session: false }), (req, res) => {
	let errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
	let hashedPassword = User.hashPassword(req.body.Password);
	User.findOneAndUpdate({ Username: req.params.name }, { $set:
		{
			Username: req.body.Username,
			Password: hashedPassword,
			Email: req.body.Email,
			Birthday: req.body.Birthday
		}
	},
	{ new: true },
	(error, updatedUser) => {
		if (error) {
			console.error(error);
			res.status(500).send('Error: ' + error);
		} else {
			res.json(updatedUser);
		}
	  });
});

// DELETE AN EXISTING USER
app.delete('/users/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
	User.findOneAndRemove({ Username: req.params.name })
    	.then(user => {
      		if (!user)
        		res.status(400).send(req.params.name + ' was not found');
      		else
        		res.status(200).send(req.params.name + ' was deleted.');

    	})
    	.catch(error => {
      		console.error(error);
      		res.status(500).send('Error: ' + error);
    	});
});

// POST A MOVIE TO FAVOURITES
app.post('/users/:name/favourites/:movie', passport.authenticate('jwt', { session: false }), (req, res) => {
	User.findOneAndUpdate({ Username: req.params.name }, {
		$push: { Favorites: req.params.movie }
	},
	{ new: true },
	(error, updatedUser) => {
		if (error) {
			console.error(error);
			res.status(500).send('Error: ' + error);
		} else {
			res.json(updatedUser);
		}
	});
});

// DELETE A MOVIE FROM FAVOURITES
app.delete('/users/:name/favourites/:movie', passport.authenticate('jwt', { session: false }), (req, res) => {
	User.findOneAndUpdate({ Username: req.params.name }, {
		$pull: { Favorites: req.params.movie }
	},
	{ new: true },
	(error, updatedUser) => {
		if (error) {
			console.error(error);
			res.status(500).send('Error: ' + error);
		} else {
			res.json(updatedUser);
		}
	});
});

// GET A TEAPOT
app.get('/teapot', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.status(418).send('I am a teapot.');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
	console.log('Listening on Port ' + port);
});
