const API = "https://lluisbelmonte-rgb.github.io/botiga-api/api";

const contenidor = document.querySelector("#jocs");
const comptador = document.querySelector("#comptador-resultats");
const missatgesEstat = document.querySelector("#missatges-estat");
const inputCodi = document.querySelector("#cerca-codi");
const botoCerca = document.querySelector("#boto-cerca");

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
    const suma = opinions.reduce((acumulador, opinio) => acumulador + opinio.nota, 0);
    return (suma / opinions.length).toFixed(1);
}

function creaTargetaJoc(joc) {
    const targeta = document.createElement("article");
    targeta.classList.add("joc");

    if (joc.disponible === false) {
        targeta.classList.add("esgotat");
    }

    const titol = document.createElement("h3");
    titol.textContent = joc.titol;
    targeta.appendChild(titol);

    const pDev = document.createElement("p");
    const strongDev = document.createElement("strong");
    strongDev.textContent = "Desenvolupador: ";
    pDev.appendChild(strongDev);
    pDev.appendChild(
        document.createTextNode(`${joc.desenvolupador.nom} (${joc.desenvolupador.pais})`)
    );
    targeta.appendChild(pDev);

    const pAny = document.createElement("p");
    const strongAny = document.createElement("strong");
    strongAny.textContent = "Any: ";
    pAny.appendChild(strongAny);
    pAny.appendChild(document.createTextNode(String(joc.any)));
    targeta.appendChild(pAny);

    const pGeneres = document.createElement("p");
    const strongGeneres = document.createElement("strong");
    strongGeneres.textContent = "Gèneres: ";
    pGeneres.appendChild(strongGeneres);
    pGeneres.appendChild(document.createTextNode(joc.generes.join(", ")));
    targeta.appendChild(pGeneres);

    const pPreu = document.createElement("p");
    pPreu.classList.add("preu");
    const strongPreu = document.createElement("strong");
    strongPreu.textContent = "Preu: ";
    pPreu.appendChild(strongPreu);
    pPreu.appendChild(document.createTextNode(`${Number(joc.preu).toFixed(2)} €`));
    targeta.appendChild(pPreu);

    const pMitjana = document.createElement("p");
    const strongMitjana = document.createElement("strong");
    strongMitjana.textContent = "Nota mitjana: ";
    pMitjana.appendChild(strongMitjana);
    pMitjana.appendChild(document.createTextNode(`${calculaNotaMitjana(joc.opinions)} / 10`));
    targeta.appendChild(pMitjana);

    if (joc.disponible === false) {
        const pEsgotat = document.createElement("p");
        pEsgotat.classList.add("missatge-error");
        pEsgotat.textContent = "Esgotat";
        targeta.appendChild(pEsgotat);
    }

    return targeta;
}

async function carregaJocs() {
    netejaMissatges();
    try {
        const resposta = await fetch(`${API}/jocs.json`);
        if (!resposta.ok) {
            throw new Error(`Error ${resposta.status}`);
        }
        const dades = await resposta.json();
        contenidor.replaceChildren();

        const totalJocs = typeof dades.total === "number" ? dades.total : dades.jocs.length;
        comptador.textContent = `Mostrant ${totalJocs} jocs`;

        dades.jocs.forEach((joc) => {
            contenidor.appendChild(creaTargetaJoc(joc));
        });
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
        contenidor.replaceChildren();
        comptador.textContent = "Mostrant 1 joc";
        contenidor.appendChild(creaTargetaJoc(joc));
    } catch (error) {
        contenidor.replaceChildren();
        comptador.textContent = "Mostrant 0 jocs";
        mostraMissatgeDOM(`No s'ha pogut consultar l'API: ${error.message}`);
    }
}

botoCerca.addEventListener("click", cercaJocPerCodi);

carregaJocs();