# Braviestale — demo pública / public demo v0.1.8

> RPG narrativo gratuito para Windows, Linux, Android y navegador. La partida empieza en Aldenbrock, llega al combate con Destigio en Ciudadela y termina cuando el protagonista despierta en el refugio y se entera de la desaparición de Ysolda. En ese punto se guarda el progreso, pero la demo no continúa la campaña. El juego está en español.
>
> A free story-driven RPG demo for Windows, Linux, Android and web. Begin in Aldenbrock, reach the battle with Destigio in the Citadel, and end when the protagonist wakes in the shelter and learns Ysolda has gone missing. The game saves at the ending; the demo does not continue the campaign. In-game language: Spanish.

**[Jugar en el navegador / Play in browser](https://zabat-code.github.io/Braviestale-demo/)** · **[Todos los archivos / All downloads](https://github.com/Zabat-code/Braviestale-demo/releases/tag/v0.1.8)** · **[SHA-256 checksums](https://github.com/Zabat-code/Braviestale-demo/releases/download/v0.1.8/SHA256SUMS.txt)**

## Downloads / Descargas

| Platform / Plataforma | Package / Archivo | Size / Tamaño | SHA-256 |
| --- | --- | ---: | --- |
| Windows | [ZIP](https://github.com/Zabat-code/Braviestale-demo/releases/download/v0.1.8/Braviestale-demo-20261017-v018-win.zip) | 437.8 MiB | `bcde638eaf76171e6a9d7694f87cb32934232a70ce81407a5af22426e3bb0bba` |
| Linux 64-bit | [TAR.BZ2](https://github.com/Zabat-code/Braviestale-demo/releases/download/v0.1.8/Braviestale-demo-20261017-v018-linux64.tar.bz2) | 431.1 MiB | `3939410a66e99d4b3393962cefee5beaf56bf9a27ee29bd3ed2e19b1278ea5f8` |
| Android | [APK](https://github.com/Zabat-code/Braviestale-demo/releases/download/v0.1.8/Braviestale-demo-20261017-v018-android.apk) | 461.7 MiB | `90d1586c048a31b3cb736f7dd04a3ae55af2595842096a8945b4d781c59f691f` |
| Web offline hosting | [ZIP](https://github.com/Zabat-code/Braviestale-demo/releases/download/v0.1.8/Braviestale-demo-20261017-v018-web.zip) | 454.4 MiB | `9e4390879aa23cf65f1f72caac6420f9c57419a75ae79d581691967905e4a476` |

**Español:** Extrae el ZIP en Windows y abre `Braviestale.exe`; en Linux extrae el TAR.BZ2 y ejecuta `Braviestale.sh`. En Android instala el APK; usa el mismo certificado de firma que la versión 0.1.7. Para jugar sin instalar, abre la [página web](https://zabat-code.github.io/Braviestale-demo/). El ZIP web es para quien quiera alojar la versión de navegador, no es un instalador para PC.

**English:** Extract the Windows ZIP and run `Braviestale.exe`; extract the Linux TAR.BZ2 and run `Braviestale.sh`. Install the Android APK (signed with the same certificate as v0.1.7). To play without installing, open the [public website](https://zabat-code.github.io/Braviestale-demo/). The web ZIP is for hosting the browser build, not a desktop installer.

## What changed / Qué cambió

- Updated story scripts and game assets on top of the optimized 0.1.7 demo; development and QA utilities are excluded from the packages. / Guion y recursos actualizados sobre la demo optimizada 0.1.7; herramientas de desarrollo y QA fuera de los paquetes.
- Ending after the battle in the Citadel, with two story branches tested (Luz and Sombra) and a working ending save. / Cierre tras la batalla en Ciudadela, con rutas Luz y Sombra probadas y guardado final funcional.
- Windows, Linux, Android, and web distributions are provided. / Distribuciones para Windows, Linux, Android y web.

## Testing / Pruebas

Ren’Py lint and automated Light/Shadow story-ending checks passed with combat abbreviated; package archives passed integrity checks; APK signature and version were verified; Linux reached the main interface under Xvfb without a traceback. **A complete combat playthrough, Windows execution, Android on a physical device, and interactive browser play were not verified.** Previous saves may be incompatible; start a new game for this demo.

Pasaron el lint de Ren’Py y las pruebas automáticas del cierre de Luz/Sombra con combates abreviados. Se comprobó la integridad de los paquetes, la firma y versión del APK y el arranque de Linux bajo Xvfb. **No se verificó un recorrido completo de combate ni la ejecución en Windows, Android físico o una partida interactiva en navegador.** Empieza partida nueva: guardados antiguos pueden ser incompatibles.

## Creative credits / Créditos creativos

Historia y dirección creativa: **Zabat-code**. Se emplearon herramientas de IA como apoyo en arte, código y música. / Story and creative direction: **Zabat-code**. AI tools assisted with art, code and music. The release provides playable binaries; source-code and redistribution rights are not granted by this repository.

[Manual / Manual](https://zabat-code.github.io/Braviestale-demo/manual.html) · [Guía con spoilers / Spoiler walkthrough](https://zabat-code.github.io/Braviestale-demo/guia.html) · [Feedback / Opiniones](https://docs.google.com/forms/d/1zlJ3Kmif0oL7CGwoQfYrqyVuAhP5IyDl5G7-eD8bMSU/viewform) · [Versiones anteriores / Older releases](https://github.com/Zabat-code/Braviestale-demo/releases)
