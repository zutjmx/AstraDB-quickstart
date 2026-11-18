# Astra DB Quickstart

Ejemplo en TypeScript de conexión a Astra DB, inserción de documentos con vectores precomputados y búsqueda por similitud. La lógica principal está en [`quickstart.ts`](./quickstart.ts).

## Requisitos

- Node.js y npm.
- Una base de datos de Astra DB con acceso a Data API.
- Un token de aplicación y el endpoint de la base de datos.

Instala las dependencias del proyecto:

```sh
npm install
```

## Configuración

Define las variables de entorno antes de ejecutar el ejemplo. En PowerShell:

```powershell
$env:ASTRA_DB_APPLICATION_TOKEN = "tu-token"
$env:ASTRA_DB_API_ENDPOINT = "https://tu-endpoint"
```

El programa comprueba que ambas variables estén definidas y se detiene con un error descriptivo si falta alguna. No guardes el token en el código ni lo compartas.

## Ejecución

Ejecuta el archivo con `tsx`:

```sh
npx tsx quickstart.ts
```

## Qué hace `quickstart.ts`

1. Crea un `DataAPIClient` con el token y obtiene la base de datos indicada por el endpoint.
2. Define el tipo `Idea`, que contiene un texto `idea` y un vector precomputado (`$vector`).
3. Crea la colección `vector_test`, configurada para vectores de 5 dimensiones y similitud coseno.
4. Inserta tres ideas con UUID y vectores de ejemplo.
5. Busca hasta 10 documentos ordenados por similitud respecto a un vector de consulta e imprime cada idea y su puntuación.

Los vectores del ejemplo tienen cinco valores; si los reemplazas, asegúrate de que tanto los vectores insertados como el vector de búsqueda tengan la dimensión configurada en la colección.

> Nota: el bloque de inserción captura cualquier error de `insertMany` y muestra un mensaje indicando que los documentos ya existen. Por ello, otros errores de inserción también pueden aparecer con ese mensaje.
