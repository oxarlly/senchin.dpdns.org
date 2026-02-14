hexo.extend.filter.register('after_generate', function () {
  const fs = require('fs')
  const path = require('path')
  const cnamePath = path.join(hexo.public_dir, 'CNAME')
  const domain = 'senchin.dpdns.org'

  fs.writeFileSync(cnamePath, domain, 'utf8')
  console.log('✅ CNAME 已自动生成：' + domain)
})
