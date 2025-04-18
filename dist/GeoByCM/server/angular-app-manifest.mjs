
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23715, hash: '4e66ddef0caf6eea3703478e4bfff83a2bc036ec8db7ece2dba23efaa71bd3c4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17289, hash: '4157bb4fa56181c508ae4ab65a56dee8b049eaf3902b2c26c0c9fff8b75f2ad0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 50484, hash: 'c50ba82c900a547d63ecea4c24a9d4abd8936ca4e3d048fa14ba8afca9ea9cef', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
