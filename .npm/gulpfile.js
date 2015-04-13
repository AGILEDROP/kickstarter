/**
 * Gulp file for managing tasks
 *
 * To get started first run *sudo npm install* to get all required modules
 * Once setup run *gulp watch* to start watching your files and running their respective tasks
 */

// Main gulp requirement
var gulp = require('gulp'),

// Styles task requirements
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
autoprefixer = require('gulp-autoprefixer'),

// Scripts task requirements
jshint = require('gulp-jshint'),
stylish = require('jshint-stylish'),

// Images task requirements
imagemin = require('gulp-imagemin'),
cache = require('gulp-cache'),
svgo = require('gulp-svgo'),

// Notification scripts
plumber = require('gulp-plumber'),
notify = require('gulp-notify'),

// Renaming files
rename = require('gulp-rename'),

// Gulp utilities
util = require('gulp-util');

// Set default variables
var paths = {
	images: '../images',
	scripts: {
		app: '../scripts/app'
	},
	styles: {
		sass: '../sass',
		css: '../stylesheets'
	}
}

var app = {
	browser: 'com.google.Chrome.canary',
	terminal: 'com.apple.Terminal'
}

// Messages data for gulp-notify to display
var messages = {
	error: function(err) {
		notify.onError({
			title: 'Error',
			message: 'Gulp reported error: <%= error.message %>!',
			sound: 'Basso',
			activate: app.terminal,
			sender: app.terminal
		}) (err);

		this.emit('end');
	},
	success: {
		title: 'Success',
		message: 'Gulp tasks completed successfully!',
		activate: app.browser,
		sender: app.terminal,
		onLast: true
	}
}

// Stylesheets tasks
gulp.task('styles', function() {
	return gulp.src(paths.styles.sass + '/*.scss')
		.pipe(plumber({
			errorHandler: messages.error
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'firefox >= 20', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
		}))
		.pipe(sourcemaps.write(paths.styles.css))
		.pipe(gulp.dest(paths.styles.css))
		.pipe(notify(messages.success));
});

// Run app script only task
gulp.task('scripts', function() {
	return gulp.src(paths.scripts.app + '/*.js')
		.pipe(plumber({
			errorHandler: messages.error
		}))
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'))
		.pipe(notify(messages.success))
});

// Run image files task
gulp.task('images', function() {
	return gulp.src(paths.images + '/**/*', '!' + paths.images + '/**/*.svg')
		.pipe(plumber({
			errorHandler: messages.error
		}))
		.pipe(cache(imagemin({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest(paths.images))
		.pipe(notify(messages.success))
});

// Run SVG minify task
gulp.task('svg', function() {
	return gulp.src(paths.images + '/**/*.svg')
		.pipe(plumber({
			errorHandler: messages.error
		}))
		.pipe(svgo())
		.pipe(gulp.dest(paths.images))
		.pipe(notify(messages.success))
});

// Default Gulp task to Run
gulp.task('default', function() {
	gulp.start('styles', 'scripts', 'images', 'svg');
});

// Watch changes on files and run their respective tasks
gulp.task('watch', function() {
	// Watch for .scss files
	gulp.watch(paths.styles.sass + '/**/*.scss', ['styles']);

	// Watch for app .js files
	gulp.watch(paths.scripts.app + '/*.js', ['scripts']);

	// Watch for new images
	gulp.watch([paths.images + '/**/*', '!' + paths.images + '/**/*.svg'], ['images']);

	// Watch for new SVG files
	gulp.watch(paths.images + '/**/*.svg', ['svg']);
});
