const API = "https://lluisbelmonte-rgb.github.io/botiga-api/api";

const contenidor = document.querySelector("#jocs");
const comptador = document.querySelector("#comptador-resultats");
const missatgesEstat = document.querySelector("#missatges-estat");
const inputCodi = document.querySelector("#cerca-codi");
const botoCerca = document.querySelector("#boto-cerca");
const inputFitxer = document.querySelector("#fitxer-json");

function netejaMissatges() {
    missatgesEstat.replaceChildren();
}

function mostraMissatgeDOM(text) {
    netejaMissatges();
    const p = document.createElement("p");
    p.classList.add("missatge-error");
    p.textContent = text;
    missatgesEstat.appendChild(p);
}

function calculaNotaMitjana(opinions) {
    if (!Array.isArray(opinions) || opinions.length === 0) {
        return "0.0";
    }
    const suma = opinions.reduce((acumulador, opinio) => acumulador + Number(opinio.nota || 0), 0);
    return (suma / opinions.length).toFixed(1);
}

function creaTargetaJoc(joc) {
    const targeta = document.createElement("article");
    targeta.classList.add("joc");

    const esDisponible = joc.disponible === false || joc.disponible === 0 ? false : true;
    if (!esDisponible) {
        targeta.classList.add("esgotat");
    }

    const titol = document.createElement("h3");
    titol.textContent = joc.titol || joc.nom || joc.codi || "Sense títol";
    targeta.appendChild(titol);

    if (joc.desenvolupador) {
        const pDev = document.createElement("p");
        const strongDev = document.createElement("strong");
        strongDev.textContent = "Desenvolupador: ";
        pDev.appendChild(strongDev);
        const nomDev = joc.desenvolupador.nom || "Desconegut";
        const paisDev = joc.desenvolupador.pais ? ` (${joc.desenvolupador.pais})` : "";
        pDev.appendChild(document.createTextNode(`${nomDev}${paisDev}`));
        targeta.appendChild(pDev);
    }

    if (joc.any !== undefined || joc.dataSortida) {
        const pAny = document.createElement("p");
        const strongAny = document.createElement("strong");
        strongAny.textContent = "Any / Data: ";
        pAny.appendChild(strongAny);
        pAny.appendChild(document.createTextNode(String(joc.any || joc.dataSortida)));
        targeta.appendChild(pAny);
    }

    if (Array.isArray(joc.generes)) {
        const pGeneres = document.createElement("p");
        const strongGeneres = document.createElement("strong");
        strongGeneres.textContent = "Gèneres: ";
        pGeneres.appendChild(strongGeneres);
        pGeneres.appendChild(document.createTextNode(joc.generes.join(", ")));
        targeta.appendChild(pGeneres);
    }

    if (joc.preu !== undefined) {
        const pPreu = document.createElement("p");
        pPreu.classList.add("preu");
        const strongPreu = document.createElement("strong");
        strongPreu.textContent = "Preu: ";
        pPreu.appendChild(strongPreu);
        pPreu.appendChild(document.createTextNode(`${Number(joc.preu).toFixed(2)} €`));
        targeta.appendChild(pPreu);
    }

    if (Array.isArray(joc.opinions)) {
        const pMitjana = document.createElement("p");
        const strongMitjana = document.createElement("strong");
        strongMitjana.textContent = "Nota mitjana: ";
        pMitjana.appendChild(strongMitjana);
        pMitjana.appendChild(document.createTextNode(`${calculaNotaMitjana(joc.opinions)} / 10`));
        targeta.appendChild(pMitjana);
    } else if (joc.valoracio !== undefined) {
        const pVal = document.createElement("p");
        const strongVal = document.createElement("strong");
        strongVal.textContent = "Valoració: ";
        pVal.appendChild(strongVal);
        pVal.appendChild(document.createTextNode(String(joc.valoracio)));
        targeta.appendChild(pVal);
    }

    if (!esDisponible) {
        const pEsgotat = document.createElement("p");
        pEsgotat.classList.add("missatge-error");
        pEsgotat.textContent = "Esgotat";
        targeta.appendChild(pEsgotat);
    }

    return targeta;
}

function pintaLlistaJocs(llista, textComptador) {
    contenidor.replaceChildren();
    comptador.textContent = textComptador;
    llista.forEach((joc) => {
        contenidor.appendChild(creaTargetaJoc(joc));
    });
}

async function carregaJocs() {
    netejaMissatges();
    try {
        const resposta = await fetch(`${API}/jocs.json`);
        if (!resposta.ok) {
            throw new Error(`Error ${resposta.status}`);
        }
        const dades = await resposta.json();
        if (!dades || !Array.isArray(dades.jocs)) {
            throw new Error("Format de catàleg no vàlid");
        }
        const totalJocs = typeof dades.total === "number" ? dades.total : dades.jocs.length;
        pintaLlistaJocs(dades.jocs, `Mostrant ${totalJocs} jocs`);
    } catch (error) {
        contenidor.replaceChildren();
        comptador.textContent = "Mostrant 0 jocs";
        mostraMissatgeDOM(`No s'ha pogut carregar l'API: ${error.message}`);
    }
}

async function cercaJocPerCodi() {
    const codi = inputCodi.value.trim();
    if (codi === "") {
        mostraMissatgeDOM("Introdueix un codi de joc (per exemple, JOC-001).");
        return;
    }

    netejaMissatges();
    try {
        const resposta = await fetch(`${API}/jocs/${codi}.json`);
        if (!resposta.ok) {
            contenidor.replaceChildren();
            comptador.textContent = "Mostrant 0 jocs";
            mostraMissatgeDOM("Aquest joc no existeix");
            return;
        }
        const dades = await resposta.json();
        const joc = dades.joc ? dades.joc : dades;
        pintaLlistaJocs([joc], "Mostrant 1 joc");
    } catch (error) {
        contenidor.replaceChildren();
        comptador.textContent = "Mostrant 0 jocs";
        mostraMissatgeDOM(`No s'ha pogut consultar l'API: ${error.message}`);
    }
}

function carregaFitxerJSON() {
    const fitxer = inputFitxer.files[0];
    if (!fitxer) {
        return;
    }

    netejaMissatges();
    const lector = new FileReader();

    lector.addEventListener("load", () => {
        try {
            const dades = JSON.parse(lector.result);

            if (!dades || typeof dades !== "object") {
                throw new Error("El fitxer no conté un JSON vàlid.");
            }

            if (Array.isArray(dades.jocs)) {
                pintaLlistaJocs(dades.jocs, `Mostrant ${dades.jocs.length} jocs (fitxer adjuntat)`);
            } else if (dades.botiga && Array.isArray(dades.botiga.jocs)) {
                pintaLlistaJocs(dades.botiga.jocs, `Mostrant ${dades.botiga.jocs.length} jocs (fitxer adjuntat)`);
            } else if (Array.isArray(dades)) {
                pintaLlistaJocs(dades, `Mostrant ${dades.length} jocs (fitxer adjuntat)`);
            } else {
                throw new Error("L'estructura del JSON no coincideix amb un llistat de jocs esperat.");
            }
        } catch (error) {
            contenidor.replaceChildren();
            comptador.textContent = "Mostrant 0 jocs";
            mostraMissatgeDOM(`No s'ha pogut carregar el fitxer JSON: ${error.message}`);
        }
    });

    lector.addEventListener("error", () => {
        contenidor.replaceChildren();
        comptador.textContent = "Mostrant 0 jocs";
        mostraMissatgeDOM("S'ha produït un error en llegir el fitxer.");
    });

    lector.readAsText(fitxer);
}

botoCerca.addEventListener("click", cercaJocPerCodi);
inputFitxer.addEventListener("change", carregaFitxerJSON);

carregaJocs();
