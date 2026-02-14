hexo.extend.tag.register('video', function (args) {
  const src = args[0]
  return `
<video src="${src}" preload="none" controls width="100%"></video>
`
})
