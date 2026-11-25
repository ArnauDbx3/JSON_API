-- Mostra totes les entrades i columnes de jocs
SELECT * FROM jocs;

-- Mostra el nom i preu dels jocs on el preu sigui < a 40
SELECT nom, preu FROM jocs WHERE preu < 40;

-- Mostra els jocs amb preu < 40 i que tinguin estoc (> 0)
SELECT * FROM jocs WHERE preu < 40 AND estoc > 0;

-- Mostra els jocs que continguin la paraula Zelda
SELECT * FROM jocs WHERE nom LIKE '%Zelda%';

-- Mostra els jocs ordenats de car a barat i de barat a car
SELECT nom, preu FROM jocs ORDER BY preu DESC;
SELECT nom, preu FROM jocs ORDER BY preu;

-- Mostra un counter d'elements a la taula jocs, el preu mitjà i el màxim
SELECT 
    COUNT(*), 
    AVG(preu), 
    MAX(preu) 
FROM jocs;

-- Mostra jocs esgotats
SELECT * FROM jocs WHERE estoc = 0;

-- Inserta joc amb tots els seus paràmetres
INSERT INTO jocs (codi, nom, preu, valoracio, estoc, disponible, dataSortida, descripcio)
VALUES ('JOC-999', 'Splatoon', 41.31, 9.5, 6, 1, '20-08-2018', 'Shooter insignia de Nintendo amb calamars i pintura');

-- Mostra el joc de prova
SELECT * FROM jocs WHERE codi = 'JOC-999'

-- Modifica l'estoc del nou joc
UPDATE jocs SET estoc = 12 WHERE codi = 'JOC-999'

-- Esborra la fila
DELETE FROM jocs WHERE codi = 'JOC-999'

-- Comprovació final 
SELECT COUNT(*) FROM jocs;
