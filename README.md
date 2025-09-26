# ProyectoFinal
Proyecto Final Asistencial Médica de Maldonado

# Documentación Técnica del Proyecto ELIO

## Tabla de Contenidos
1. Historias de Usuario y Mockups
2. Arquitectura del Sistema
3. Componentes, Clases y Diseño de Base de Datos
4. Diagramas de Secuencia
5. Especificaciones de API
6. Estrategias de Source Control Managment (SCM) y Quality Assurance (QA)
7. Justificaciones Técnicas

## 1. Historias de Usuario y Mockups

### 1.1 Historias de Usuario Priorizadas (MoSCoW)

#### Must Have
- Como médico, quiero realizar el registro de mis consultas de la manera más asequible, cómoda y eficiente, para dedicar más cantidad de tiempo a la observación del paciente y no a completar formularios.

### 1.2 Mockups

Acá vamos a insertar las imágenes o enlaces a tus mockups creados con herramientas usadas

![Mockup 1: Ponemos la descripción] y la (ruta/a/la/imagen)


## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura

Acá insertamos el diagrama de arquitectura de alto nivel que muestre los componentes principales de nuestro sistema

![Diagrama de Arquitectura] y la (ruta/a/la/imagen)

### 2.2 Descripción de Componentes

| Componente | Tecnología | Descripción |
|------------|------------|-------------|
| Frontend   | [programa que usamos] | [Breve descripción del componente y su rol] |
| Backend    | [lenguaje usado] | [Breve descripción del componente y su rol] |
| Base de Datos | [tipo de base de datos usada] | [Breve descripción del componente y su rol] |
| Servicios Externos | [APIs usadas o todo lo externo usado] | [Breve descripción del componente y su rol] |

### 2.3 Flujo de Datos

Tenemos que describir cómo fluyen los datos entre los diferentes componentes de nuestro sistema

## 3. Componentes, Clases y Diseño de Base de Datos

### 3.1 Componentes y Clases Principales

#### Backend
Listado y descripción de las clases principales, sus atributos y métodos


#### Frontend
Listado de los componentes principales de la interfaz de usuario y sus interacciones


### 3.2 Diseño de Base de Datos

#### [Elige uno según tu proyecto]

#### Opción A: Diagrama ER (para bases de datos relacionales)

Aquí ponemos un diagrama ER que muestre tablas, atributos y relaciones si existen

![Diagrama ER](ruta/a/la/imagen)

#### Opción B: Estructura de Colecciones (para bases de datos NoSQL)

**Colección: usuarios**
```json
{
  "_id": "ObjectId",
  "nombre": "String",
  "email": "String",
  "contraseña": "String (hashed)",
  "fechaCreacion": "Date",
  "ultimoAcceso": "Date"
}
```

**Colección: [otra colección]**
```json
{
  "_id": "ObjectId",
  "campo1": "Tipo",
  "campo2": "Tipo",
  "referencia": "ObjectId (referencia a otra colección)"
}
```

## 4. Diagramas de Secuencia

### 4.1 [Caso de Uso Crítico 1: ej. Proceso de Autenticación]

Aquí ponemos un diagrama de secuencia para este caso de uso

![Diagrama de Secuencia: Autenticación](ruta/a/la/imagen)

### 4.2 [Caso de Uso Crítico 2: ej. Creación de Nuevo Recurso]

Aquí ponemos un diagrama de secuencia para este caso de uso

![Diagrama de Secuencia: Creación de Recurso](ruta/a/la/imagen)

## 5. Especificaciones de API

### 5.1 APIs Externas

| API | Propósito | Endpoints Utilizados | Justificación |
|-----|-----------|----------------------|---------------|
| [Nombre de API] | [Para qué se usa] | [Endpoints específicos] | [Por qué se eligió esta API] |

### 5.2 API Interna

#### Endpoints del Backend

| Ruta | Método HTTP | Descripción | Parámetros de Entrada | Formato de Salida |
|------|-------------|-------------|----------------------|-------------------|
| `/api/usuarios` | GET | Obtener lista de usuarios | `?limite=10&pagina=1` | ```json { "usuarios": [...], "total": 100 }``` |
| `/api/usuarios` | POST | Crear un nuevo usuario | ```json { "nombre": "...", "email": "...", "contraseña": "..." }``` | ```json { "id": "...", "nombre": "...", "email": "..." }``` |
| `/api/usuarios/:id` | GET | Obtener detalle de usuario | `id` en URL | ```json { "id": "...", "nombre": "...", "email": "..." }``` |


## 6. Estrategias de SCM y QA

### 6.1 Gestión de Control de Versiones (SCM)

#### Herramienta
- **Sistema**: Git
- **Plataforma**: GitHub

#### Estrategia de Ramas
- **main**: Código en producción
- **develop**: Código integrado para la próxima versión
- **feature/[nombre]**: Ramas para nuevas funcionalidades
- **hotfix/[nombre]**: Ramas para correcciones urgentes

#### Proceso de Desarrollo
1. Crear una rama `feature/[nombre]` desde `develop`
2. Desarrollar la funcionalidad
3. Abrir Pull Request hacia `develop`
4. Revisión de código por al menos un miembro del equipo
5. Merge a `develop`
6. Pruebas en ambiente de staging
7. Merge a `main` para despliegue en producción

### 6.2 Aseguramiento de Calidad (QA)

#### Tipos de Pruebas
- **Pruebas Unitarias**: Para validar funciones y componentes individuales
- **Pruebas de Integración**: Para validar interacciones entre componentes
- **Pruebas de API**: Para validar endpoints y respuestas
- **Pruebas de UI** (si aplica): Para validar la interfaz de usuario
- **Pruebas de Aceptación**: Para validar historias de usuario

#### Herramientas
- **Pruebas Unitarias**: [Ej: Jest, Mocha]
- **Pruebas de API**: [Ej: Postman, Supertest]
- **Pruebas de UI**: [Ej: Cypress, Selenium]
- **CI/CD**: [Ej: GitHub Actions, Jenkins]

#### Cobertura de Código
- Objetivo: >80% de cobertura en código crítico
- Se utilizará [que herramientas] para medir la cobertura

#### Proceso de QA
1. Ejecución de pruebas unitarias y de integración en cada commit
2. Pruebas de API y UI antes de cada merge a `develop`
3. Pruebas manuales críticas antes de despliegue a producción
4. Revisión de rendimiento en ciclos regulares

## 7. Justificaciones Técnicas

### 7.1 Elección de Tecnologías

| Tecnología | Alternativas Consideradas | Justificación |
|------------|---------------------------|---------------|
| [Frontend] | [Alternativas] | [Razones para elegir esta tecnología] |
| [Backend] | [Alternativas] | [Razones para elegir esta tecnología] |
| [Base de Datos] | [Alternativas] | [Razones para elegir esta tecnología] |

### 7.2 Decisiones de Diseño

| Decisión | Alternativas | Justificación |
|----------|--------------|---------------|
| [Ej: Arquitectura de microservicios] | [Ej: Monolito] | [Razones para esta decisión] |
| [Ej: Autenticación con JWT] | [Ej: Sesiones, OAuth] | [Razones para esta decisión] |
| ... | ... | ... |

### 7.3 Consideraciones de Escalabilidad y Mantenimiento

[Descripcion de como nuestr diseño técnico contempla el crecimiento futuro y facilita el mantenimiento de la aplicacióon]

---

## Apéndices

### Glosario de Términos

| Término | Definición |
|---------|------------|
| [Término técnico] | [Definición de lo que es] |

### Referencias

- [Lista de fuentes, documentación o estándares utilizados]
