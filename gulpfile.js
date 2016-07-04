var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var browserSync = require('browser-sync').create();
var paths = {
	pages: ['src/*.html'],
	dist: './dist'
};

var watchedBrowserify = watchify(browserify({
	basedir: '.',
	debug: true,
	entries: ['src/main.ts'],
	cache: {},
	packageCache: {}
}).plugin(tsify));

watchedBrowserify.on("update", function (file) {
	console.log("updated file(s):", file)
	bundle();
	browserSync.reload()
});
watchedBrowserify.on("log", gutil.log);

function bundle() {
	return watchedBrowserify
		.bundle()
		.on('error', function (err) {
			console.log(err.message);
			browserSync.notify(err.message, 3000);
			this.emit('end');
		})
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(paths.dist));
};

//Gulp Tasks
gulp.task("copy-html", function () {
	return gulp.src(paths.pages)
		.pipe(gulp.dest(paths.dist));
});

gulp.task("default", ["copy-html"], bundle);

gulp.task('serve', ["default"], function () {
	browserSync.init({
		server: {
			baseDir: paths.dist
		}
	});
});
