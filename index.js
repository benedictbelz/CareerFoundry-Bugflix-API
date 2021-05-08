const express = require('express'),
	morgan = require('morgan');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
	res.status(200).send('Welcome to Bugflix');
});

app.get('/movies', (req, res) => {
	res.status(200).send('Here is the list of all movies.');
});

app.get('/movies/:name', (req, res) => {
	res.status(200).send('Here is all information about this movie.');
});

app.get('/genres/:name', (req, res) => {
	res.status(200).send('Here is all information about this genre.');
});

app.get('/directors/:name', (req, res) => {
	res.status(200).send('Here is all information about this director.');
});

app.post('/users', (req, res) => {
	res.status(201).send('Your account has been successfully created.');
});

app.put('/users/:name', (req, res) => {
	res.status(201).send('Your account has been successfully updated.');
});

app.delete('/users/:name', (req, res) => {
	res.status(200).send('Your account has been successfully removed.');
});

app.post('/users/:name/favourites/:movie', (req, res) => {
	res.status(201).send('The movie has been successfully added to your favourites list.');
});

app.delete('/users/:name/favourites/:movie', (req, res) => {
	res.status(200).send('The movie has been successfully removed from your favourites list.');
});

app.get('/teapot', (req, res) => {
	res.status(418).send('I am a teapot.');
});

app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});
