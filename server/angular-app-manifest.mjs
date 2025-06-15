
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
    'index.csr.html': {size: 23987, hash: 'b94846781fdb58b81d98aa45d10c3d8c177cb8c26b7c9627c2440deec9f8337d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17289, hash: '9f975d6acda12e58e39d47bb4ca3798eb3193d4074bb1db2fb9c98de21dd3326', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 52961, hash: '56c4fb2d5ce3556a5c91838a7c1a106ad8309616f48219c26dc10a369b891e29', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-6CG6JCVJ.css': {size: 12327, hash: 'dVLrby5cGrE', text: () => import('./assets-chunks/styles-6CG6JCVJ_css.mjs').then(m => m.default)}
  },
};
