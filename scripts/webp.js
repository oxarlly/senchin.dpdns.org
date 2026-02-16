const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const color = require('colors');

// --- 配置项 ---
const QUALITY = 85; // 压缩质量
const EXTNAMES = ['.jpg', '.jpeg', '.png']; // 需要转换的格式

hexo.extend.filter.register('after_generate', async function() {
    const publicDir = hexo.public_dir;
    const images = [];

    // 1. 递归扫描 public 文件夹下所有图片
    function traverse(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                traverse(filePath);
            } else {
                if (EXTNAMES.includes(path.extname(filePath).toLowerCase())) {
                    images.push(filePath);
                }
            }
        });
    }

    traverse(publicDir);

    // 2. 执行并行转换
    await Promise.all(images.map(async imgPath => {
        const webpPath = imgPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        // 如果 webp 已存在则跳过（增量生成）
        if (fs.existsSync(webpPath)) return;

        try {
            await sharp(imgPath)
                .webp({ quality: QUALITY })
                .toFile(webpPath);
            console.log(color.green('[WebP Converter] ') + 'Done: ' + color.magenta(path.relative(publicDir, webpPath)));
        } catch (err) {
            console.error(color.red('[WebP Converter] Error: ') + imgPath, err);
        }
    }));
});