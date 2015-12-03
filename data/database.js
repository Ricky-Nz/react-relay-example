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
	location: { type: String },
	type: { type: String },
	area: { type: String },
	status: { type: String },
	banner: { type: String },
	thumbnail: { type: String },
	segments: [SegmentSchema],
	labels: [String]
}));

export var DBUser = mongoose.model('DBUser', new Schema({
	name: { type: String, unique: true, required: true }
}));

export function findBuildingsByUser(userId) {
	return DBBuilding.find({userId}).exec();
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



