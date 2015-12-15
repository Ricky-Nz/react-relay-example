import mongoose, { Schema } from 'mongoose';

var SegmentSchema = new Schema({
	title: { type: String },
	content: { type: String },
	images: [String],
	mode: { type: String }
});

export var DBBuilding = mongoose.model('DBBuilding', new Schema({
	name: { type: String, required: true },
	index: { type: String },
	order: { type: String },
	category: { type: String },
	promote: { type: Number },
	location: { type: String },
	type: { type: String },
	area: { type: String },
	status: { type: String },
	banner: { type: String },
	thumbnail: { type: String },
	labels: [String],
	segments: [SegmentSchema]
}));

export var DBApp = mongoose.model('DBApp', new Schema({
	bannerCount: { type: Number },
	categories: [String],
	labels: [String],
	projectTypes: [String]
}));

export function createBuilding(fields, files) {
	processFiles(files, fields);
	var building = new DBBuilding();
	Object.assign(building, fields);
	return building.save();
};

export function updateBuilding({id, ...updateFields}, files) {
	return DBBuilding.findById(id).exec().then(building => {
		processFiles(files, updateFields, building);
		Object.assign(building, updateFields);
		return building.update();
	});
}

export function removeBuilding(id) {
	return DBBuilding.findById(id).exec().then(building => {
		deleteFileInExist(building.banner);
		deleteFileInExist(building.thumbnail);
		if (building.segments) {
			building.segments.forEach(segment =>
				segment.images&&segment.images.forEach(image =>
					deleteFileInExist(image)));
		}
		return building.remove();
	});
}

export function findBuildings(labels) {
	let query = {};
	if (labels&&labels.length>0) {
		query.label = { $in: labels };
	}
	return DBBuilding.find(query).sort({order: -1, name: 1}).exec();
}

export function findPromoteBuildings() {
	return DBBuilding.find({promote: { $gt: 0 }}).sort('promote');
}

export function findBuildingById(id) {
	return DBBuilding.findById(id).exec();
};

export function getApp() {
	return DBApp.findOne().exec();
};

export function initApp() {
	var app = new DBApp();
	app.bannerCount = 6;
	app.categories = [];
	app.labels = [];
	app.projectTypes = [];
	return app.save();
}

export function updateApp(fields) {
	return DBApp.findOneAndUpdate({}, fields, {'new': true}).exec();
}

function deleteFileInExist(path) {
	if (path) {
		try {
			fs.unlinkSync(path.join(__dirname, '..', path));
		} catch(e) {
		}
	}
}

function processFiles(files, updateFields, currentData) {
	if (!files) {
		return;
	}

	files.forEach(file => {
		if (file.fieldname === 'banner') {
			deleteFileInExist(currentData&&currentData.banner);
			updateFields.banner = file.path;
		}
		if (file.fieldname === 'thumbnail') {
			deleteFileInExist(currentData&&currentData.thumbnail);
			updateFields.thumbnail = file.path;
		}
		const segmentIndexes = file.fieldname.split('-');
		if (segmentIndexes&&segmentIndexes.length === 3) {
			const segmentIndex = segmentIndexes[1];
			const imageIndex = segmentIndexes[2];
			let segment = updateFields.segments[segmentIndex];
			if (!segment.images) {
				segment.images = [];
			}
			segment.images[imageIndex] = file.path;
		}
	});

	if (updateFields.segments&&currentData&&currentData.segments) {
		let updatedFiles = [];
		updateFields.segments.forEach(segment => {
			segment.images&&segment.images.forEach(image =>
				updateFields.push(image));
		});

		currentData.segments.forEach(segment => {
			segment.images&&segment.images.forEach(image => {
				if (updateFields.indexOf(image) < 0) {
					deleteFileInExist(image);
				}
			});
		});
	}
}



