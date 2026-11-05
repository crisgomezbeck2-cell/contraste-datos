# Contraste: datos y actualización diaria

Proceso automático de [Contraste](https://contraste-prototipo.netlify.app), prototipo universitario de investigación periodística.

Cada mañana `automatizacion/actualizar.py` consulta los datos oficiales de la Cámara y el Senado y titulares de prensa, y genera `publicar/datos/`. Si una fuente falla, se conserva su última versión buena. Los votos no se editan a mano.

## Scripts que se corren a mano

- `automatizacion/resenas.py`: reseñas desde la introducción de Wikipedia, con verificación de nombre, dos apellidos, país y cargo. Genera `publicar/datos/resenas.js`.
- `automatizacion/historico.py --resolver 5000`: selección de noticias antiguas por períodos. Genera `publicar/datos/noticias-antiguas.js`.
- `automatizacion/fotos.py`: también corre en la actualización diaria. Usa el artículo verificado por `resenas.py`, así que conviene correr primero ese script.
