const gulp = require('gulp');
const webp = require('gulp-webp');

// 修正路径：Hexo 标准路径通常是 './source/images'
// 如果你的图片确实在根目录的 images 文件夹，请改回 './images'
const IMG_PATH = './source/images'; 

gulp.task('webp', () => 
    gulp.src(`${IMG_PATH}/**/*.{jpg,png,jpeg}`) 
        .pipe((webp.default ? webp.default : webp)({ 
            quality: 85,
            preset: 'photo',
            method: 6
        }))
        .pipe(gulp.dest(IMG_PATH)) 
);

gulp.task('default', gulp.series('webp'));