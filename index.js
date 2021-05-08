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
	res.send('Welcome to Bugflix');
});

app.get('/movies', (req, res) => {
	res.json({
		top10: [
			'Apokalypse Now',
			'Inception',
			'Children of Men',
			'No Counrty for Old Men',
			'City of God',
			'Hero',
			'Waking Life',
			'Minority Report',
			'Fight Club',
			'Pulp Fiction',
			'Joker',
		],
	});
});

app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});
