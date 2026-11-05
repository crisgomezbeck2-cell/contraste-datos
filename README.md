# Contraste: datos y actualización diaria

Proceso automático de [Contraste](https://contraste-prototipo.netlify.app), prototipo universitario de investigación periodística.

Cada mañana `automatizacion/actualizar.py` consulta los datos oficiales de la Cámara y el Senado y titulares de prensa, y genera `publicar/datos/`. Si una fuente falla, se conserva su última versión buena. Los votos no se editan a mano.
