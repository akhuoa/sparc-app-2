// The maps viewer (SimulationVuer / libOpenCOR wasm) needs SharedArrayBuffer,
// which requires a cross-origin isolated page (COOP + COEP).
// Safari/WebKit does not support COEP `credentialless`, so it gets `require-corp`;
// other browsers keep `credentialless`, which is less strict on cross-origin resources.
const isIsolatedRoute = (path) =>
  path === '/apps/maps' || path === '/apps/maps/' || path.startsWith('/datasets/file/')

const isWebKitOnly = (userAgent = '') =>
  userAgent.includes('AppleWebKit') && !/(Chrome|Chromium|Edg)\//.test(userAgent)

export default defineEventHandler((event) => {
  if (!isIsolatedRoute(getRequestURL(event).pathname)) {
    return
  }

  const userAgent = getRequestHeader(event, 'user-agent')
  setResponseHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin')
  setResponseHeader(
    event,
    'Cross-Origin-Embedder-Policy',
    isWebKitOnly(userAgent) ? 'require-corp' : 'credentialless'
  )
  setResponseHeader(event, 'Vary', 'User-Agent')
})
