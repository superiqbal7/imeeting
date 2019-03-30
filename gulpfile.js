var html_files = [
        "404.html",
        "about.html",
        "contact.html",
        "index.html",
    ]

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    minify = require('gulp-minify'),
    injectPartials = require('gulp-inject-partials'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    wait = require('gulp-wait');

gulp.task('compile-sass', function(done1) {
    gulp.src('src/assets/sass/style-default.scss')
        .pipe(wait(500))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/assets/css/')).on('end', function(){
            gulp.src('src/assets/css/style-default.css')
            .pipe(minifyCss().on('error', function(err){
                console.log(err);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('src/assets/css/'))
            .pipe(browserSync.stream());
        });

    done1();
});

gulp.task('compress-js', function(done2) {
    gulp.src('src/assets/js/script.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('src/assets/js/'))
        .pipe(browserSync.stream());

    done2();
});

gulp.task('build-html', function(done3){
    let variation = html_files;

    variation.forEach(function(fileName){
        gulp.src('generator/' + fileName)
            .pipe(injectPartials({
                removeTags: true
            }))
            .pipe(gulp.dest('src/'))
            .pipe(browserSync.stream());
    });

    done3();
});

gulp.task('watch-change', gulp.series('compile-sass', 'compress-js', 'build-html', function(done4) {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });

    gulp.watch('src/assets/sass/*.scss', gulp.series('compile-sass')).on('change', reload);
    gulp.watch('src/assets/sass/**/*.scss', gulp.series('compile-sass')).on('change', reload);
    
    gulp.watch('src/assets/js/*.js', gulp.series('compress-js')).on('change', reload);
    
    gulp.watch('generator/*.html', gulp.series('build-html')).on('change', reload);
    gulp.watch('generator/partial/*.html', gulp.series('build-html')).on('change', reload);

    done4();
}));

gulp.task('default', gulp.series('watch-change'));