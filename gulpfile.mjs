import { task, watch, src, dest, parallel } from "gulp";
import browserSync from "browser-sync";
import rename from "gulp-rename";
import cleanCss from "gulp-clean-css";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";

const browserSyncInstance = browserSync.create();
const gulpSassCompiler = gulpSass(sass);

task('server', function() {
	browserSyncInstance.init({
		server: {
			baseDir: "src"
		}
	});

	watch("src/*.html").on('change', browserSyncInstance.reload);
});

task('styles', function() {
	return src("src/sass/**/*.+(scss|sass)")
		.pipe(gulpSassCompiler({ outputStyle: 'compressed' }).on('error', gulpSassCompiler.logError))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'], cascade: false }))
		.pipe(cleanCss({ compatibility: 'ie8' }))
		.pipe(dest("src/css"))
		.pipe(browserSyncInstance.stream());
});

task('watch', function() {
	watch("src/sass/**/*.+(scss|sass)", parallel('styles'));
});

task('default', parallel('watch', 'server', 'styles'));
