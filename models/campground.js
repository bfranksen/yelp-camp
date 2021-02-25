const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;
const { cloudinary } = require('../cloudinary');

const imageSchema = new Schema({
	url: String,
	filename: String,
});
imageSchema.virtual('thumbnail').get(function () {
	return this.url.replace(
		'/upload',
		'/upload/w_100,h_100,c_fill_pad,g_auto,b_white'
	);
});
imageSchema.virtual('index').get(function () {
	return this.url.replace(
		'/upload',
		'/upload/w_212,h_212,c_fill_pad,g_auto,b_white'
	);
});
imageSchema.virtual('show').get(function () {
	return this.url.replace(
		'/upload',
		'/upload/w_360,h_360,c_fill_pad,g_auto,b_black'
	);
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
	{
		title: String,
		images: {
			type: [imageSchema],
			required: true,
		},
		geometry: {
			type: {
				type: String,
				enum: ['Point'],
				require: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
		price: Number,
		description: String,
		location: String,
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Review',
			},
		],
	},
	opts
);
campgroundSchema.virtual('properties.popupHTML').get(function () {
	return `<strong><a style="font-size: 1.6em;" href="/campgrounds/${
		this._id
	}">${this.title}</a></strong>
		<p style="font-size: 1.1em; margin: 2px 0;">${this.location}</p>
		<p style="font-size: 0.9em; margin-top: 4px; margin-bottom: 0;">${this.description.substring(
			0,
			40
		)}...</p>`;
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
		for (let img of doc.images) {
			await cloudinary.uploader.destroy(img.filename);
		}
	}
});

module.exports = mongoose.model('Campground', campgroundSchema);
