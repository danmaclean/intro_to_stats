# webR verification

A headless smoke test for the **Phase 2 (webR delivery)** pipeline. It proves the
real in-browser delivery path that [`quarto-live`](https://r-wasm.github.io/quarto-live/)
uses: under webR, install **`itssl`** from the course r-universe
(`https://danmaclean.r-universe.dev`, with dependencies from `repo.r-wasm.org`),
then load the bundled potato datasets and run the worked models.

## Run

```sh
cd tools/webr-verify
npm install
node verify-itssl-webr.mjs
```

- If the r-universe WASM binary for the current webR R version isn't published
  yet, it prints **PENDING** and exits 0 — safe to re-run later.
- On success it prints `✅ END-TO-END …` and the per-check results.

## When to run

After every `itssl` release (r-universe rebuilds the WASM binary automatically),
to confirm the browser delivery path still works before relying on it in the book.

> Requires Node and network access (downloads the webR WASM runtime and the
> packages). Not part of the book's render/CI gate.
