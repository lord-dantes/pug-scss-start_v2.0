var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    browserSync     = require('browser-sync'),
    concat          = require('gulp-concat'),
    pug             = require('gulp-pug'),
    uglify          = require('gulp-uglify'),
    rename          = require('gulp-rename'),
    cssnano         = require('gulp-cssnano'),
    del             = require('del'),
    autoprefixer    = require('gulp-autoprefixer'),
    notify          = require('gulp-notify'),
    gcmq            = require('gulp-group-css-media-queries');
    sourcemaps      = require('gulp-sourcemaps');

gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
            .pipe(gcmq())
            .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: false }))
        .pipe(sourcemaps.write('../css', {addComment: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('pug', function() {
    return gulp.src('app/pug/pages/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .on('error', notify.onError(function (error) {
            return 'An error occurred while compiling jade.\nLook in the console for details.\n' + error;
        }))
        .pipe(gulp.dest('app/'))

        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('watch', ['pug' , 'browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('./app/pug/**/*.pug', ['pug']);
    gulp.watch('.app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('glyphicon-bootstrap', function() {
    return gulp.src('app/libs/bootstrap/dist/fonts/**/*')
        .pipe(gulp.dest('app/fonts'));
});