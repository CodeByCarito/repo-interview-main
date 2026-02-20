Proyecto: Frontend en React Native (iOS y Android).

---

## Requisitos previos

- **Node.js** >= 18
- **npm** (o yarn)
- **iOS:** Xcode, CocoaPods, simulador o dispositivo (ver [Configuración iOS](#configuración-por-primera-vez-ios)).
- **Android:** Android Studio, JDK 17–20, Android SDK (API 35), `ANDROID_HOME` y `adb` en el PATH (ver [Configuración Android](#configuración-por-primera-vez-android)).

---

## Configuración por primera vez (iOS)

Solo necesitas hacerlo una vez en tu máquina.

1. **Xcode**  
   Instálalo desde la App Store y abre Xcode una vez para aceptar la licencia.

2. **CocoaPods**  
   ```bash
   brew install cocoapods
   ```

3. **Dependencias nativas de iOS**  
   Desde la raíz del repo:
   ```bash
   cd front/ios
   pod install
   cd ../..
   ```
   Si aparece error de encoding:
   ```bash
   export LANG=en_US.UTF-8
   pod install
   ```

4. **Simulador**  
   Lo trae Xcode. Puedes elegir dispositivo en Xcode → Window → Devices and Simulators, o al correr `npm run ios:sim` (ej. iPhone 17).

Después de esto, para correr la app en iOS solo necesitas [Metro y el comando de iOS](#ios).

---

## Configuración por primera vez (Android)

Solo necesitas hacerlo una vez en tu máquina. Si algo falla, usa `npx react-native doctor` desde `front` para ver el estado.

### 1. JDK 17–20

```bash
brew install openjdk@17
```

En `~/.zshrc` (o tu archivo de shell):

```bash
export JAVA_HOME="$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home"
```

Abre una nueva terminal y comprueba: `java -version`.

### 2. ANDROID_HOME y PATH (necesario para `adb` y el emulador)

En `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

`platform-tools` incluye `adb`. Sin esto verás **"adb: command not found"** y, tras un build exitoso, **"Failed to start the app" / spawnSync adb ENOENT** porque el CLI no puede lanzar la app en el emulador.

Ejecuta `source ~/.zshrc` o abre una **nueva terminal** y comprueba: `adb version`.

### 3. Ruta del SDK para Gradle (`local.properties`)

Para que Gradle encuentre el SDK (y no falle con "SDK location not found"), crea o edita `front/android/local.properties` con tu ruta (en macOS suele ser):

```properties
sdk.dir=/Users/TU_USUARIO/Library/Android/sdk
```

Sustituye `TU_USUARIO` por tu usuario. Este archivo está en `.gitignore` y no se sube al repo.

### 4. Android SDK (API 35)

En **Android Studio** → **Settings** (o **Preferences**) → **Languages & Frameworks** → **Android SDK**:

- **SDK Platforms:** instala **Android 14.0 (API 35)**.
- **SDK Tools:** asegúrate de tener **Android SDK Build-Tools**, **Android SDK Platform-Tools** y **Android Emulator**.

### 5. Emulador o dispositivo

- **Emulador:** Android Studio → **Device Manager** → **Create Device** → elige un modelo (ej. Pixel) y una imagen del sistema con **API 35** → **Run** para arrancar el AVD.
- **Dispositivo físico:** activa **Opciones de desarrollador** y **Depuración USB**, conecta por USB y acepta la autorización. Comprueba con `adb devices`.

### 6. Comprobar que todo está bien

Desde `front`:

```bash
npx react-native doctor
```

Corrige los errores que salgan (JDK, ANDROID_HOME, SDK, emulador) hasta que la sección Android esté en verde.

### 7. Parche de react-native-gesture-handler

El proyecto incluye un parche para que `react-native-gesture-handler` compile con React Native 0.76. Se aplica solo en `npm install` (postinstall con `patch-package`). No hace falta hacer nada manual.

Después de esto, para correr la app en Android solo necesitas tener un emulador abierto (o un dispositivo conectado) y [Metro y el comando de Android](#android).

---

## Backend

API REST que corre en el puerto **3002**. El frontend lo usa para listar, crear, editar y eliminar productos.

### Cómo correr el back

```bash
cd back
npm install
npm run start:dev
```

El servidor queda en **http://localhost:3002**.

---

## Frontend

App React Native para iOS y Android. Consume el backend en `http://localhost:3002` (o `http://10.0.2.2:3002` en el emulador Android).

### Instalación

```bash
cd front
npm install
```

### iOS

1. Instalar dependencias nativas (solo la primera vez o al cambiar deps):

   ```bash
   cd front/ios
   pod install
   cd ..
   ```

2. Arrancar Metro (bundler):

   ```bash
   npm start
   ```

3. En otra terminal, correr la app:

   ```bash
   npm run ios
   ```

   Para un simulador concreto (ej. iPhone 17):

   ```bash
   npm run ios:sim
   ```

### Android

1. Tener un emulador abierto (o un dispositivo conectado por USB con depuración activada).
2. Arrancar Metro:

   ```bash
   npm start
   ```

3. En otra terminal, correr la app:

   ```bash
   npm run android
   ```

---

## Orden recomendado para desarrollar

1. **Backend:** en una terminal, desde `back`: `npm install` y `npm run start:dev` (puerto 3002).
2. **Frontend:** en otra terminal, desde `front`: `npm start` (Metro).
3. **App:** en una tercera terminal, desde `front`: `npm run ios` o `npm run android`.

Con el backend en 3002 y Metro en marcha, la app podrá llamar a la API sin cambios extra de configuración.

---

## Estructura del repositorio

```
├── back/          # API Node/Express (puerto 3002)
│   ├── src/
│   └── package.json
├── front/         # App React Native
│   ├── src/
│   ├── ios/
│   ├── android/
│   └── package.json
└── README.md
```

---

## Tests del frontend

```bash
cd front
npm test
```

---

## Notas

- **Android emulador:** la app usa `10.0.2.2:3002` para hablar con el backend del host; no hace falta tocar nada.
- **iOS simulador:** usa `localhost:3002`; el backend debe estar corriendo en tu máquina.
- **Primera vez:** si es tu primera vez con el proyecto, sigue las secciones [Configuración por primera vez (iOS)](#configuración-por-primera-vez-ios) y [Configuración por primera vez (Android)](#configuración-por-primera-vez-android) según la plataforma que vayas a usar.
