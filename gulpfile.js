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

gulp.task("copy-html", function () {
	return gulp.src(paths.pages)
		.pipe(gulp.dest(paths.dist));
});



gulp.task("bundle", ["copy-html"], function () {
	return bundle()
})
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

gulp.task("default", ["copy-html", "bundle"]);
watchedBrowserify.on("update", function (file) {
	console.log("update", file)
	bundle();
	browserSync.reload()
});
watchedBrowserify.on("log", gutil.log);

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ["default"], function () {

	// Serve files from the root of this project
	browserSync.init({
		server: {
			baseDir: paths.dist
		}
	});
});