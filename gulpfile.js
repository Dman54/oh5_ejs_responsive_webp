// VARIABLES & PATHS

let preprocessor = "scss", // Preprocessor (sass, scss)
  fileswatch = "html,htm,txt,json,md,woff2",
  imageswatch = "jpg,jpeg,png,webp,svg",
  baseDir = "app",
  online = true, // If «false» - Browsersync will work offline without internet connection
  outputStyle = "expanded"; // expanded compressed
let useSCSS = true;
let useJS = true;
let imgSizes = [0, 1200, 992, 768, 576, 414]; // 0 - for default image sizes

let paths = {
  ejs: {
    main: baseDir + "/*.ejs",
    includes: baseDir + "/includes/*.ejs",
  },

  json: {
    main: baseDir + "/json/",
    includes: baseDir + "/json/**/*.json",
  },

  scripts: {
    src: [
      // 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
      baseDir + "/js/app.js", // app.js. Always at the end
    ],
    dest: baseDir + "/js",
  },

  styles: {
    src: baseDir + "/" + preprocessor + "/main.*",
    dest: baseDir + "/css",
  },

  images: {
    src: baseDir + "/images/src/**/*",
    dest: baseDir + "/images/dest",
  },

  deploy: {
    hostname: "username@yousite.com",
    destination: "yousite/public_html/",
    include: [
      /* '*.htaccess' */
    ], // Included files to deploy
    exclude: ["**/Thumbs.db", "**/*.DS_Store", ".git", "**/*.ejs", "**/*.json"], // Excluded files from deploy
  },

  cssOutputName: "app.min.css",
  jsOutputName: "app.min.js",
  dist: "dist",
};

// LOGIC

const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass");
const scss = require("gulp-sass");
const cleancss = require("gulp-clean-css");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const imageResize = require("gulp-image-resize");
// const webpcss = require("gulp-webpcss");
// const webpHTML = require("gulp-webp-html");
const newer = require("gulp-newer");
const rsync = require("gulp-rsync");
const del = require("del");
const rename = require("gulp-rename");

const ejs = require("gulp-ejs");
const fs = require("fs");
const path = require("path");
const flatmap = require("gulp-flatmap");
// const log = require('fancy-log');

// https://semaphoreci.com/community/tutorials/getting-started-with-gulp-js

function browsersync() {
  browserSync.init({
    server: { baseDir: baseDir + "/" },
    notify: false,
    online: online,
  });
}

function ejsToHTML(cb) {
  return src(paths.ejs.main).pipe(
    flatmap(function (stream, file) {
      // let data2 = {};
      let fileJSON =
        paths.json.main + path.basename(file.path).replace(".ejs", ".json");
      if (fs.existsSync(fileJSON)) {
        data2 = JSON.parse(fs.readFileSync(fileJSON));
        return (
          src(file.path)
            .pipe(ejs(data2)) // data:data
            .pipe(rename({ extname: ".html" }))
            // .pipe(webpHTML())
            // .pipe(dest(paths.dist + "/"))
            .pipe(dest(baseDir + "/"))
            .pipe(browserSync.stream())
        );
      } else {
        // let err = `ОШИБКА!!! Создайте файл ${fileJSON}`;
        console.log(`ОШИБКА!!! Создайте файл ${fileJSON}`);
        // log(err);
        // process.exit(0);
        return src(file.path);
        //   .pipe(exit())
      }
    })
  );
  // cb();
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(concat(paths.jsOutputName))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function styles() {
  return (
    src(paths.styles.src)
      .pipe(
        eval(preprocessor)({ outputStyle: outputStyle }).on(
          "error",
          eval(preprocessor).logError
        )
      )
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 9999 versions"],
          grid: false,
        })
      )
      .pipe(concat(paths.cssOutputName.replace(".min", "")))
      // .pipe(webpcss({}))
      .pipe(dest(paths.styles.dest))
      .pipe(
        cleancss({
          level: { 1: { specialComments: 0 } } /* format: 'beautify' */,
        })
      )
      .pipe(rename({ suffix: ".min" }))
      .pipe(dest(paths.styles.dest))
      .pipe(browserSync.stream())
  );
}

function images(cb) {
  imgSizes.forEach(function (size) {
    // let stream = gulp.src('src/images/**/*.{jpg,jpeg,png}') SVG - ?
    if (size == 0) {
      src(paths.images.src)
        .pipe(newer(paths.images.dest))
        .pipe(
          imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
              plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
            }),
          ])
        )
        .pipe(dest(paths.images.dest))
        .pipe(webp({ quality: 25, method: 6 }))
        .pipe(dest(paths.images.dest));
    } else {
      src(paths.images.src)
        .pipe(newer(paths.images.dest))
        .pipe(
          imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
              plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
            }),
          ])
        )
        .pipe(
          imageResize({
            imageMagick: true,
            width: size,
            // crop: true,
          })
        )
        .pipe(
          rename(function (path) {
            path.basename = path.basename + "-" + size + "px";
          })
        )
        .pipe(dest(paths.images.dest))
        // .pipe(webp({ resize: { width: 1200, height: 0 } }))
        .pipe(webp({ quality: 25, method: 6 }))
        .pipe(dest(paths.images.dest));
    }
  });
  cb();
}
// filter: 100, sharpness: 7, lossless: true
// crop: {x:10,y:10,width:10,height:10}

function cleanimg() {
  return del("" + paths.images.dest + "/**/*", { force: true });
}

function cleandist() {
  return del(paths.dist);
}

function buildAssets() {
  return src(
    [
      // paths.styles.dest + "/" + paths.cssOutputName,
      paths.styles.dest + "/**",
      "app/fonts/**/*",
      // paths.scripts.dest + "/" + paths.jsOutputName,
      paths.scripts.dest + "/**",
      paths.images.dest + "/**/*",
      "app/*.html",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

function deploy() {
  return src(paths.dist).pipe(
    rsync({
      root: paths.dist,
      hostname: paths.deploy.hostname,
      destination: paths.deploy.destination,
      include: paths.deploy.include,
      exclude: paths.deploy.exclude,
      recursive: true,
      archive: true,
      silent: false,
      compress: true,
    })
  );
}

function startwatch() {
  watch([paths.ejs.main, paths.ejs.includes, paths.json.includes], ejsToHTML);
  watch(baseDir + "/" + preprocessor + "/**/*", { usePolling: true }, styles);
  watch(
    baseDir + "/images/src/**/*.{" + imageswatch + "}",
    { usePolling: true },
    images
  );
  watch(baseDir + "/**/*.{" + fileswatch + "}", { usePolling: true }).on(
    "change",
    browserSync.reload
  );
  watch(
    [baseDir + "/js/**/*.js", "!" + paths.scripts.dest + "/*.min.js"],
    { usePolling: true },
    scripts
  );
}

exports.browsersync = browsersync;
exports.html = ejsToHTML;
exports.assets = series(cleanimg, styles, scripts, images);
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.cleanimg = cleanimg;
exports.cleandist = cleandist;
exports.deploy = deploy;
exports.default = parallel(
  ejsToHTML,
  images,
  styles,
  scripts,
  browsersync,
  startwatch
);

exports.build = series(
  cleandist,
  ejsToHTML,
  images,
  styles,
  scripts,
  buildAssets
);
