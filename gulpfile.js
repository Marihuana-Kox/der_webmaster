let preprocessor = 'sass' // Можно быстро изменить библиотеку sass на less

const { src, dest, parallel, series, watch } = require('gulp'); // Константы Gulp
const browserSync = require('browser-sync').create(); // Сервер
const concat      = require('gulp-concat'); // Модуль для обеденения в один файл
const uglify      = require('gulp-uglify-es').default; // Модуль для обеденения в один файл
const sass        = require('gulp-sass')(require('sass')); // Модуль SASS
const autoprefix  = require('gulp-autoprefixer'); // Модуль создпющий автоматически префиксы для разных браузеров
const cleanCss    = require('gulp-clean-css');
const imagemin    = require('gulp-imagemin'); // Модуль для сжатие изображений
const newer       = require('gulp-newer'); // Модуль отбора новых файлов
const del         = require('del'); // Модуль для удаления

function browsersync() {// Сервер
    browserSync.init({
        server: { baseDir: 'app/' }, // Директория окуда сервер берет файлы
        notify: false, // Убрать всплывающее уведомление в браузере
        online: true // Если нет интернета - выключить: false 
    })
}

function scripts() { // Сбор скриптов
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'app/js/app.js',
    ])
        .pipe(concat('app.min.js'))// Конкатенация кода из src в одну строку
        .pipe(uglify()) // Сжимает код перед записью в файл
        .pipe(dest('app/js/')) // Путь сохранения конкатенированных файлов
        .pipe(browserSync.stream()) // перезагрузка страницы после изменения файлов
}

function styles() { // Сбор стилей
    return src(`app/${preprocessor}/main.${preprocessor}`)
        .pipe(eval(preprocessor)())
        .pipe(sass())
        .pipe(concat('app.min.css')) // Конкатенация кода из src в одну строку
        .pipe(autoprefix({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Атопрефиксы для разных бразеров
        .pipe(cleanCss(({ level: { 1: { specialComments: 0 } }/*, format: 'beautify'*/ }))) // Очищение кода от пробелов и комментариев
        .pipe(dest('app/css/')) // Путь сохранения файлов
        .pipe(browserSync.stream()) // перезагрузка страницы после изменения файлов
}

function images() { // Сжать изображения
    return src('app/images/src/**/*')
        .pipe(newer('app/images/dest/'))
        .pipe(imagemin())
        .pipe(dest('app/images/dest/'))
}

function cleanimg() { // Очистить папку со сжатыми картинками
    return del('app/images/dest/**/*', { force: true})
}

function cleandist() { // Очистить папку dist
    return del('dist/**/*', { force: true})
}

function buildcopy(){ // Копирование файлов в конечную папку
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*min.js',
        'app/images/dest/**/*',
        'app/**/*.html',
    ], { base: 'app' })
    .pipe(dest('dist'))
}

function startwatch() { // Функция слежения за изменениями в файлах
    watch(`app/**/${preprocessor}/**/*`, styles) 
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts) // Слежение за изменениями в файлах "!" перед файлм исключает его из наблюдения 
    watch('app/**/*.html').on('change', browserSync.reload) 
    watch('app/images/src/**/*', images) 
}

exports.browsersync = browsersync;
exports.scripts     = scripts; // Экспорт функции
exports.styles      = styles; // Экспорт функции
exports.images      = images; // Экспорт функции
exports.cleanimg    = cleanimg; // Экспорт функции
exports.build       = series(cleandist, styles, scripts, images, buildcopy) // Экспорт функции

exports.default = parallel(scripts, styles, images, browsersync, startwatch)