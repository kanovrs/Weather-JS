const gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass')(require('sass')),
    sourcemap = require("gulp-sourcemaps"),
    cleanCSS = require('gulp-clean-css'),
    mediaQueries = require('gulp-group-css-media-queries'),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    htmlMin = require('gulp-htmlmin'),
    imagemin = require("gulp-imagemin"),
    svgstore = require("gulp-svgstore"),
    del = require('del'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify');
    replace = require('gulp-replace');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('scripts', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'));
});



gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', function () {
    return gulp.src('app/styles/**/*.+(scss|sass)')
        .pipe(sourcemap.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('svg-sprite', function () {
    return gulp.src("app/images/*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("app/images"));
});

gulp.task('clean', function (done) {
    del.sync('dist');
    done();
});

gulp.task('css', function () {
    return gulp.src('app/styles/**/*.+(scss|sass)')
        .pipe(sass())
        .pipe(mediaQueries())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(replace('style.css', 'style.min.css'))
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('optimize-images', function () {
    return gulp.src(["app/images/**/*.{png,jpg,svg}", "!app/img/sprite.svg", "!app/img/icons/*.svg"])
        .pipe(imagemin([
            imagemin.mozjpeg({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('svg-sprite-prod', function () {
    return gulp.src("app/images/*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("dist/images"));
});

gulp.task('copy-dist', function (done) {
    gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
    done();
});

gulp.task('watch', function () {
    gulp.watch('app/styles/**/*.+(scss|sass)', gulp.parallel('sass'));
    gulp.watch('app/images/*.svg', gulp.parallel('svg-sprite'));
    gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('sass', 'svg-sprite', 'browser-sync', 'watch'));  //  Запускаем задачи в режиме разработки командой gulp
gulp.task('build', gulp.series('clean', 'css', 'scripts', 'html', 'optimize-images', 'svg-sprite-prod', 'copy-dist')); //  Собираем проект для продакшена командой gulp build
