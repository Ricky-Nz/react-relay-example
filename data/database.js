import mongoose, { Schema } from 'mongoose';

export var DBBuilding = mongoose.model('DBBuilding', new Schema({
	userId: { type: Schema.Types.ObjectId, required: true },
	title: { type: String, required: true },
	index: { type: String, required: true },
	description: { type: String },
	thumbnail: { type: String },
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

export function createBuilding(userId, title, index, description, thumbnail, labels) {
	var building = new DBBuilding();
	building.userId = userId;
	building.title = title;
	building.index = index;
	building.description = description;
	building.thumbnail = thumbnail;
	building.labels = labels;
	return building.save();
};

export function updateBuilding(id, title, index, description, thumbnail, labels) {
	let updateFields = {};
	if (typeof title !== 'undefined') {
		updateFields.title = title;
	}
	if (typeof index !== 'undefined') {
		updateFields.index = index;
	}
	if (typeof description !== 'undefined') {
		updateFields.description = description;
	}
	if (typeof thumbnail !== 'undefined') {
		updateFields.thumbnail = thumbnail;
	}
	if (typeof labels !== 'undefined') {
		updateFields.labels = labels;
	}
	return DBBuilding.findOneAndUpdate({_id: id}, updateFields, {'new': true}).exec();
}

export function removeBuilding(id) {
	return DBBuilding.findOneAndRemove({_id: id}).exec();
}



