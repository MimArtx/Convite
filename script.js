/* ==========================================================
   RSVP CASAMENTO
   Lucas & Yasmim
   script.js
========================================================== */

/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz2vB8zcdOs5pt3Hn8V8MTRR7m3DTgXpMOSX4zqmxy20j1MffmoEEW_sEgIaO5cEH4Nwg/exec";

/* ==========================================================
   DATA DO CASAMENTO
   (Mês começa em 0)
========================================================== */

const DATA_CASAMENTO = new Date(
    2026,
    10,
    7,
    16,
    30,
    0
);

/* ==========================================================
   ELEMENTOS
========================================================== */

const cover = document.getElementById("cover");
const site = document.getElementById("site");
const btnAbrir = document.getElementById("btnAbrir");

const dias = document.getElementById("dias");
const horas = document.getElementById("horas");
const minutos = document.getElementById("minutos");
const segundos = document.getElementById("segundos");

const btnTopo = document.getElementById("btnTopo");

const btnMusica = document.getElementById("btnMusica");
const musica = document.getElementById("musica");

const copiarPix = document.getElementById("copiarPix");
const pix = document.getElementById("pix");
const pixMensagem = document.getElementById("pixMensagem");

const loading = document.getElementById("loading");

const modal = document.getElementById("modalSucesso");
const fecharModal = document.getElementById("fecharModal");

/* ==========================================================
   RSVP
========================================================== */

const representante =
    document.getElementById("representante");

const btnBuscar =
    document.getElementById("btnBuscar");

const resultado =
    document.getElementById("resultado");

const nomeConvite =
    document.getElementById("nomeConvite");

const descricaoConvite =
    document.getElementById("descricaoConvite");

const tipoConvite =
    document.getElementById("tipoConvite");

const listaConvidados =
    document.getElementById("listaConvidados");

const totalSelecionados =
    document.getElementById("totalSelecionados");

const mensagem =
    document.getElementById("mensagem");

const btnConfirmar =
    document.getElementById("btnConfirmar");

/* ==========================================================
   VARIÁVEIS
========================================================== */

let conviteAtual = "";
let pessoas = [];
let confirmados = [];
let musicaLigada = false;

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

window.addEventListener("load", iniciarSistema);

function iniciarSistema() {

    iniciarContador();

    configurarEventos();

    restaurarRepresentante();

}

/* ==========================================================
   EVENTOS
========================================================== */

function configurarEventos() {

    btnAbrir?.addEventListener(
        "click",
        abrirConvite
    );

    copiarPix?.addEventListener(
        "click",
        copiarChavePix
    );

    btnBuscar?.addEventListener(
        "click",
        buscarConvite
    );

    btnConfirmar?.addEventListener(
        "click",
        confirmarPresenca
    );

    fecharModal?.addEventListener(
        "click",
        fecharModalSucesso
    );

    btnTopo?.addEventListener(
        "click",
        voltarAoTopo
    );

    btnMusica?.addEventListener(
        "click",
        alternarMusica
    );

    representante?.addEventListener(
        "keydown",
        function(e){

            if(e.key==="Enter"){

                e.preventDefault();

                buscarConvite();

            }

        }

    );

    window.addEventListener(
        "scroll",
        controlarBotaoTopo
    );

}

/* ==========================================================
   COVER
========================================================== */

function abrirConvite(){

    cover.style.opacity = "0";

    setTimeout(()=>{

        cover.style.display="none";

        site.style.display="block";

        site.classList.add("fade");

    },700);

}

/* ==========================================================
   CONTADOR
========================================================== */

function iniciarContador(){

    atualizarContador();

    setInterval(

        atualizarContador,

        1000

    );

}

function atualizarContador(){

    const agora = new Date();

    const distancia =
        DATA_CASAMENTO - agora;

    if(distancia <= 0){

        dias.textContent="0";
        horas.textContent="00";
        minutos.textContent="00";
        segundos.textContent="00";

        return;

    }

    dias.textContent = Math.floor(

        distancia /

        (1000*60*60*24)

    );

    horas.textContent = String(

        Math.floor(

            (distancia %

            (1000*60*60*24))

            /(1000*60*60)

        )

    ).padStart(2,"0");

    minutos.textContent = String(

        Math.floor(

            (distancia %

            (1000*60*60))

            /(1000*60)

        )

    ).padStart(2,"0");

    segundos.textContent = String(

        Math.floor(

            (distancia %

            (1000*60))

            /1000

        )

    ).padStart(2,"0");

}

/* ==========================================================
   LOADING
========================================================== */

function abrirLoading(){

    loading.style.display="flex";

}

function fecharLoading(){

    loading.style.display="none";

}

/* ==========================================================
   MODAL
========================================================== */

function abrirModal(){

    modal.style.display="flex";

}

function fecharModalSucesso(){

    modal.style.display="none";

}

/* ==========================================================
   MENSAGENS
========================================================== */

function mostrarMensagem(texto,tipo){

    mensagem.className="mensagem";

    mensagem.classList.add(tipo);

    mensagem.innerHTML=texto;

    mensagem.style.display="block";

}

function limparMensagem(){

    mensagem.style.display="none";

    mensagem.innerHTML="";

}

/* ==========================================================
   CONTINUA...
========================================================== */
/* ==========================================================
   BUSCAR CONVITE
========================================================== */

async function buscarConvite(){

    limparMensagem();

    resultado.style.display = "none";

    listaConvidados.innerHTML = "";

    totalSelecionados.textContent = "0";

    conviteAtual = "";

    pessoas = [];

    confirmados = [];

    const nome = representante.value.trim();

    if(nome.length < 3){

        mostrarMensagem(
            "Digite o nome do representante.",
            "erro"
        );

        return;

    }

    abrirLoading();

    try{

        const resposta = await fetch(

            `${SCRIPT_URL}?representante=${encodeURIComponent(nome)}`

        );

        const dados = await resposta.json();

        fecharLoading();

        if(dados.status !== "ok"){

            mostrarMensagem(

                dados.mensagem,

                "erro"

            );

            return;

        }

        conviteAtual = dados.convite;

        pessoas = dados.pessoas || [];

        nomeConvite.textContent = dados.convite;

        descricaoConvite.textContent =
            "Selecione quem irá comparecer.";

        tipoConvite.textContent =
            dados.statusConvite || "Pendente";

        resultado.style.display = "block";

        criarLista();

        salvarRepresentante();

    }

    catch(erro){

        fecharLoading();

        console.error(erro);

        mostrarMensagem(

            "Erro ao conectar com o servidor.",

            "erro"

        );

    }

}

/* ==========================================================
   CRIAR LISTA
========================================================== */

function criarLista(){

    listaConvidados.innerHTML = "";

    pessoas.forEach(function(nome){

        const item =
            document.createElement("div");

        item.className = "convidado";

        const label =
            document.createElement("label");

        const check =
            document.createElement("input");

        check.type = "checkbox";

        check.value = nome;

        const span =
            document.createElement("span");

        span.textContent = nome;

        label.appendChild(check);

        label.appendChild(span);

        item.appendChild(label);

        listaConvidados.appendChild(item);

        check.addEventListener(

            "change",

            atualizarSelecionados

        );

    });

}

/* ==========================================================
   CONTAR SELECIONADOS
========================================================== */

function atualizarSelecionados(){

    confirmados = [];

    const checks =

        listaConvidados.querySelectorAll(

            "input[type=checkbox]"

        );

    checks.forEach(function(check){

        if(check.checked){

            confirmados.push(

                check.value

            );

        }

    });

    totalSelecionados.textContent =

        confirmados.length;

}

/* ==========================================================
   SALVAR REPRESENTANTE
========================================================== */

function salvarRepresentante(){

    localStorage.setItem(

        "representante",

        representante.value.trim()

    );

}

/* ==========================================================
   RESTAURAR REPRESENTANTE
========================================================== */

function restaurarRepresentante(){

    const ultimo =

        localStorage.getItem(

            "representante"

        );

    if(ultimo){

        representante.value = ultimo;

    }

}
/* ==========================================================
   CONFIRMAR PRESENÇA
========================================================== */

async function confirmarPresenca() {

    limparMensagem();

    if (!conviteAtual) {

        mostrarMensagem(
            "Busque um convite primeiro.",
            "erro"
        );

        return;

    }

    if (confirmados.length === 0) {

        mostrarMensagem(
            "Selecione pelo menos uma pessoa.",
            "erro"
        );

        return;

    }

    abrirLoading();

    try {

        const parametros = new URLSearchParams();

        parametros.append(
            "convite",
            conviteAtual
        );

        parametros.append(
            "representante",
            representante.value.trim()
        );

        parametros.append(
            "presentes",
            confirmados.join(",")
        );

        const resposta = await fetch(

            SCRIPT_URL,

            {

                method: "POST",

                body: parametros

            }

        );

        const retorno = await resposta.json();

        fecharLoading();

        if (retorno.status === "ok") {

            abrirModal();

            bloquearFormulario();

            localStorage.removeItem(
                "representante"
            );

            return;

        }

        mostrarMensagem(

            retorno.mensagem ||

            "Não foi possível confirmar.",

            "erro"

        );

    }

    catch (erro) {

        fecharLoading();

        console.error(erro);

        mostrarMensagem(

            "Erro ao conectar com o servidor.",

            "erro"

        );

    }

}

/* ==========================================================
   BLOQUEAR FORMULÁRIO
========================================================== */

function bloquearFormulario() {

    btnBuscar.disabled = true;

    btnConfirmar.disabled = true;

    representante.disabled = true;

    const checks =

        listaConvidados.querySelectorAll(

            "input[type=checkbox]"

        );

    checks.forEach(function (check) {

        check.disabled = true;

    });

}

/* ==========================================================
   DESBLOQUEAR FORMULÁRIO
========================================================== */

function desbloquearFormulario() {

    btnBuscar.disabled = false;

    btnConfirmar.disabled = false;

    representante.disabled = false;

    const checks =

        listaConvidados.querySelectorAll(

            "input[type=checkbox]"

        );

    checks.forEach(function (check) {

        check.disabled = false;

    });

}

/* ==========================================================
   LIMPAR FORMULÁRIO
========================================================== */

function limparFormulario() {

    conviteAtual = "";

    pessoas = [];

    confirmados = [];

    representante.value = "";

    listaConvidados.innerHTML = "";

    totalSelecionados.textContent = "0";

    resultado.style.display = "none";

}

/* ==========================================================
   FECHAR MODAL
========================================================== */

window.addEventListener("click", function (e) {

    if (e.target === modal) {

        fecharModalSucesso();

    }

});
/* ==========================================================
   COPIAR CHAVE PIX
========================================================== */

async function copiarChavePix() {

    if (!pix) return;

    try {

        await navigator.clipboard.writeText(

            pix.textContent.trim()

        );

        pixMensagem.textContent =
            "💙 Chave PIX copiada!";

        setTimeout(() => {

            pixMensagem.textContent = "";

        }, 3000);

    }

    catch (erro) {

        alert("Não foi possível copiar a chave PIX.");

    }

}

/* ==========================================================
   BOTÃO MÚSICA
========================================================== */

function alternarMusica() {

    if (!musica) return;

    if (musicaLigada) {

        musica.pause();

        btnMusica.textContent = "🎵";

        musicaLigada = false;

    } else {

        musica.play();

        btnMusica.textContent = "🔊";

        musicaLigada = true;

    }

}

/* ==========================================================
   BOTÃO TOPO
========================================================== */

function controlarBotaoTopo() {

    if (!btnTopo) return;

    if (window.scrollY > 400) {

        btnTopo.classList.add("show");

    } else {

        btnTopo.classList.remove("show");

    }

}

function voltarAoTopo() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* ==========================================================
   CONEXÃO
========================================================== */

window.addEventListener(

    "offline",

    () => {

        mostrarMensagem(

            "Você está sem conexão com a internet.",

            "erro"

        );

    }

);

window.addEventListener(

    "online",

    () => {

        mostrarMensagem(

            "Conexão restaurada.",

            "sucesso"

        );

        setTimeout(

            limparMensagem,

            2500

        );

    }

);

/* ==========================================================
   UTILITÁRIOS
========================================================== */

function bloquearBotoes() {

    btnBuscar.disabled = true;

    btnConfirmar.disabled = true;

}

function liberarBotoes() {

    btnBuscar.disabled = false;

    btnConfirmar.disabled = false;

}

function limparStorage() {

    localStorage.removeItem(

        "representante"

    );

}

function resetarSistema() {

    limparFormulario();

    desbloquearFormulario();

    limparMensagem();

    liberarBotoes();

}

/* ==========================================================
   ANIMAÇÃO DOS CONVIDADOS
========================================================== */

function animarLista() {

    const itens =

        document.querySelectorAll(

            ".convidado"

        );

    itens.forEach(

        (item, index) => {

            item.style.opacity = "0";

            item.style.transform =
                "translateY(20px)";

            setTimeout(() => {

                item.style.transition =
                    ".35s";

                item.style.opacity = "1";

                item.style.transform =
                    "translateY(0)";

            }, index * 80);

        }

    );

}

/* ==========================================================
   OBSERVADOR DA LISTA
========================================================== */

const observer = new MutationObserver(

    () => {

        if (

            listaConvidados &&

            listaConvidados.children.length > 0

        ) {

            animarLista();

        }

    }

);

if (listaConvidados) {

    observer.observe(

        listaConvidados,

        {

            childList: true

        }

    );

}

/* ==========================================================
   LOG
========================================================== */

console.log(

    "%cSistema RSVP carregado com sucesso 💙",

    "color:#8EAFC5;font-size:15px;font-weight:bold;"

);

/* ==========================================================
   FIM DO ARQUIVO
========================================================== */
