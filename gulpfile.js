const gulp = require('gulp');
const webp = require('gulp-webp');

// 任务：将 source/images 及其所有子目录下的图片转换为 webp
gulp.task('webp', () => 
    gulp.src('./images/**/*.{jpg,png,jpeg}') // ** 代表递归匹配所有子目录
        .pipe(webp({
            quality: 85,    // 压缩质量
            preset: 'photo', // 预设模式
            method: 6        // 压缩方法（0-6，6为最慢但压缩比最高）
        }))
        .pipe(gulp.dest('./images')) // 输出回原目录，Gulp会自动保持子目录结构
);

// 默认任务
gulp.task('default', gulp.series('webp'));