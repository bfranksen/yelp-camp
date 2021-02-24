const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	await Review.deleteMany({});
	for (let i = 0; i < 250; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const campground = new Campground({
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url:
						'https://res.cloudinary.com/bfranksen/image/upload/v1614078431/YelpCamp/arhwihhzxpgq0zxwp4ug.png',
					filename: 'YelpCamp/arhwihhzxpgq0zxwp4ug',
				},
				{
					url:
						'https://res.cloudinary.com/bfranksen/image/upload/v1614078431/YelpCamp/rcw3ezbg3sxzaavpdpgn.png',
					filename: 'YelpCamp/rcw3ezbg3sxzaavpdpgn',
				},
			],
			geometry: {
				type: 'Point',
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			price,
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio non nam tempora adipisci corporis quis quibusdam. Possimus molestias laboriosam facere optio dolorum doloremque iste recusandae ipsum! Adipisci fugiat illum praesentium.',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			author: '603495ddafba2e28e4d115d2',
		});
		await campground.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
