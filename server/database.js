import mongoose, { Schema } from 'mongoose';
import fs from 'fs-extra';
import path from 'path';

var SegmentSchema = new Schema({
	title: { type: String },
	content: { type: String },
	images: [String],
	mode: { type: String }
});

export var DBProject = mongoose.model('DBProject', new Schema({
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

export function createProject(fields, files) {
	processFiles(files, fields);
	var project = new DBProject();
	Object.assign(project, fields);
	return project.save();
};

export function updateProject({id, ...updateFields}, files) {
	return DBProject.findById(id).exec().then(project => {
		processFiles(files, updateFields, project);

		return DBProject.findByIdAndUpdate(id, updateFields, {'new': true}).exec();
	});
}

export function removeProject(id) {
	return DBProject.findById(id).exec().then(project => {
		deleteFileInExist(project.banner);
		deleteFileInExist(project.thumbnail);
		if (project.segments) {
			project.segments.forEach(segment =>
				segment.images&&segment.images.forEach(image =>
					deleteFileInExist(image)));
		}
		return project.remove();
	});
}

export function findProjects(labels) {
	let query = {};
	if (labels&&labels.length>0) {
		query.label = { $in: labels };
	}
	return DBProject.find(query).sort({order: -1, name: 1}).exec();
}

export function findPromoteProjects() {
	return DBProject.find({promote: { $gt: 0 }}).sort('promote');
}

export function findProjectById(id) {
	return DBProject.findById(id).exec();
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

function deleteFileInExist(filePath) {
	if (filePath) {
		try {
			fs.removeSync(path.join(__dirname, '..', filePath));
		} catch(e) {
		}
	}
}

function processFiles(files, updateFields, currentData) {
	files&&files.forEach(file => {
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

	if (currentData) {
		if (currentData.banner&&!updateFields.banner) {
			deleteFileInExist(currentData.banner);
		}
		if (currentData.thumbnail&&!updateFields.thumbnail) {
			deleteFileInExist(currentData.thumbnail);
		}

		if (currentData.segments) {
			let newFilePathArray = [];
			updateFields.segments&&updateFields.segments.forEach(segment => {
				segment.images&&segment.images.forEach(image =>
					newFilePathArray.push(image));
			});

			currentData.segments.forEach(segment => {
				segment.images&&segment.images.forEach(image => {
					if (newFilePathArray.indexOf(image) < 0) {
						deleteFileInExist(image);
					}
				});
			});
		}
	}
}



