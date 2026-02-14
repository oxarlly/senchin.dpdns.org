hexo.extend.tag.register('video', function (args) {
  const src = args[0]
  return `
<video class="videoElement" src="${src}" controls preload="auto" width="100%" height="100%"></video>
</div>
`
})
