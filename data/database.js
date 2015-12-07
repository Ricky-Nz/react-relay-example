import mongoose, { Schema } from 'mongoose';

var SegmentSchema = new Schema({
	title: { type: String },
	content: { type: String },
	images: [String],
	mode: { type: String }
});

export var DBBuilding = mongoose.model('DBBuilding', new Schema({
	userId: { type: Schema.Types.ObjectId, required: true },
	name: { type: String, required: true },
	index: { type: String },
	order: { type: String },
	category: { type: String },
	label: { type: String },
	promote: { type: Number },
	location: { type: String },
	type: { type: String },
	area: { type: String },
	status: { type: String },
	banner: { type: String },
	thumbnail: { type: String },
	segments: [SegmentSchema]
}));

export var DBUser = mongoose.model('DBUser', new Schema({
	name: { type: String, unique: true, required: true },
	bannerCount: { type: Number },
	categories: [String],
	labels: [String],
	projectTypes: [String]
}));

export function findBuildingsByUser(userId) {
	return DBBuilding.find({userId}).sort({order: -1, name: 1}).exec();
}

export function findPromoteBuildingsByUser(userId) {
	return DBBuilding.find({userId, promote: { $gt: 0 }}).sort('promote');
}

export function findBuildingById(id) {
	return DBBuilding.findById(id).exec();
};

export function findUserByName(name) {
	return DBUser.findOne({name}).exec();
};

export function findUserById(id) {
	return DBUser.findById(id).exec();
};

export function createUser(name) {
	var user = new DBUser();
	user.name = name;
	return user.save();
}

export function updateUser({name, ...updateFields}) {
	return DBUser.findOneAndUpdate({name: name}, updateFields, {'new': true}).exec();
}

function assignFiles(fields, files) {
	if (!files) {
		return;
	}

	files.forEach(file => {
		if (file.fieldname === 'banner') {
			fields.banner = file.path;
		}
		if (file.fieldname === 'thumbnail') {
			fields.thumbnail = file.path;
		}
		const segmentIndexes = file.fieldname.split('-');
		if (segmentIndexes&&segmentIndexes.length === 3) {
			const segmentIndex = segmentIndexes[1];
			const imageIndex = segmentIndexes[2];
			let segment = fields.segments[segmentIndex];
			if (!segment.images) {
				segment.images = [];
			}
			segment.images[imageIndex] = file.path;
		}
	});
}

export function createBuilding(fields, files) {
	assignFiles(fields, files);
	var building = new DBBuilding();
	Object.assign(building, fields);
	return building.save();
};

export function updateBuilding({id, ...updateFields}, files) {
	assignFiles(updateFields, files);
	return DBBuilding.findOneAndUpdate({_id: id}, updateFields, {'new': true}).exec();
}

export function removeBuilding(id) {
	return DBBuilding.findOneAndRemove({_id: id}).exec();
}



