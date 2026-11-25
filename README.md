### JSON niat (rutes)

Ruta del codi postal de la botiga -> `botiga.adreca.codiPostal` = `08951`<br>
Ruta de la nota de la 3a opinió de The Legend of Zelda: Majora's Mask -> `botiga.jocs[4].opinions[2].nota` = `3.3`<br>
Ruta del preu de Super Mario 64 -> `botiga.jocs[5].preu` = `41.31`<br>
Ruta del 3er gènere de Final Fantasy VII -> `botiga.jocs[2].genere[2]` = `Fantasia`<br>

### API jocs.json

Nombre -> `jocs[0].any` = `2017`<br>
Text -> `jocs[1].titol` = `Celeste`<br>
Llista -> `jocs[2].generes` = `["Simulació", "Indie"]`<br>
Objecte d'objecte -> `jocs[3].desenvolupador` = `{"nom":"Supergiant Games", "pais":"Estats Units"}`<br>
Llista d'objectes -> `jocs[4].opinions` = `[{"usuari":"laia_pixel", "nota":10}, {"usuari":"jordi88", "nota":9}]`<br>

API/botiga: `jocs.json` retorna un objecte amb el total i una llista (`jocs`) amb tots els jocs, mentre que `/api/jocs/CODI.json` retorna les dades d'un sol joc en concret. La botiga d'activitats anteriors tindria el JSON del catàleg 
i el JSON per la fitxa del joc.

### BBDD SQLite
Les llistes les podriem incloure com a atribut multivaluat o bé creant noves taules que s'hi relacioni amb el joc.
