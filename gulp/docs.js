const gulp = require('gulp');

// HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const webpHTML = require('gulp-webp-html');

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css')

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');

// IMAGES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

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
gulp.task('clean:docs', function (done) {
  if (fs.existsSync('./docs/')) {
    return gulp.src('./docs/', { read: false }).pipe(clean({ force: true }));
  }
  done();
});

// Задача для объединения html файлов в один файл, а также отлова и вывода ошибок
const fileIncludeSetting = { prefix: '@@', basepath: '@file' };

gulp.task('html:docs', function () {
  return gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(changed('./docs/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest('./docs/'));
});

// Задача для преобразования scss в сss, создания карты css (в диспетчере будем видеть верное расположение файлов), группировки медиа запросов, отлов и вывод ошибок и объединения всех css файлов в один c их минимизацией
gulp.task('sass:docs', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(plumberNotify('Styles')))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./docs/css/'));
});

// Задача для минимизации изображений и копирования изображений в конечную папку
gulp.task('images:docs', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./docs/img/'))
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(changed('./docs/img/'))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./docs/img/'));
});

// Задача для копирования шрифтов в конечную папку
gulp.task('fonts:docs', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./docs/fonts/'))
    .pipe(gulp.dest('./docs/fonts/'));
});

// Задача для копирования прочих файлов в конечную папку
gulp.task('files:docs', function () {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./docs/files/'))
    .pipe(gulp.dest('./docs/files/'));
});

// Задача для обработки js файлов
gulp.task('js:docs', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(require('../webpack.config.js')))
    .pipe(gulp.dest('./docs/js'));
});

// Задача для старта сервера с автообновлением страницы
const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task('server:docs', function () {
  return gulp.src('./docs/').pipe(server(serverOptions));
});
