# Front - React Native (iOS)

Proyecto React Native inicializado en la carpeta `front` con soporte para iOS.

## Versiones (requerimientos cumplidos)

| Requisito           | Mínimo  | Instalado   |
|---------------------|---------|-------------|
| React Native        | 0.7+    | **0.76.7** ✓ |
| React               | 18+     | **18.3.1** ✓  |
| TypeScript          | 4.8+    | **5.0.4** ✓   |

## Dependencias del sistema para iOS

Antes de ejecutar `npm run ios`, asegúrate de tener:

### 1. Node.js (✓ ya lo tienes)
- **Requerido:** Node >= 18  
- Verificar: `node -v`

### 2. Xcode (recomendado para simulador)
- Para **simulador iOS** y builds nativos necesitas **Xcode** (App Store), no solo Command Line Tools.
- Verificar: abre Xcode o ejecuta `xcodebuild -version`.
- Acepta la licencia si es la primera vez: `sudo xcodebuild -license accept`.

### 3. CocoaPods (necesario para iOS)
- **Requerido** para instalar dependencias nativas de iOS.
- Instalación:
  ```bash
  # Opción 1: con Ruby (macOS)
  sudo gem install cocoapods

  # Opción 2: con Homebrew
  brew install cocoapods
  ```
- Después de instalar CocoaPods, desde la carpeta `front`:
  ```bash
  cd ios && pod install && cd ..
  ```

## Cómo ejecutar

```bash
# Desde la raíz del repo
cd front

# Instalar pods (solo la primera vez o tras añadir dependencias nativas)
cd ios && pod install && cd ..

# Arrancar Metro
npm start

# En otra terminal: ejecutar en simulador iOS
npm run ios
```

## Scripts

- `npm start` — inicia el bundler Metro
- `npm run ios` — ejecuta la app en el simulador iOS
- `npm run android` — ejecuta la app en Android (cuando lo configures)
- `npm run lint` — ESLint
- `npm test` — Jest
