var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = 'www';
var LIVERELOAD_PORT = 35729;

gulp.task('lint', function () {
  gulp.src('./index.js').pipe(jshint()).pipe(jshint.reporter('default'));
});

var sassFiles = './www/scss/**/*.scss';

gulp.task('sass', function () {
  gulp.src(sassFiles)
      .pipe(sass())
      .pipe(gulp.dest('./www/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch([sassFiles], ['sass']);
});

var testFileStream = gulp.src(['www/bower_components/firebase/firebase.js',
                               'www/bower_components/angular/angular.js',
                               'www/bower_components/angular-route/angular-route.js',
                               'www/bower_components/angular-mocks/angular-mocks.js',
                               'www/bower_components/angular-animate/angular-animate.js',
                               'www/bower_components/angular-sanitize/angular-sanitize.js',
                               'www/bower_components/angular-ui-router/release/angular-ui-router.js',
                               'www/bower_components/ionic/release/js/ionic.js',
                               'www/bower_components/ionic/release/js/ionic-angular.js',
                               'www/bower_components/underscore/underscore.js',
                               'www/bower_components/achan.cordova/navigator.js',
                               'www/bower_components/achan.ionic.geolocation/src/geolocation.js',
                               'www/bower_components/angular-local-storage/angular-local-storage.js',
                               'www/bower_components/angularfire/angularfire.js',
                               'www/bower_components/firebase-simple-login/firebase-simple-login.js',
                               'test/mocks/**/*.js',
                               'test/spec/**/*.js',
                               'www/js/**/*.js',
                               'www/pins/controllers/**/*.js',
                               'www/bower_components/angular-google-maps/dist/angular-google-maps.js',
                               'www/bower_components/angularjs-google-places/dist/angularjs-google-places.min.js']);

gulp.task('test', function () {
  return testFileStream.pipe(karma({
    configFile: 'karma.conf.js',
    action: 'run'
  }));
});

gulp.task('test:watch', function () {
  return testFileStream.pipe(karma({
    configFile: 'karma.conf.js',
    action: 'watch'
  }));
});

function startExpress() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
}

function startLivereload() {
  lr = require('tiny-lr')();
  lr.listen(LIVERELOAD_PORT);
}

function notifyLivereload(event) {
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);

  lr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('docs', function () {
  gulp.src('www/**/*.js').pipe(docco()).pipe(gulp.dest('./docs'));
});

gulp.task('watch', function () {
  startExpress();
  startLivereload();
  gulp.watch(['www/**/*.js', 'www/**/*.html', 'www/**/*.css'], notifyLivereload);
  gulp.watch('www/**/*.scss', ['sass']);
  gulp.watch(['www/**/*.js'], ['docs']);
  gulp.watch(['www/**/*.js', 'test/spec/**/*.js'], ['lint']);
  testFileStream.pipe(karma({ configFile: 'karma.conf.js', action: 'watch' }));
});
