Proyecto: Frontend en React Native (iOS y Android).

---

## Requisitos previos

- **Node.js** >= 18
- **npm** (o yarn)
- **iOS:** Xcode, CocoaPods (`brew install cocoapods`), simulador o dispositivo
- **Android:** Android Studio, SDK y emulador o dispositivo; variable `ANDROID_HOME` configurada

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

   Si aparece error de encoding con CocoaPods:

   ```bash
   export LANG=en_US.UTF-8
   pod install
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

1. Tener un emulador abierto
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
