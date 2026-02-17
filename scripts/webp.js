const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

//
// 1️⃣ 生成 webp 文件
//
hexo.extend.filter.register("after_generate", async function () {
  const publicDir = hexo.public_dir;

  async function convert(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await convert(fullPath);
      } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
        const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");

        if (!fs.existsSync(webpPath)) {
          await sharp(fullPath)
            .webp({ quality: 85 })
            .toFile(webpPath);

          console.log("✔ WebP:", webpPath);
        }
      }
    }
  }

  await convert(publicDir);
});

//
// 2️⃣ 替换 HTML 中的引用
//
hexo.extend.filter.register("after_render:html", function (html) {
  return html.replace(
    /(<img[^>]+src=")([^"]+?)\.(jpg|jpeg|png)"/gi,
    "$1$2.webp\""
  );
});
