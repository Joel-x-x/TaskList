

const { src, dest, watch , parallel} = require('gulp'),
        concat              = require('gulp-concat'),
        uglify              = require('gulp-uglify'),
        sass                = require('gulp-sass')(require('sass')),
        sourcemaps          = require('gulp-sourcemaps'),
        postcss             = require('gulp-postcss'),
        autoprefixer        = require('autoprefixer'),
        cssnano             = require('cssnano')


const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/*.js'
}
function js() {
    return src(paths.js)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(dest('build/js/'))
}

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(),cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css/'))
    }

function watchArchivos() {
    watch(paths.scss, css);
    watch(paths.js, js);
}

exports.default = parallel(css,js, watchArchivos);