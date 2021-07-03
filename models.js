const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
	Title: {type: String, required: true},
	Description: {type: String, required: true},
	Genre: {type:mongoose.Schema.Types.ObjectId, ref: 'Genre'},
	Director: {type:mongoose.Schema.Types.ObjectId, ref: 'Director'},
	ImagePath: String,
	Featured: Boolean,
});

let userSchema = mongoose.Schema({
	Username: {type: String, required: true},
	Password: {type: String, required: true},
	Email: {type: String, required: true},
	Birthday: Date,
	Favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
});

userSchema.statics.hashPassword = password => {
	return bcrypt.hashSync(password, 10);
  };
  
userSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.Password);
};

let directorSchema = mongoose.Schema({
	Name: {type: String, required: true},
	Bio: {type: String, required: true},
	Birth: String,
	Death: String
});

let genreSchema = mongoose.Schema({
	Name: {type: String, required: true},
	Description: {type: String, required: true}
})

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema);
let Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;
