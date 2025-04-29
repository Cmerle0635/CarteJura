
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
    'index.csr.html': {size: 23987, hash: 'f0572043271197eaaa257a6898489a1695ded318486a8e2ee65c7d3442e90e34', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17289, hash: '09df621b3ddcfec2d82352839109115257221c268b8dca54397da926fd2d7522', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 51602, hash: 'f7d02ae6c3202e83d7020d99a16b3297c9a2c88cf11577ebc52aa656fc63ac6a', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-6CG6JCVJ.css': {size: 12327, hash: 'dVLrby5cGrE', text: () => import('./assets-chunks/styles-6CG6JCVJ_css.mjs').then(m => m.default)}
  },
};
