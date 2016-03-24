'use strict'

var gulp = require('gulp'),
  nodemon = require("gulp-nodemon"),
  less = require('gulp-less'),
  del = require('del'),
  livereload = require('gulp-livereload'),
  jade = require('gulp-jade'),
  inject = require('gulp-inject'),
  run = require('run-sequence'),
  gutil = require('gulp-util'),
// install = require('gulp-install'),
  rename = require('gulp-rename'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  copy = require('event-stream'),
  concat = require('gulp-concat'),
  filter = require('gulp-filter'),
  rev = require('gulp-rev-all'),
  csso = require('gulp-csso'),
  angularTemplate = require('gulp-angular-templatecache'),
  ngAnnotate = require('gulp-ng-annotate');

var clientDistFolder = 'dist/';

gulp.task('clean', function () {
  return del.sync(['.tmp/', 'dist/','client/app/templates.js'])
});


gulp.task('less', function () {
  var paths = ['client/bower_components', "client/app", 'client/components'];
  return gulp.src('client/app/app.less')
    .pipe(less())
    .pipe(gulp.dest('.tmp/app')).pipe(livereload());
});
gulp.task('jade', function () {
  return gulp.src([
    'client/**/*.jade',
    'client/*.jade',
    '!client/main_temp.jade',
    '!client/app/navbar/*.jade',
    '!client/app/layout/*.jade',
    '!client/app/include/*.jade'
  ])
    .pipe(jade({
      client: false,
      pretty: true
    }))
    .pipe(gulp.dest('.tmp/')).pipe(livereload());
});
gulp.task('inject_js', function () {
  var target = gulp.src(['client/main_temp.html']),
    sources = gulp.src(['client/{app,components}/**/*.js', '!clinet/app/app.js'], {
      read: false
    });
  return target.pipe(inject(sources, {
    transform: function (filePath) {
      filePath = filePath.replace('/client/', '');
      return '<script src="' + filePath + '"></script>'
    },
    starttag: '<!-- injector:js -->',
    endtag: '<!-- endinjector -->'
  }))
    .pipe(rename('main.html'))
    .pipe(gulp.dest('client/'));
});
// gulp.task('bower', function () {
//   gulp.src(['./bower.json'])
//     .pipe(install());
// })
gulp.task('copyDist', function () {
  return copy.merge(
    gulp.src(
      ['.tmp/**/*.html','.tmp/**/*.css','!.tmp/app/**/*.html']
    ).pipe(gulp.dest(clientDistFolder)),
    gulp.src(
      [
        'client/*.{txt,ico,png,xml,html}',
        'client/bower_components/**/*',
        'client/assets/**/*',
        'client/components/**/*.js',
        'client/app/**/*.js',
        '!client/index_temp.html'
      ], {
        base: 'client'
      }
    ).pipe(gulp.dest(clientDistFolder))
  );
})

// gulp.task('minify-css', function () {
//   return gulp.src('styles/*.css')
//     .pipe(minifycss({
//       compatibility: 'ie8'
//     }))
//     .pipe(gulp.dest('client/dist'))
//     .pipe(livereload());
// });

gulp.task('watch', function () {
  livereload.listen({
    host: 'localhost',
    port: 35730,
    start: true
  });
  //var server = livereload.listen();
  gulp.watch('client/**/*.less', ['less'])
  gulp.watch('client/**/*.jade', ['jade']);

  //gulp.watch(['client/.tmp/**/*.*','client/*.*'], function (file) {
  //  console.log(file.path);
  //  server.changed(file.path);
  //});
});
gulp.task('ngtemplates', function () {
  return gulp.src([
    '.tmp/{app,components}/**/*.html',
    "client/{app,components}/**/*.html",
    "!{client,.tmp}/app/*.html"
  ]).pipe(angularTemplate({module: 'venvyApp'}))
    .pipe(gulp.dest('client/app'));
});
gulp.task('uglify', function () {
  var jsFilter = filter('**/*.js');
  var cssFilter = filter('**/*.css');
  var revAll = new rev({

    //不重命名文件
    dontRenameFile: ['.html'],

    //无需关联处理文件
    dontGlobal: [/^\/favicon.ico$/, '.bat', '.txt', '.xml'],

    //该项配置只影响绝对路径的资源
    prefix: ''
  });
  var assets = useref.assets();
  return gulp.src('client/main.html')
    //合并html里面的js/css
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(useref())

    //压缩css
    .pipe(cssFilter)
    .pipe(csso())
    .pipe(cssFilter.restore())

    //压缩js
    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(jsFilter.restore())


    //加MD5后缀
    .pipe(revAll.revision())
    //输出
    .pipe(gulp.dest('dist'))
    //生成映射json文件
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest('dist'));
});
gulp.task('develop', function () {
  run(
    'clean','jade',
    ['less',
    'ngtemplates'],
    'inject_js',
    'copyDist',
    'uglify'
  );
});
gulp.task('default', function () {
  console.log('start default task');
  run(
    'clean',
    'inject_js',

    'ngtemplates',
    ['less', 'jade'],
    'watch',
    'nodemon'
  );
});
gulp.task('build', function () {
  console.log('start build task');
  return run(
    'clean',
    'jade',
    ['inject_js','less'],
    ['copyDist']
  );
});
gulp.task('nodemon', function() {
  nodemon({
    script: './server/app.js',
    ext: 'js',
    watch: 'server',
    delay: 1.5
  }).on('restart', function() {
    console.log('server restarted!');
  });
});
