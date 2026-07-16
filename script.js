/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzE9J5RB-06EtvxXFwUquNwNKhdusqzftTVRhzCQ5t4NRg8HNCBpaPXvT-XBFKbXe9ttA/exec";

/* ==========================================================
   DATA DO CASAMENTO
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

const copiarPix = document.getElementById("copiarPix");

const pix = document.getElementById("pix");

const pixMensagem = document.getElementById("pixMensagem");

const loading = document.getElementById("loading");

const modal = document.getElementById("modalSucesso");

const fecharModal = document.getElementById("fecharModal");

/* ==========================================================
   VARIÁVEIS
========================================================== */

let conviteAtual = null;

let pessoas = [];

let confirmados = [];

/* ==========================================================
   ABRIR CONVITE
========================================================== */

btnAbrir.addEventListener("click", () => {

    cover.style.transition = ".8s";

    cover.style.opacity = "0";

    setTimeout(() => {

        cover.style.display = "none";

        site.style.display = "block";

        site.style.animation = "fadeUp .8s";

        atualizarContador();

        setInterval(

            atualizarContador,

            1000

        );

    }, 800);

});

/* ==========================================================
   CONTADOR
========================================================== */

function atualizarContador(){

    const agora = new Date();

    const distancia =
        DATA_CASAMENTO - agora;

    if(distancia <= 0){

        dias.textContent="0";

        horas.textContent="0";

        minutos.textContent="0";

        segundos.textContent="0";

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
   COPIAR PIX
========================================================== */

copiarPix.addEventListener("click", async()=>{

    try{

        await navigator.clipboard.writeText(

            pix.innerText

        );

        pixMensagem.innerHTML =
        "💙 Chave PIX copiada!";

        setTimeout(()=>{

            pixMensagem.innerHTML="";

        },3000);

    }

    catch{

        alert("Não foi possível copiar.");

    }

});

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

fecharModal.addEventListener(

    "click",

    fecharModalSucesso

);

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        fecharModalSucesso();

    }

});
/* ==========================================================
   ELEMENTOS RSVP
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

const listaConvidados =
    document.getElementById("listaConvidados");

const totalSelecionados =
    document.getElementById("totalSelecionados");

const tipoConvite =
    document.getElementById("tipoConvite");

const mensagem =
    document.getElementById("mensagem");

const btnConfirmar =
    document.getElementById("btnConfirmar");


/* ==========================================================
   BUSCAR CONVITE
========================================================== */

btnBuscar.addEventListener(

    "click",

    buscarConvite

);


/* ==========================================================
   BUSCAR NO GOOGLE APPS SCRIPT
========================================================== */

async function buscarConvite(){

    mensagem.style.display="none";

    resultado.style.display="none";

    listaConvidados.innerHTML="";

    const nome = representante.value.trim();

    if(nome===""){

        mostrarMensagem(

            "Digite o nome do representante.",

            "erro"

        );

        return;

    }

    abrirLoading();

bloquearBotoes();

try{

    
const resposta = await fetch(
    `${SCRIPT_URL}?representante=${encodeURIComponent(nome)}`
);

if (!resposta.ok) {
    throw new Error("Erro ao buscar convite.");
}

const dados = await resposta.json();

fecharLoading();

processarResposta(dados);

salvarConviteLocal();
       
    }

    catch(error){

        fecharLoading();

        console.error(error);

        mostrarMensagem(

            "Erro ao conectar com o servidor.",

            "erro"

        );

    }

}


/* ==========================================================
   PROCESSAR RESPOSTA
========================================================== */

function processarResposta(dados){

    if(!dados){

        mostrarMensagem(

            "Resposta inválida.",

            "erro"

        );

        return;

    }

    if(dados.status==="erro"){

        mostrarMensagem(

            dados.mensagem ||

            "Convite não encontrado.",

            "erro"

        );

        return;

    }

    if(dados.status==="confirmado"){

        mostrarMensagem(

            "Este convite já foi confirmado.",

            "aviso"

        );

        return;

    }

    conviteAtual = dados.convite;

    pessoas = dados.pessoas || [];

    confirmados = [];

    resultado.style.display="block";

    nomeConvite.innerHTML = conviteAtual;

    descricaoConvite.innerHTML =

        "Selecione quem irá comparecer ao casamento.";

    tipoConvite.innerHTML =

        dados.tipo || "Família";

    criarListaConvidados();

}


/* ==========================================================
   MENSAGENS
========================================================== */

function mostrarMensagem(texto,tipo){

    mensagem.style.display="block";

    mensagem.className="mensagem";

    mensagem.classList.add(tipo);

    mensagem.innerHTML=texto;

}


/* ==========================================================
   LIMPAR MENSAGEM
========================================================== */

function limparMensagem(){

    mensagem.style.display="none";

    mensagem.innerHTML="";

    mensagem.className="mensagem";

}


/* ==========================================================
   ENTER NO CAMPO
========================================================== */

representante.addEventListener(

    "keypress",

    function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            buscarConvite();

        }

    }

);
/* ==========================================================
   CRIAR LISTA DE CONVIDADOS
========================================================== */

function criarListaConvidados(){

    listaConvidados.innerHTML = "";
    totalSelecionados.innerHTML = "0";

    pessoas.forEach((nome,index)=>{

        const item = document.createElement("div");
        item.className = "convidado";

        item.innerHTML = `
            <label class="linha-convidado">
                <input type="checkbox"
                       value="${nome}"
                       data-index="${index}">
                <span>${nome}</span>
            </label>
        `;

        listaConvidados.appendChild(item);

        item.querySelector("input").addEventListener(
            "change",
            atualizarQuantidade
        );
    });

}

/* ==========================================================
   ATUALIZAR QUANTIDADE
========================================================== */

function atualizarQuantidade(){

    confirmados = [];

    const checkboxes =
        listaConvidados.querySelectorAll("input");

    checkboxes.forEach((checkbox)=>{

        if(checkbox.checked){

            confirmados.push(

                checkbox.value

            );

        }

    });

    totalSelecionados.innerHTML =
        confirmados.length;

}

/* ==========================================================
   CONFIRMAR PRESENÇA
========================================================== */

btnConfirmar.addEventListener(

    "click",

    confirmarPresenca

);

/* ==========================================================
   ENVIAR AO GOOGLE APPS SCRIPT
========================================================== */

async function confirmarPresenca(){

    limparMensagem();

    if(confirmados.length===0){

        mostrarMensagem(

            "Selecione pelo menos uma pessoa.",

            "erro"

        );

        return;

    }

    abrirLoading();

    try{

     const resposta = await fetch(SCRIPT_URL, {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({

        convite: conviteAtual,

        representante: representante.value.trim(),

        presentes: confirmados

    })

});

        if (!resposta.ok) {

    throw new Error("Erro na comunicação com o servidor.");

}

const retorno = await resposta.json();
       
        fecharLoading();

        if(retorno.status === "ok"){

    limparStorage();

    abrirModal();

    btnConfirmar.disabled = true;

    btnConfirmar.innerHTML = "✔ Confirmado";

    listaConvidados
        .querySelectorAll("input")
        .forEach(input => {

            input.disabled = true;

        });

    liberarBotoes();

    return;

}

        mostrarMensagem(

            retorno.mensagem ||

            "Não foi possível confirmar.",

            "erro"

        );

    }

    catch(error){

    fecharLoading();

    liberarBotoes();

    console.error(error);

    mostrarMensagem(

        error.message ||

        "Erro ao confirmar presença.",

        "erro"

    );

}

/* ==========================================================
   DESABILITAR FORMULÁRIO
========================================================== */

function bloquearFormulario(){

    representante.disabled = true;

    btnBuscar.disabled = true;

    btnConfirmar.disabled = true;

    listaConvidados

    .querySelectorAll("input")

    .forEach(input=>{

        input.disabled = true;

    });

}

/* ==========================================================
   LIMPAR FORMULÁRIO
========================================================== */

function limparFormulario(){

    representante.value = "";

    listaConvidados.innerHTML = "";

    totalSelecionados.innerHTML = "0";

    resultado.style.display = "none";

    pessoas = [];

    confirmados = [];

}
/* ==========================================================
   SALVAR CONVITE NO NAVEGADOR
========================================================== */

function salvarConviteLocal() {

    if (!conviteAtual) return;

    localStorage.setItem("conviteAtual", conviteAtual);

    localStorage.setItem(
        "representante",
        representante.value.trim()
    );

}

/* ==========================================================
   LIMPAR DADOS LOCAIS
========================================================== */

function limparStorage() {

    localStorage.removeItem("conviteAtual");

    localStorage.removeItem("representante");

}

/* ==========================================================
   RESTAURAR ÚLTIMA PESQUISA
========================================================== */

window.addEventListener("load", () => {

    atualizarContador();

    setInterval(atualizarContador,1000);

    const ultimoRepresentante =

        localStorage.getItem("representante");

    if(ultimoRepresentante){

        representante.value = ultimoRepresentante;

    }

});

/* ==========================================================
   ANIMAÇÃO DOS CONVIDADOS
========================================================== */

function animarLista(){

    const itens =

        listaConvidados.querySelectorAll(".convidado");

    itens.forEach((item,index)=>{

        item.style.opacity="0";

        item.style.transform="translateY(20px)";

        setTimeout(()=>{

            item.style.transition=".4s";

            item.style.opacity="1";

            item.style.transform="translateY(0)";

        },index*80);

    });

}

/* ==========================================================
   OBSERVAR QUANDO A LISTA É CRIADA
========================================================== */

const observer = new MutationObserver(()=>{

    if(listaConvidados.children.length>0){

        animarLista();

    }

});

observer.observe(

    listaConvidados,

    {

        childList:true

    }

);

/* ==========================================================
   CONEXÃO
========================================================== */

window.addEventListener("offline",()=>{

    mostrarMensagem(

        "Você está sem conexão com a internet.",

        "erro"

    );

});

window.addEventListener("online",()=>{

    mostrarMensagem(

        "Conexão restaurada.",

        "sucesso"

    );

    setTimeout(

        limparMensagem,

        2500

    );

});

/* ==========================================================
   DESABILITAR BOTÕES ENQUANTO ENVIA
========================================================== */

function bloquearBotoes(){

    btnBuscar.disabled=true;

    btnConfirmar.disabled=true;

}

function liberarBotoes(){

    btnBuscar.disabled=false;

    btnConfirmar.disabled=false;

}

/* ==========================================================
   AUTO LIMPAR MENSAGENS
========================================================== */

function mensagemTemporaria(

    texto,

    tipo,

    tempo=3500

){

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
   VALIDAÇÃO
========================================================== */

function validarNome(){

    const nome =

        representante.value.trim();

    if(nome.length < 3){

        mensagemTemporaria(

            "Digite um nome válido.",

            "erro"

        );

        return false;

    }

    return true;

}

/* ==========================================================
   ENTER
========================================================== */

representante.addEventListener(

    "keydown",

    function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            if(validarNome()){

                buscarConvite();

            }

        }

    }

);


/* ==========================================================
   LIMPAR STORAGE AO CONFIRMAR
========================================================== */

const confirmarOriginal = confirmarPresenca;

confirmarPresenca = async function(){

    await confirmarOriginal();

    limparStorage();

}

/* ==========================================================
   FINAL
========================================================== */

console.log(

    "%cSistema RSVP carregado com sucesso 💙",

    "color:#91AFC8;font-size:16px;font-weight:bold;"

);
