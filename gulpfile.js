'use strict';

// TODO: Better Feedback (notification, output, ping) on some tasks

var argv = require('yargs').argv;
var auth = require('./auth');
var autoprefixer = require('gulp-autoprefixer');
var bowerFiles = require('main-bower-files');
var del = require('del');
var ftp = require('vinyl-ftp');
var gls = require('gulp-live-server');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var ngAnnotate = require('gulp-ng-annotate');
var ngTemplateCache = require('gulp-angular-templatecache');
var notify = require('gulp-notify');
var protractor = require('gulp-protractor').protractor;
var rename = require('gulp-rename');
var rjs = require('requirejs');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglifyjs');
var webdriver = require("gulp-protractor").webdriver_standalone;
var webdriverUpdate = require("gulp-protractor").webdriver_update;

/**
 * Configuration
 *
 * @type {Object}
 */
var root = 'site';
var config = {
  paths: {
    dev: {
      components: root + '/components',
      pages: root + '/pages',
      assets: root + '/assets',
      css: root + '/assets/css',
      fonts: root + '/assets/fonts',
      images: root + '/assets/img',
      js: root + '/assets/js',
      scss: root + '/assets/scss',
      vendor: root + '/assets/vendor',
      views: root + '/assets/views'
    },
    prod: {
      output: 'dist'
    }
  },
  cdn: {
    host: 'cdn.methodfactory.com',
    remotePath: '/igniter',
    username: auth.cdn.username,
    password: auth.cdn.password
  },
  autoprefixer: {
    versions: [ 'last 5 versions' ]
  }
};

/**
 * Clean out the dist directory
 */
gulp.task('clean:dist', function (cb) {
  return del(config.paths.prod.output, cb);
});

/**
 * Clean out the vendor directory
 */
gulp.task('clean:vendor', function (cb) {
  return del(config.paths.dev.vendor, cb);
});

/**
 * Copy over fonts
 */
gulp.task('copy:fonts', function() {
  return gulp.src(config.paths.dev.fonts)
    .pipe(gulp.dest(config.paths.prod.output));
});

/**
 * Copy over images
 */
gulp.task('copy:images', function() {
  return gulp.src(config.paths.dev.images)
    .pipe(gulp.dest(config.paths.prod.output));
});

/**
 * Move bower files over
 */
gulp.task('copy:bower', [ 'clean:vendor' ], function() {
  return gulp.src(bowerFiles(), { base: './bower_components' })
    .pipe(gulp.dest(config.paths.dev.vendor));
});

/**
 * Cache the template views
 */
gulp.task('cache:templates', function() {
  return gulp.src(config.paths.dev.views + '/**/*.html')
    .pipe(ngTemplateCache({
      moduleSystem: 'RequireJS',
      module: 'mfApp.Templates',
      standalone: true
    }))
    .pipe(gulp.dest(config.paths.dev.js));
});

/**
 * Testing Unit
 */
gulp.task('test:unit', function() {
  return gulp.src(config.paths.dev.tests + '/unit/**/*.js')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: argv.watch ? 'watch' : 'run'
    }))
    .on('error', notify.onError(function() {
      return 'JS Unit Test Error';
    }));
});

/**
 * Testing Protractor
 */
gulp.task('test:e2e', [ 'webdriverUpdate' ], function(cb) {
  var server = gls.new('server.js');

  server.start();

  gulp.src(config.paths.dev.tests + '/e2e/**/*.js')
    .pipe(protractor({
      configFile: 'protractor.conf.js',
      args: [ '--baseUrl', 'http://localhost:6410' ]
    }))
    .on('error', notify.onError(function() {
      return 'JS Unit Test Error';
    }))
    .on('end', function() {
      cb();
      server.stop();
      process.exit();
    });
});

gulp.task('webdriverUpdate', webdriverUpdate);

/**
 * Testing Unit
 */
gulp.task('test', [ 'test:unit', 'test:e2e' ]);

/**
 * Lint the JS Files
 */
gulp.task('lint:js', function() {
  return gulp.src([ config.paths.dev.js + '/**/*.js', '!' + config.paths.dev.js + '/templates.js' ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 * Build out the scss files
 */
gulp.task('build:css', function() {
  var isProd = argv.env === 'prod';
  var destinationPath = isProd ? config.paths.prod.output + '/css' : config.paths.dev.css;

  return sass(config.paths.dev.scss + '/main.scss', {
        style: isProd ? 'compressed' : 'expanded',
        loadPath: config.paths.dev.vendor
      })
      .on('error', notify.onError(function(err) {
        return 'CSS Error:' + err.message;
      }))
    .pipe(autoprefixer({
        browsers: config.autoprefixer.versions,
        cascade: false,
        remove: true
      }))
    .pipe(gulpif(isProd, rename({ suffix: '.min' })))
    .pipe(gulp.dest(destinationPath))
    .pipe(notify('CSS Success: <%= file.relative %>'));
});

/**
 * Build out the js minified file
 */
gulp.task('build:js', function(cb) {
  var options = {
    baseUrl: config.paths.dev.js,
    mainConfigFile: config.paths.dev.js + '/main.js',
    out: config.paths.prod.output + '/js/main.min.js',
    optimize: 'none',
    include: [ 'main' ],
    name: 'almond',
    generateSourceMaps: false,
    preserveLicenseComments: false,
    wrapShim: true
  };

  rjs.optimize(options, function() {
    if (argv.verbose) {
      gutil.log(arguments['0']);
    }

    gulp.src(config.paths.prod.output + '/js/main.min.js')
      .pipe(ngAnnotate())
      .pipe(uglify('main.min.js'))
      .pipe(gulp.dest(config.paths.prod.output + '/js'))
        .on('finish', cb);
  });
});

/**
 * Build Production Assets
 */
gulp.task('build', [ 'clean:dist' ], function(cb) {
  argv.env = 'prod';
  gulp.start([ 'build:css', 'build:js', 'copy:fonts', 'copy:images' ], cb);
});

/**
 * Deploy to CDN
 */
gulp.task('deploy', function() {
  var version = argv.v;
  var srcPath = argv.env === 'prod' ? config.paths.prod.output : config.paths.dev.assets;

  if (! version) {
    gutil.log(gutil.colors.red('A valid version `--v=1.0.0` must be provided.'));
    gutil.beep();

    return;
  }

  if (! srcPath) {
    gutil.log(gutil.colors.red('A valid env must be provided.'));
    gutil.beep();

    return;
  }

  var conn = ftp.create( {
      host: config.cdn.host,
      user: config.cdn.username,
      password: config.cdn.password,
      parallel: 10,
      log: argv.verbose ? gutil.log : false
    });

  conn.rmdir(config.cdn.remotePath + '/' + version, function() {
    return gulp.src(srcPath + '/**/*', { buffer: false })
      .pipe(conn.dest(config.cdn.remotePath + '/' + version));
  });
});

/**
 * Serve up files and watch them
 */
gulp.task('serve', function() {
  var server = gls.new('server.js');

  server.start();

  gulp.watch(config.paths.dev.scss + '/**/*.scss', [ 'build:css' ]);
  gulp.watch(config.paths.dev.views + '/**/*.html', [ 'cache:templates' ]);
  gulp.watch([ config.paths.dev.js + '/**/*.js', '!' + config.paths.dev.js + '/templates.js' ], [ 'lint:js' ]);

  if (argv.withTest) {
    gulp.watch([
      config.paths.dev.js + '/**/*.js',
      '!' + config.paths.dev.js + '/templates.js',
      'tests/**/*.js'
    ], [ 'test' ]);
  }

  gulp.watch([ 'server.js', 'api/**/*.js' ], function(evt) {
    server.start().then(function() {
      server.notify(evt);
    });
  });

  gulp.watch([
    config.paths.dev.fonts + '/**/*',
    config.paths.dev.images + '/**/*',
    config.paths.dev.js + '/**/*.js',
    config.paths.dev.css + '/**/*.css',
    config.paths.dev.vendor + '/**/*',
    config.paths.dev.views + '/**/*',
    config.paths.dev.components + '/**/*.html',
    config.paths.dev.pages + '/**/*.html'
  ], server.notify);
});

/**
 * Default task
 */
gulp.task('default', [ 'build:css' ], function() {
  gulp.start([ 'serve' ]);
});
