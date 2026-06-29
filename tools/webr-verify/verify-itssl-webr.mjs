// Headless webR smoke test for the Phase 2 (webR delivery) pipeline.
//
// Proves the *real* in-browser delivery path that quarto-live uses: install
// `itssl` from the project's r-universe (deps from repo.r-wasm.org) under webR,
// then load the bundled potato datasets and run the worked models. Re-run this
// after every itssl release to confirm the WASM binary is published and works.
//
//   cd tools/webr-verify && npm install && node verify-itssl-webr.mjs
//
// Doubles as a readiness probe: if the r-universe WASM binary isn't published
// yet it reports PENDING and exits 0 (no crash), so it's safe to re-run.
import { WebR } from 'webr';

const log = (...a) => console.log(...a);
const UNIVERSE = 'https://danmaclean.r-universe.dev';
const REPOS = [UNIVERSE, 'https://repo.r-wasm.org'];

process.on('unhandledRejection', (e) => {
  log('\n⚠️  unhandled rejection:', String(e).split('\n')[0]);
  process.exit(3);
});

const webR = new WebR();
log('init webR (downloading WASM R runtime)...');
await webR.init();
const rver = (await webR.evalRString(
  'paste0(R.version$major, ".", sub("[.].*", "", R.version$minor))'
)).trim();
log(`webR ready (R ${rver}).`);

// readiness probe: is the itssl WASM binary actually published for this R version?
const idx = `${UNIVERSE}/bin/emscripten/contrib/${rver}/PACKAGES`;
log(`probing ${idx}`);
let ready = false;
try {
  const res = await fetch(idx);
  const body = res.ok ? await res.text() : '';
  ready = res.ok && /^Package:\s*itssl\s*$/m.test(body);
  if (!ready) log(`   not ready (HTTP ${res.status}; itssl in index: ${/itssl/.test(body)})`);
} catch (e) {
  log('   probe error:', String(e).split('\n')[0]);
}
if (!ready) {
  log('\n⏳ PENDING: the itssl WASM binary is not on the r-universe yet. Re-run later.');
  await webR.close();
  process.exit(0);
}

log(`installing itssl from:\n  ${REPOS.join('\n  ')}`);
const t0 = Date.now();
await webR.installPackages(['itssl'], { repos: REPOS, quiet: true });
log(`itssl installed in ${Math.round((Date.now() - t0) / 1000)}s`);

let failed = 0;
async function check(label, rexpr) {
  try {
    const v = await webR.evalRString(`as.character(${rexpr})`);
    log(`  PASS  ${label}: ${v}`);
  } catch (e) {
    failed++;
    log(`  FAIL  ${label}: ${String(e).split('\n')[0]}`);
  }
}

await webR.evalRVoid('suppressMessages(library(itssl))');
log('--- verifying itssl (from the universe) under webR ---');
await check('itssl version', 'packageVersion("itssl")');
await check('potato_scab loads (nrow)', '{data(potato_scab); nrow(potato_scab)}');
await check('lm(infection ~ sulfur) slope p', 'round(coef(summary(lm(infection ~ sulfur, potato_scab)))[2,4], 4)');
await check('potato_blight logistic rain p', '{data(potato_blight); round(coef(summary(glm(blight ~ rain_spring, potato_blight, family = binomial)))[2,4], 4)}');
await check('its_axplusb_time builds a ggplot', 'class(its_axplusb_time(a = 2, b = 1))[1]');
await webR.close();

if (failed) {
  log(`\n❌ ${failed} check(s) failed.`);
  process.exit(1);
}
log('\n✅ END-TO-END: itssl installs from the r-universe and runs under webR.');
