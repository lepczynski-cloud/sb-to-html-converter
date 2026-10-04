# Test matrix / Macierz testów

Run these checks before every tagged release and after changing the pinned
TurboWarp version.

| Case | Expected result |
|---|---|
| Small Scratch 3 `.sb3` project | Converts and opens from `file://` |
| Scratch 2 `.sb2` project | Converts without a loader error |
| Project with sound | Sound works after the browser's user interaction |
| Project with cloud variables, local mode | Values remain local to the browser |
| Project with cloud variables, TurboWarp server mode | Network mode works when online |
| Project with a custom extension | Trust warning appears before the extension is fetched; accepting bundles it or shows a clear error |
| Turbo mode disabled | Timing-sensitive project behaves like the selected setting |
| Hosted converter | Conversion and offline-converter download both work |
| Offline converter opened from disk | Standard project converts without a web server |
| Polish and English modes | All primary actions, warnings, and status messages switch language |
| Cancel during loading or packaging | Conversion stops and the interface becomes usable again |
| Large project | Warning appears; failure, if any, is presented without crashing the page |

Do not use a private or copyrighted project as a public test fixture. Prefer
small projects created specifically for testing.
