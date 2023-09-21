const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob')
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const changed = require('gulp-changed');

/**
 * Функция формирует объект параметров необходимый для вызова plumber.
 *
 * @param {string} title Заголовок ошибки.
 * @return {object} объект параметров необходимый для вызова plumber.
 */
const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
  };
};

// Задача для удаления папки dist
gulp.task('clean:dev', function (done) {
  if (fs.existsSync('./build/')) {
    return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
  }
  done();
});

// Задача для объединения html файлов в один файл, а также отлова и вывода ошибок
const fileIncludeSetting = { prefix: '@@', basepath: '@file' };

gulp.task('html:dev', function () {
  return gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(changed('./build/', { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(gulp.dest('./build/'));
});

// Задача для преобразования scss в сss, создания карты css (в диспетчере будем видеть верное расположение файлов), ** группировки медиа запросов ** (при работе метода некорректно работают карты css), отлов и вывод ошибок и объединения всех css файлов в один
gulp.task('sass:dev', function () {
  return (
    gulp
      .src('./src/scss/*.scss')
      .pipe(changed('./build/css/'))
      .pipe(plumber(plumberNotify('Styles')))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest('./build/css/'))
  );
});

// Задача для минимизации изображений и копирования изображений в конечную папку
gulp.task('images:dev', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./build/img/'))
    .pipe(gulp.dest('./build/img/'));
});

// Задача для копирования шрифтов в конечную папку
gulp.task('fonts:dev', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'));
});

// Задача для копирования прочих файлов в конечную папку
gulp.task('files:dev', function () {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./build/files/'))
    .pipe(gulp.dest('./build/files/'));
});

// Задача для обработки js файлов
gulp.task('js:dev', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./build/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./build/js'));
});

// Задача для старта сервера с автообновлением страницы
const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task('server:dev', function () {
  return gulp.src('./build/').pipe(server(serverOptions));
});

// Задача для отслеживания изменений в файлах
gulp.task('watch:dev', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
  gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
  gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
  gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});


