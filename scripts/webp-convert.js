const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ========== 自定义配置区（按需修改） ==========
const config = {
  quality: 85,                // WebP压缩质量，75-85兼顾画质和体积
  maxWidth: 1000,             // 图片最大宽度，超过自动等比压缩
  maxHeight: 1000,            // 图片最大高度
  excludeFormats: ['webp', 'gif', 'svg'], // 排除不需要转换的格式
  skipExisting: true          // 跳过已生成的WebP，提升构建速度
};
// =============================================

hexo.extend.filter.register('after_generate', async () => {
  const publicDir = hexo.public_dir;

  // 递归扫描所有HTML文件
  const scanHtml = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanHtml(fullPath, fileList);
      } else if (file.endsWith('.html')) {
        fileList.push(fullPath);
      }
    });
    return fileList;
  };
  const htmlFiles = scanHtml(publicDir);

  // 处理每个HTML中的图片
  for (const htmlPath of htmlFiles) {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    // 匹配所有jpg/jpeg/png图片引用
    const imgRegex = /src="([^"]+\.(jpg|jpeg|png))"/g;
    const matches = [...htmlContent.matchAll(imgRegex)];

    for (const match of matches) {
      const originalSrc = match[1]; // 原图片路径
      const imgExt = match[2];      // 原图片后缀
      // 生成同目录、同名的WebP路径（仅改后缀）
      const webpSrc = originalSrc.replace(`.${imgExt}`, '.webp');
      // 原图片的物理路径
      const originalImgPath = path.join(publicDir, originalSrc.replace(/^\//, ''));
      // WebP的物理路径（和原图同目录）
      const webpImgPath = path.join(publicDir, webpSrc.replace(/^\//, ''));

      // 跳过不存在的源文件、已生成的WebP
      if (!fs.existsSync(originalImgPath) || (config.skipExisting && fs.existsSync(webpImgPath))) {
        htmlContent = htmlContent.replace(match[0], `src="${webpSrc}"`);
        continue;
      }

      // 转换图片为WebP，同目录输出
      try {
        await sharp(originalImgPath)
          .resize(config.maxWidth, config.maxHeight, { 
            fit: 'inside', 
            withoutEnlargement: true // 小图不放大
          })
          .webp({ quality: config.quality })
          .toFile(webpImgPath);
        console.log(`✅ 转换成功: ${originalSrc} → ${webpSrc}`);
        // 替换HTML中的图片引用
        htmlContent = htmlContent.replace(match[0], `src="${webpSrc}"`);
      } catch (err) {
        console.warn(`⚠️ 跳过损坏图片: ${originalImgPath} | 原因: ${err.message}`);
      }
    }

    // 写回修改后的HTML
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  }

  console.log(`🎉 图片处理完成，所有WebP已输出到对应原图目录`);
});
