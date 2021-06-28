const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models.js');
const passportJWT = require('passport-jwt');

let User = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

passport.use(
	new LocalStrategy(
		{
			usernameField: 'Username',
			passwordField: 'Password',
		},
		(username, password, callback) => {
			console.log(username + '  ' + password);
			User.findOne({Username: username}, (error, user) => {
				if (error) return callback(error);
				if (!user)
					return callback(null, false, {
						message: 'Incorrect username or password.',
					});
				return callback(null, user);
			});
		}
	)
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'your_jwt_secret',
		},
		(jwtPayload, callback) => {
			return User.findById(jwtPayload._id)
				.then((user) => {
					return callback(null, user);
				})
				.catch((error) => {
					return callback(error);
				});
		}
	)
);
