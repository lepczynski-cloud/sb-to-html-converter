# Decyzje techniczne / Technical decisions

## Polski

### Najsłabszy punkt pomysłu

Najsłabszym punktem nie jest interfejs, tylko zależność od dużego i zmiennego
projektu upstream. Przeglądarkowy TurboWarp Packager nie jest stabilnym API
bibliotecznym. Aktualizacja upstream może zmienić strukturę plików, opcje albo
proces budowania i wtedy prosta nakładka przestanie się kompilować.

Dlatego repozytorium przypina jednocześnie numer wydania, tag i pełny SHA commita.
Każda aktualizacja TurboWarp musi być osobnym, świadomym zadaniem zakończonym
testami kilku typów projektów. Automatyczne śledzenie `latest` byłoby wygodniejsze,
ale zbyt ryzykowne dla narzędzia, które ma generować pliki do publikacji.

### Dlaczego nie przeniesiono obecnego skryptu Node.js bezpośrednio do przeglądarki

Obecny skrypt używa `fs` oraz Node API pakietu `@turbowarp/packager`. Opublikowany
pakiet npm nie jest przeznaczony do przeglądarki. Próba ukrycia tego za bundlerem
stworzyłaby kruche rozwiązanie zależne od nieobsługiwanej ścieżki.

Ten projekt używa oficjalnego wejścia przeglądarkowego i adaptera webowego ze
źródeł TurboWarp, a własny interfejs nakłada dopiero podczas buildu.

### Dlaczego nie ma backendu

Konwersja bez backendu daje trzy realne korzyści: projekt nie jest wysyłany do
serwera aplikacji, nie ma kosztu przetwarzania i nie trzeba zabezpieczać usługi
przed nadużyciami. Cena jest konkretna: pamięć urządzenia użytkownika staje się
limitem. Duże projekty mogą nie przekonwertować się na telefonie, a czasem także
w przeglądarce desktopowej. Niestandardowe rozszerzenia są dodatkową granicą
zaufania: wygenerowana gra uruchamia ich kod bez sandboxa, dlatego interfejs
wymaga potwierdzenia przed ich dołączeniem.

Backend byłby właściwym wyborem dopiero wtedy, gdy obsługa bardzo dużych plików
jest ważniejsza niż prywatność, brak konta i prostota utrzymania.

### Dlaczego GitHub Release nie powstaje po każdym commicie

Każdy push do `main` tworzy nową wersję wdrożenia Cloudflare. To wystarcza do
ciągłego dostarczania zmian. GitHub Release jest trwałym publicznym wydaniem i
powinien oznaczać wersję, do której można wrócić, pobrać ją i opisać w changelogu.
Tworzenie Release dla każdego commita szybko zasłoniłoby istotne wersje setkami
technicznych wydań.

Dlatego commit oznacza deployment, a tag SemVer oznacza Release.

### Dlaczego MPL-2.0 zamiast MIT

Interfejs i branding są nakładane na źródła TurboWarp Packager, który używa
MPL-2.0. Oznaczenie całego rezultatu wyłącznie licencją MIT sugerowałoby szersze
prawa, niż faktycznie wynikają z zależności i zmodyfikowanych plików. Jedna
licencja MPL-2.0 dla tego repozytorium jest prostsza i uczciwsza niż mieszanie
kilku licencji bez wyraźnej potrzeby.

### Rozważone alternatywy

1. **Osadzenie oryginalnego TurboWarp Packager bez zmian.** Najmniej kodu, ale
   interfejs byłby znacznie bardziej złożony niż potrzeba i nie realizowałby
   prostego, dwujęzycznego przepływu.
2. **Konwersja po stronie serwera.** Lepsza kontrola pamięci, lecz koszt, upload
   prywatnych projektów, kolejki, limity i większa powierzchnia ataku.
3. **Commitowanie `dist/`.** Szybkie wdrożenie, lecz duże binarne różnice,
   ryzyko niezgodności źródła z artefaktem i trudniejszy przegląd zmian.
4. **Automatyczne aktualizowanie TurboWarp do `latest`.** Mniej pracy ręcznej,
   ale brak powtarzalności i możliwość nagłego uszkodzenia produkcji.

## English

### The weakest point

The main risk is not the interface. It is the dependency on a large and evolving
upstream project. The browser build of TurboWarp Packager is not a stable library
API. An upstream update can change file layout, options, or build behavior and
break this overlay.

The repository therefore pins the release number, tag, and full commit SHA.
Upgrading TurboWarp is an explicit change that requires representative project
tests. Tracking `latest` would be easier but is not reliable enough for a tool
that generates publishable files.

### Browser source instead of the Node package

The original script uses `fs` and the Node API of `@turbowarp/packager`. The npm
package is not intended for browser use. This repository builds the official
browser entry point and web adapter from source, then applies the custom UI as an
overlay.

### No backend

Client-side conversion keeps projects off the application's server, avoids
compute cost, and removes an abuse-prone upload service. The trade-off is device
memory: large projects can fail on phones or even desktop browsers. Custom
extensions are another trust boundary: the generated game runs their code without
a sandbox, so the UI requires confirmation before including them. A backend
would only be preferable when very large project support outweighs privacy and
operational simplicity.

### Deployment versus release

Every push to `main` is a Cloudflare deployment. A semantic version tag is a
permanent GitHub Release. Creating a public Release for every commit would make
the release history noisy and less useful.

### License

TurboWarp Packager uses MPL-2.0 and this project replaces files in that source
tree. Licensing the repository under MPL-2.0 keeps the obligations and user
expectations clear. It is intentionally not presented as an MIT-only derivative.
