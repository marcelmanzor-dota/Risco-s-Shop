# How to update the Risco's Shop website / Cómo actualizar el sitio

English first · Español más abajo (desde "ESPAÑOL")

---

## ENGLISH

All products, prices, descriptions and photo names live in **three spreadsheet files** inside the `data` folder. You never need to touch the `.html` files.

| File | What it controls |
|---|---|
| `data/products.csv` | Every product card: name, price, description, photo, badge, out-of-stock |
| `data/sections.csv` | The section headings (e.g. "Floating Vanity — White") and the "Jump to" buttons |
| `data/combos.csv` | The prices in the combo tables on the Combos page |

### A. Change one price (quickest)
1. On GitHub, open the `data` folder → click **products.csv**.
2. Click the **pencil icon** (Edit this file) at the top right of the file.
3. Find the product's line (press Ctrl/Cmd + F and type part of its name). The price is the 5th value — just the number, e.g. `345`.
4. Change the number. Click **Commit changes** → **Commit changes** again.
5. Wait 2–5 minutes, then refresh the website (Ctrl/Cmd + Shift + R).

### B. Bigger edits (many prices, new products, descriptions) — use a spreadsheet
1. Open `data/products.csv` on GitHub and click the **Download raw file** button (arrow icon).
2. Open it in **Google Sheets** (File → Import → Upload → "Replace spreadsheet") or Excel.
3. Edit the cells. One row = one product card. Keep the column titles in the first row exactly as they are.
4. Save as **CSV UTF-8** (Google Sheets: File → Download → Comma-separated values. Excel: Save As → "CSV UTF-8"). Keep the file name `products.csv`.
5. On GitHub go to the `data` folder → **Add file → Upload files** → drop the file in → **Commit changes**. It replaces the old one.

### The columns in products.csv
| Column | What to put |
|---|---|
| `page` | Which page: `vanities` (Products), `toilets-tubs` (Products 2), `fixtures` (Products 3) |
| `section` | Which heading it goes under. Must match an `id` in sections.csv (e.g. `sec-floating-white`) |
| `name_en` / `name_es` | Product name in English / Spanish |
| `price` | A number like `345` (the site adds `$` and "USD"). Text also works, e.g. `From $1,080`. Leave empty for no price |
| `spec_en` / `spec_es` | The small line under the name (size · drawers) |
| `photo` | The photo's file name from the `images` folder, e.g. `vanity-24-white-new.jpg`. Leave empty to show "Photo coming soon" |
| `badge_en` / `badge_es` | Optional gold tag on the photo, e.g. `Most popular` / `Más popular` |
| `out_of_stock` | Type `yes` to show the "Out of stock" tag. Empty = normal |
| `hide` | Type `yes` to hide the product from the site without deleting it |
| `photo_style` | Leave empty normally. `full` = show the photo uncropped (for tall photos). `wood` = wood-tone background |
| `desc_en` / `desc_es` | The long description |

**Order:** products appear in the same order as the rows. To move one up or down, move its row.

### Add a new product
Copy a similar row, paste it where you want it, and change the cells. Make sure `page` and `section` are correct. Upload its photo first (next step).

### Add or replace a photo
1. On GitHub open the **images** folder → **Add file → Upload files** → drop the photo(s) → **Commit changes**.
2. Use a **new file name** each time (e.g. `vanity-24-white-2.jpg`) — if you reuse an old name, visitors may keep seeing the old picture for a while.
3. Put that exact file name (including `.jpg`) in the `photo` column. Spelling and capital letters must match.
4. Photos: JPG, about 1,200 pixels wide, under 500 KB is ideal. Upload them in small groups (under 20 at a time).

If a file name is wrong, the card shows "Photo coming soon" instead of a broken picture — a sign to check the name and that the file is really inside the `images` folder.

### Add a new section (heading)
Add a row in `sections.csv`: `page`, a short unique `id` starting with `sec-` (no spaces), the title in English and Spanish, and a short name for the "Jump to" button (`chip_en` / `chip_es`; leave empty for no button). Then use that `id` in the `section` column of the products.

### Combo prices
Edit `data/combos.csv`. `combo` is `classic-white`, `modern-white` or `natural-wood`. Change the `price`.

### Rules (please follow)
- Don't edit the `.html` files, `catalog.js` or the column titles.
- Don't leave a quote mark `"` inside a cell unless you saved from Google Sheets/Excel — they handle it for you. Typing inch marks (`24"`) in a spreadsheet is fine.
- Changes go live in about 2–5 minutes. Browsers may need a hard refresh (Ctrl/Cmd + Shift + R).
- **Made a mistake?** On GitHub open the file → **History** → click the previous version → **⋯ → Revert** (or copy the old content back). Nothing is ever lost.
- Things not in these files (home page text, reviews, phone/address, the home-page vanity picker, page design) are handled by Marcel.

---

## ESPAÑOL

Todos los productos, precios, descripciones y nombres de fotos están en **tres archivos tipo hoja de cálculo** dentro de la carpeta `data`. No hace falta tocar los archivos `.html`.

| Archivo | Qué controla |
|---|---|
| `data/products.csv` | Cada tarjeta de producto: nombre, precio, descripción, foto, etiqueta, agotado |
| `data/sections.csv` | Los títulos de sección (p. ej. "Vanidad Flotante — Blanco") y los botones "Ir a" |
| `data/combos.csv` | Los precios de las tablas de combos en la página Combos |

### A. Cambiar un precio (lo más rápido)
1. En GitHub abre la carpeta `data` → clic en **products.csv**.
2. Clic en el **lápiz** (Edit this file), arriba a la derecha.
3. Busca la línea del producto (Ctrl/Cmd + F y escribe parte del nombre). El precio es el 5.º valor — solo el número, p. ej. `345`.
4. Cambia el número. Clic en **Commit changes** → **Commit changes** otra vez.
5. Espera 2–5 minutos y refresca el sitio (Ctrl/Cmd + Shift + R).

### B. Cambios grandes (muchos precios, productos nuevos, descripciones) — usa una hoja de cálculo
1. Abre `data/products.csv` en GitHub y haz clic en **Download raw file** (icono de flecha).
2. Ábrelo en **Google Sheets** (Archivo → Importar → Subir → "Reemplazar hoja de cálculo") o en Excel.
3. Edita las celdas. Una fila = una tarjeta de producto. Deja los títulos de la primera fila tal como están.
4. Guarda como **CSV UTF-8** (Google Sheets: Archivo → Descargar → Valores separados por comas. Excel: Guardar como → "CSV UTF-8"). Mantén el nombre `products.csv`.
5. En GitHub entra a la carpeta `data` → **Add file → Upload files** → suelta el archivo → **Commit changes**. Reemplaza al anterior.

### Las columnas de products.csv
| Columna | Qué poner |
|---|---|
| `page` | Página: `vanities` (Productos), `toilets-tubs` (Productos 2), `fixtures` (Productos 3) |
| `section` | Bajo qué título va. Debe coincidir con un `id` de sections.csv (p. ej. `sec-floating-white`) |
| `name_en` / `name_es` | Nombre del producto en inglés / español |
| `price` | Un número como `345` (el sitio agrega `$` y "USD"). También sirve texto, p. ej. `From $1,080`. Vacío = sin precio |
| `spec_en` / `spec_es` | La línea pequeña bajo el nombre (tamaño · gavetas) |
| `photo` | Nombre del archivo en la carpeta `images`, p. ej. `vanity-24-white-new.jpg`. Vacío = "Foto próximamente" |
| `badge_en` / `badge_es` | Etiqueta dorada opcional sobre la foto, p. ej. `Most popular` / `Más popular` |
| `out_of_stock` | Escribe `yes` para mostrar "Agotado". Vacío = normal |
| `hide` | Escribe `yes` para ocultar el producto sin borrarlo |
| `photo_style` | Normalmente vacío. `full` = foto completa sin recortar (fotos verticales). `wood` = fondo color madera |
| `desc_en` / `desc_es` | La descripción larga |

**Orden:** los productos salen en el mismo orden que las filas. Para moverlos, mueve la fila.

### Agregar un producto nuevo
Copia una fila parecida, pégala donde quieras y cambia las celdas. Revisa que `page` y `section` estén bien. Sube primero la foto (siguiente paso).

### Agregar o cambiar una foto
1. En GitHub abre la carpeta **images** → **Add file → Upload files** → suelta la(s) foto(s) → **Commit changes**.
2. Usa siempre un **nombre de archivo nuevo** (p. ej. `vanity-24-white-2.jpg`) — si reutilizas un nombre viejo, algunos visitantes seguirán viendo la foto anterior por un tiempo.
3. Escribe ese nombre exacto (con `.jpg`) en la columna `photo`. Las mayúsculas y la ortografía deben coincidir.
4. Fotos: JPG, unos 1,200 píxeles de ancho, menos de 500 KB. Súbelas en grupos pequeños (menos de 20 a la vez).

Si el nombre está mal, la tarjeta muestra "Foto próximamente" en vez de una imagen rota — señal para revisar el nombre y que el archivo esté dentro de la carpeta `images`.

### Agregar una sección nueva
Agrega una fila en `sections.csv`: `page`, un `id` corto y único que empiece con `sec-` (sin espacios), el título en inglés y español, y un nombre corto para el botón "Ir a" (`chip_en` / `chip_es`; vacío = sin botón). Luego usa ese `id` en la columna `section` de los productos.

### Precios de combos
Edita `data/combos.csv`. `combo` es `classic-white`, `modern-white` o `natural-wood`. Cambia el `price`.

### Reglas
- No edites los archivos `.html`, `catalog.js` ni los títulos de las columnas.
- Escribir pulgadas (`24"`) en una hoja de cálculo está bien; Google Sheets/Excel lo manejan solos.
- Los cambios se ven en 2–5 minutos. Puede hacer falta refrescar con Ctrl/Cmd + Shift + R.
- **¿Te equivocaste?** En GitHub abre el archivo → **History** → clic en la versión anterior → **⋯ → Revert** (o copia el contenido anterior). Nada se pierde.
- Lo que no está en estos archivos (textos de la página de inicio, reseñas, teléfono/dirección, el selector de vanidades de inicio, el diseño) lo maneja Marcel.
