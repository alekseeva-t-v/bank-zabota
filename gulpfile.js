const gulp = require('gulp');

// Задачи
require('./gulp/dev.js');
require('./gulp/docs.js');

// Итоговая задача для запуска сборки для разработки
gulp.task(
  'default',
  gulp.series(
    'clean:dev',
    gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'fonts:dev', 'files:dev', 'js:dev'),
    gulp.parallel('server:dev', 'watch:dev')
  )
);

// Итоговая задача для запуска готовой сборки
gulp.task(
  'docs',
  gulp.series(
    'clean:docs',
    gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'fonts:docs', 'files:docs', 'js:docs'),
    gulp.parallel('server:docs')
  )
);