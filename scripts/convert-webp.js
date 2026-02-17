const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

hexo.extend.generator.register('convert-webp', function() {
  const imgDir = path.join(hexo.source_dir, 'images'); // 图片文件夹路径
  const outputDir = path.join(hexo.public_dir, 'images'); // 输出的文件夹

  // 递归遍历图片文件夹
  function convertImages(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        convertImages(filePath); // 递归处理子文件夹
      } else {
        const extname = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(extname)) {
          const destPath = path.join(outputDir, file.replace(extname, '.webp'));
          imagemin([filePath], {
            destination: outputDir,
            plugins: [
              imageminWebp({ quality: 75 }) // 转换为 WebP 格式，质量可根据需要调整
            ]
          }).then(() => {
            console.log(`Converted: ${filePath} -> ${destPath}`);
          }).catch(err => {
            console.error('Error converting image:', err);
          });
        }
      }
    });
  }

  convertImages(imgDir);
});
