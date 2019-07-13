//Importing dependencies
const gulp = require("gulp"),
      autoprefixer = require("gulp-autoprefixer"),
      browserSync = require("browser-sync").create(),
      sass = require("gulp-sass"),
      cleanCSS = require("gulp-clean-css"),
      del = require("del"),
      htmlmin = require("gulp-htmlmin");     
      

//Declaring Paths
const paths = {
  css: {
    src: "./src/scss/*.scss",
    dest: "./dist/css"
  },
  html: {
    src: "./src/*.html",
    dest: "./dist/"
  }
  
};


// BrowserSync init
function serve(done) {
    browserSync.init({
      server: {
        baseDir: "./dist/"
      },
      port: 8080
    });
    done();
}

// BrowserSync Reload
function reload(done) {
    browserSync.reload();
    done();
}


// Moving and compiling sass files 
function custom_sass() {
  return (
    gulp
      .src(paths.css.src)
      .pipe(sass({ outputStyle: "expanded" }))
      .on("error", sass.logError)
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
           flexbox: `no-2009` ,
           cascade: false
      })
      )
      .pipe(cleanCSS())
      .pipe(gulp.dest(paths.css.dest))
  );
}

//custom html pages
function custom_html() {
  return gulp
    .src(paths.html.src)
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest(paths.html.dest));
}

// clean ./dist folder 
function clean() {
  return del(["dist"]);

}

//Watching File
function watch() {
  gulp.watch(paths.css.src, gulp.series(custom_sass, reload));
  gulp.watch(paths.html.src, gulp.series(custom_html, reload));
}

// building files 
const build = gulp.series(
    clean,
    custom_html,
    custom_sass,
    gulp.parallel(serve, watch)
);
gulp.task(build);
gulp.task("default", build);


 