# Proyecto Euclides 🔐

[![Deploy to GitHub Pages](https://github.com/A-benites/proyecto_euclides/actions/workflows/deploy.yml/badge.svg)](https://github.com/A-benites/proyecto_euclides/actions/workflows/deploy.yml)

> Plataforma educativa interactiva para aprender el Algoritmo de Euclides y el Algoritmo de Euclides Extendido en el contexto de la criptografía RSA.

**🌐 Demo en vivo:** [https://a-benites.github.io/proyecto_euclides/](https://a-benites.github.io/proyecto_euclides/)

---

## ✨ Características

- **Introducción Visual RSA** — Diagrama de flujo interactivo que sitúa cada concepto en el pipeline de generación de claves.
- **Laboratorio Interactivo Paso a Paso** — Ingresa tus propios números primos y exponente. El simulador muestra cada iteración del algoritmo en una tabla animada con controles de reproducción (anterior / siguiente / autoplay).
- **Contexto Educativo y Fórmulas** — Paneles desplegables (`InfoAccordion`) que explican el significado matemático de $p$, $q$, $\phi(n)$ y $e$, además del desglose paso a paso de las ecuaciones recursivas de la Identidad de Bézout para el Inverso Modular.
- **Zona de Desafíos Gamificada** — 13 problemas en 3 niveles de dificultad con sistema de pistas progresivas. Incluye sistema de puntuación, rachas (🔥) y un sistema de insignias/badges desbloqueables (🌱, 🧮, 🦅, 💎).
- **BigInt nativo** — Soporte para números primos gigantes con sistema de advertencia en 3 zonas (verde / amarillo / rojo).

---

## 🏗 Arquitectura (Clean Architecture)

```
├── core/math/          # Lógica pura (sin dependencias de UI)
│   ├── euclides.ts     # GCD clásico — retorna array de pasos
│   ├── euclidesExtendido.ts  # Extended GCD + inverso modular
│   ├── rsa.ts          # Generación de claves RSA + Miller-Rabin
│   └── challenges.ts   # Motor de generación de ejercicios
├── types/              # Interfaces TypeScript compartidas
│   └── euclides.ts
├── lib/                # Validadores de entrada
│   └── validators.ts
├── components/         # Componentes React organizados por feature
│   ├── layout/         # Header, Footer
│   ├── intro/          # FlowDiagram
│   ├── lab/            # LabInputForm, StepTable, PlaybackControls
│   ├── ui/             # Componentes genéricos (Tooltip, InfoAccordion)
│   └── challenges/     # Componentes del sistema de retos
├── app/                # Next.js App Router
│   ├── page.tsx        # Página de Introducción
│   ├── lab/page.tsx    # El Laboratorio
│   └── challenges/page.tsx  # Zona de Desafíos
└── tests/              # Tests unitarios con Vitest
```

---

## 🚀 Ejecutar en Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/A-benites/proyecto_euclides.git
cd proyecto_euclides

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción (exportación estática en `/out`) |
| `npm test` | Ejecuta los tests unitarios con Vitest |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run lint` | Linting con ESLint |

---

## 🧪 Tests

Los tests cubren el módulo matemático completo:

```bash
npm test
# PASS  tests/euclides.test.ts         (6 tests)
# PASS  tests/euclidesExtendido.test.ts (5 tests)
# PASS  tests/rsa.test.ts               (12 tests)
```

Casos clave validados:
- `gcd(48, 18) = 6`
- `gcd(7, 40) = 1` (coprimos)
- Inverso de `17 mod 3120 = 2753` (ejemplo clásico RSA: p=61, q=53, e=17)
- Miller-Rabin para verificación de primalidad robusta.

---

## 📦 Stack Tecnológico

- **Framework:** Next.js 16 (App Router, `output: export`)
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS 4
- **Iconos:** Lucide React
- **Animaciones:** Framer Motion 11
- **Tests:** Vitest 3 + @testing-library/react
- **CI/CD:** GitHub Actions → GitHub Pages

---

## 🔢 Rango de Números Soportado

| Zona | Rango de p, q | Comportamiento |
|------|--------------|----------------|
| 🟢 Verde | ≤ 9,999 | Cálculo instantáneo |
| 🟡 Amarillo | 10,000 – 99,999 | Advertencia de lentitud |
| 🔴 Rojo | ≥ 100,000 | Modal de confirmación requerido |

El módulo usa `BigInt` nativo de JavaScript para precisión perfecta sin límite de tamaño.

---

*Proyecto académico — Algoritmos de Criptografía*
