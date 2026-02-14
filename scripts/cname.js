hexo.extend.filter.register('after_generate', function () {
  const fs = require('fs')
  const path = require('path')
  const publicDir = hexo.public_dir
  const cnamePath = path.join(publicDir, 'CNAME')
  const domain = 'senchin.dpdns.org'

  // 确保 public 目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // 写入 CNAME 文件
  fs.writeFileSync(cnamePath, domain, 'utf8')
  console.log('✅ CNAME 已自动生成：' + domain)
})
