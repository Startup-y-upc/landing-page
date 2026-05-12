# Rent2Go Landing Page

## 1. Proposito y alcance

Este modulo implementa la Landing Page estatica de Rent2Go como parte del alcance del curso de Aplicaciones para Dispositivos Moviles.

Alcance funcional de esta Landing:

- Presentar la propuesta de valor de Rent2Go.
- Mostrar secciones de producto, flota, requisitos, FAQ y contacto.
- Soportar internacionalizacion basica para en_US y es_419.
- Cumplir lineamientos base de accesibilidad, SEO tecnico y responsive design.

## 2. Tabla de contenidos

- [Rent2Go Landing Page](#rent2go-landing-page)
	- [1. Proposito y alcance](#1-proposito-y-alcance)
	- [2. Tabla de contenidos](#2-tabla-de-contenidos)
	- [3. Stack y cumplimiento](#3-stack-y-cumplimiento)
	- [4. Estructura actual de carpetas y archivos](#4-estructura-actual-de-carpetas-y-archivos)
	- [5. Ejecucion local](#5-ejecucion-local)
	- [6. Configuracion i18n](#6-configuracion-i18n)

## 3. Stack y cumplimiento

Tecnologias principales:

- HTML5
- CSS3
- JavaScript vanilla (sin framework)

Cumplimiento alineado a lineamientos del curso:

| Criterio | Estado | Evidencia tecnica |
| --- | --- | --- |
| HTML5/CSS3/JS | Implementado | Estructura estatica en index.html, estilos en css/style.css y logica en js/app.js |
| i18n en_US y es_419 | Implementado | Archivos i18n/en_US.json e i18n/es_419.json |
| A11y (ARIA basico) | Parcial | Roles ARIA, aria-label y aria-live en componentes clave |
| SEO tecnico basico | Parcial | title, meta description y viewport en head |
| Responsive design | Implementado | Layout adaptable en CSS y menu mobile |

Nota: El estado "Parcial" indica que existe base implementada, pero requiere evidencia formal del sprint y mejoras incrementales.

## 4. Estructura actual de carpetas y archivos

```text
landing-page/
|- index.html
|- style.css
|- script.js
|- design-tokens.json
|- README.md
|- css/
|  |- style.css
|- js/
|  |- app.js
|- i18n/
|  |- en_US.json
|  |- es_419.json
|- sections/
|  |- header.html
|  |- hero.html
|  |- features.html
|  |- fleet.html
|  |- how.html
|  |- requirements.html
|  |- testimonials.html
|  |- faq.html
|  |- contact.html
|  |- footer.html
```

## 5. Ejecucion local

1. Abrir landing-page/index.html en el navegador.
2. Nota: algunas politicas del navegador pueden limitar fetch local para i18n.

## 6. Configuracion i18n

Idiomas soportados:

- en_US
- es_419

Ubicacion de recursos:

- i18n/en_US.json
- i18n/es_419.json

Comportamiento actual:

- js/app.js resuelve idioma con localStorage (clave r2g_lang).
- Si el idioma guardado no es valido, usa en_US por defecto.
- El boton de idioma alterna entre en_US y es_419.
- Los textos se aplican mediante atributos data-i18n.

Regla para nuevos textos:

- Todo texto visible agregado en HTML debe incluir clave data-i18n y su traduccion en ambos JSON.
