/* ==========================================================
   RSVP CASAMENTO
   Lucas & Yasmim
   Versão 2.0
========================================================== */

/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

const SCRIPT_URL =
 "https://script.google.com/macros/s/AKfycbwifHgAo9Tf17Sdjy3DmXNFDHxeQ2wm_XcBt4F1satFnmfpf84zyV3k-AG26G7PXMXtsw/exec"

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
   ESTADO DA APLICAÇÃO
========================================================== */

const app = {

  convite: "",

  pessoas: [],

  confirmados: []

};

/* ==========================================================
   ELEMENTOS
========================================================== */

// Tela inicial
const cover = document.getElementById("cover");
const site = document.getElementById("site");
const btnAbrir = document.getElementById("btnAbrir");

// Contador
const dias = document.getElementById("dias");
const horas = document.getElementById("horas");
const minutos = document.getElementById("minutos");
const segundos = document.getElementById("segundos");

// RSVP
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

// Loading
const loading =
document.getElementById("loading");

// Modal
const modal =
document.getElementById("modalSucesso");

const fecharModal =
document.getElementById("fecharModal");

// PIX
const pix =
document.getElementById("pix");

const copiarPix =
document.getElementById("copiarPix");

const pixMensagem =
document.getElementById("pixMensagem");

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(

  "DOMContentLoaded",

  iniciarSistema

);

function iniciarSistema(){

  iniciarEventos();

  iniciarContador();

}

/* ==========================================================
   EVENTOS
========================================================== */

function iniciarEventos(){

  btnAbrir.addEventListener(

    "click",

    abrirConvite

  );

  btnBuscar.addEventListener(

    "click",

    buscarConvite

  );

  btnConfirmar.addEventListener(

    "click",

    confirmarPresenca

  );

  representante.addEventListener(

    "keydown",

    function(e){

      if(e.key==="Enter"){

        e.preventDefault();

        buscarConvite();

      }

    }

  );

  copiarPix.addEventListener(

    "click",

    copiarChavePix

  );

  fecharModal.addEventListener(

    "click",

    fecharModalSucesso

  );

}

/* ==========================================================
   ABRIR CONVITE
========================================================== */

function abrirConvite(){

  cover.style.opacity = "0";

  setTimeout(()=>{

    cover.style.display="none";

    site.style.display="block";

    site.style.animation="fadeUp .8s";

  },800);

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

  if(distancia<=0){

    dias.textContent="0";
    horas.textContent="00";
    minutos.textContent="00";
    segundos.textContent="00";

    return;

  }

  const d =
  Math.floor(
    distancia /
    (1000*60*60*24)
  );

  const h =
  Math.floor(
    (distancia %
    (1000*60*60*24))
    /
    (1000*60*60)
  );

  const m =
  Math.floor(
    (distancia %
    (1000*60*60))
    /
    (1000*60)
  );

  const s =
  Math.floor(
    (distancia %
    (1000*60))
    /
    1000
  );

  dias.textContent = d;

  horas.textContent =
  String(h).padStart(2,"0");

  minutos.textContent =
  String(m).padStart(2,"0");

  segundos.textContent =
  String(s).padStart(2,"0");

}
/* ==========================================================
   LOADING
========================================================== */

function abrirLoading() {

  loading.style.display = "flex";

}

function fecharLoading() {

  loading.style.display = "none";

}

/* ==========================================================
   MENSAGENS
========================================================== */

function mostrarMensagem(texto, tipo = "erro") {

  mensagem.style.display = "block";

  mensagem.className = "mensagem";

  mensagem.classList.add(tipo);

  mensagem.innerHTML = texto;

}

function limparMensagem() {

  mensagem.style.display = "none";

  mensagem.className = "mensagem";

  mensagem.innerHTML = "";

}

/* ==========================================================
   MODAL
========================================================== */

function abrirModal() {

  modal.style.display = "flex";

}

function fecharModalSucesso() {

  modal.style.display = "none";

}

/* ==========================================================
   BUSCAR CONVITE
========================================================== */

async function buscarConvite() {

  limparMensagem();

  resultado.style.display = "none";

  listaConvidados.innerHTML = "";

  totalSelecionados.textContent = "0";

  app.confirmados = [];

  const nome = representante.value.trim();

  if (!nome) {

    mostrarMensagem(
      "Digite o nome do representante."
    );

    return;

  }

  abrirLoading();

  try {

    const resposta = await fetch(

      `${SCRIPT_URL}?representante=${encodeURIComponent(nome)}`

    );

    const dados = await resposta.json();

    fecharLoading();

    processarConvite(dados);

  }

  catch (erro) {

    fecharLoading();

    console.error(erro);

    mostrarMensagem(

      "Não foi possível conectar ao servidor."

    );

  }

}

/* ==========================================================
   PROCESSAR RESPOSTA
========================================================== */

function processarConvite(dados) {

  if (!dados) {

    mostrarMensagem(

      "Resposta inválida."

    );

    return;

  }

  if (dados.status === "erro") {

    mostrarMensagem(

      dados.mensagem

    );

    return;

  }

  if (dados.status === "confirmado") {

    mostrarMensagem(

      dados.mensagem,

      "aviso"

    );

    return;

  }

  app.convite = dados.convite;

  app.pessoas = dados.pessoas || [];

  app.confirmados = [];

  resultado.style.display = "block";

  nomeConvite.textContent = dados.convite;

  descricaoConvite.textContent =
    "Selecione quem irá comparecer.";

  tipoConvite.textContent =
    dados.tipo || "Família";

  criarListaConvidados();

}

/* ==========================================================
   LISTA DE CONVIDADOS
========================================================== */

function criarListaConvidados() {

  listaConvidados.innerHTML = "";

  app.pessoas.forEach((nome) => {

    const item = document.createElement("div");

    item.className = "convidado";

    const label = document.createElement("label");

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.value = nome;

    checkbox.addEventListener(

      "change",

      atualizarSelecionados

    );

    const span = document.createElement("span");

    span.textContent = nome;

    label.appendChild(checkbox);

    label.appendChild(span);

    item.appendChild(label);

    listaConvidados.appendChild(item);

  });

}

/* ==========================================================
   CONTADOR DE SELECIONADOS
========================================================== */

function atualizarSelecionados() {

  app.confirmados = [];

  const checkboxes =

    listaConvidados.querySelectorAll(

      "input[type='checkbox']"

    );

  checkboxes.forEach((checkbox) => {

    if (checkbox.checked) {

      app.confirmados.push(

        checkbox.value

      );

    }

  });

  totalSelecionados.textContent =

    app.confirmados.length;

}
/* ==========================================================
   CONFIRMAR PRESENÇA
========================================================== */

async function confirmarPresenca() {

  limparMensagem();

  if (app.confirmados.length === 0) {

    mostrarMensagem(
      "Selecione pelo menos uma pessoa."
    );

    return;

  }

  abrirLoading();

  btnConfirmar.disabled = true;

  try {

    const resposta = await fetch(

      SCRIPT_URL,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          convite: app.convite,

          presentes: app.confirmados

        })

      }

    );

   console.log("Status HTTP:", resposta.status);

const texto = await resposta.text();

console.log("Resposta do servidor:", texto);

const retorno = JSON.parse(texto);

    fecharLoading();

    if (retorno.status === "ok") {

      abrirModal();

      bloquearFormulario();

      salvarRepresentante();

      return;

    }

    btnConfirmar.disabled = false;

    mostrarMensagem(

      retorno.mensagem ||

      "Não foi possível confirmar."

    );

  }

  catch (erro) {

    fecharLoading();

    btnConfirmar.disabled = false;

    console.error(erro);

    mostrarMensagem(

      "Erro ao confirmar presença."

    );

  }

}

/* ==========================================================
   BLOQUEAR FORMULÁRIO
========================================================== */

function bloquearFormulario() {

  btnConfirmar.disabled = true;

  btnBuscar.disabled = true;

  representante.disabled = true;

  listaConvidados

    .querySelectorAll("input")

    .forEach(item => {

      item.disabled = true;

    });

}

/* ==========================================================
   LOCAL STORAGE
========================================================== */

function salvarRepresentante() {

  localStorage.setItem(

    "representante",

    representante.value.trim()

  );

}

function restaurarRepresentante() {

  const ultimo =

    localStorage.getItem(

      "representante"

    );

  if (ultimo) {

    representante.value = ultimo;

  }

}

window.addEventListener(

  "load",

  restaurarRepresentante

);

/* ==========================================================
   PIX
========================================================== */

async function copiarChavePix() {

  try {

    await navigator.clipboard.writeText(

      pix.innerText

    );

    pixMensagem.innerHTML =

      "💙 Chave PIX copiada!";

    setTimeout(() => {

      pixMensagem.innerHTML = "";

    },3000);

  }

  catch {

    alert(

      "Não foi possível copiar."

    );

  }

}

/* ==========================================================
   LIMPAR FORMULÁRIO
========================================================== */

function limparFormulario() {

  resultado.style.display = "none";

  listaConvidados.innerHTML = "";

  totalSelecionados.textContent = "0";

  app.convite = "";

  app.pessoas = [];

  app.confirmados = [];

}

/* ==========================================================
   RESETAR BOTÃO
========================================================== */

function desbloquearFormulario(){

  representante.disabled = false;

  btnBuscar.disabled = false;

  btnConfirmar.disabled = false;

}
/* ==========================================================
   ANIMAÇÃO DA LISTA
========================================================== */

function animarLista() {

  const itens =

    listaConvidados.querySelectorAll(

      ".convidado"

    );

  itens.forEach((item, index) => {

    item.style.opacity = "0";

    item.style.transform = "translateY(20px)";

    setTimeout(() => {

      item.style.transition =
        "all .4s ease";

      item.style.opacity = "1";

      item.style.transform =
        "translateY(0)";

    }, index * 80);

  });

}

const observer = new MutationObserver(() => {

  if (listaConvidados.children.length > 0) {

    animarLista();

  }

});

observer.observe(

  listaConvidados,

  {

    childList: true

  }

);

/* ==========================================================
   CONEXÃO
========================================================== */

window.addEventListener(

  "offline",

  () => {

    mostrarMensagem(

      "Você está sem conexão com a internet."

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

      3000

    );

  }

);

/* ==========================================================
   MENSAGEM TEMPORÁRIA
========================================================== */

function mensagemTemporaria(

  texto,

  tipo = "sucesso",

  tempo = 3000

) {

  mostrarMensagem(

    texto,

    tipo

  );

  setTimeout(

    limparMensagem,

    tempo

  );

}

/* ==========================================================
   UTILITÁRIOS
========================================================== */

function habilitarBotao(botao) {

  if (botao) {

    botao.disabled = false;

  }

}

function desabilitarBotao(botao) {

  if (botao) {

    botao.disabled = true;

  }

}

function formatarQuantidade(valor) {

  return Number(valor) || 0;

}

/* ==========================================================
   DEBUG
========================================================== */

function debug(...dados) {

  console.log(

    "[RSVP]",

    ...dados

  );

}

/* ==========================================================
   LOGS
========================================================== */

debug("Sistema iniciado.");

debug("Script carregado com sucesso.");

/* ==========================================================
   TRATAMENTO GLOBAL DE ERROS
========================================================== */

window.addEventListener(

  "error",

  function(e){

    console.error(

      "Erro:",

      e.error

    );

  }

);

window.addEventListener(

  "unhandledrejection",

  function(e){

    console.error(

      "Promise:",

      e.reason

    );

  }

);

/* ==========================================================
   FIM
========================================================== */

console.log(

  "%cRSVP Casamento carregado com sucesso 💙",

  "color:#91AFC8;font-size:16px;font-weight:bold;"

);
