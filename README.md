# Browser test for support of Atomics

Simple set of tests to check support for [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) in the latest version of Safari.

Test is live on this site: https://atomics-browser-test.web.app/

The site has been set up with the following headers:

```
Cross-Origin-Opener-Policy: "same-origin"
Cross-Origin-Embedder-Policy: "require-corp"
Cross-Origin-Resource-Policy: "same-origin"
```

To ensure it's a cross-origin-isolated context for the tests.