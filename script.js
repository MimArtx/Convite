// =====================================================
// CONFIGURAÇÕES
// =====================================================

const SCRIPT_URL = "COLE_AQUI_O_LINK_DO_SEU_APPS_SCRIPT";

// =====================================================
// ELEMENTOS
// =====================================================

const cover = document.getElementById("cover");
const site = document.getElementById("site");

const btnAbrir = document.getElementById("btnAbrir");
const btnBuscar = document.getElementById("btnBuscar");
const btnConfirmar = document.getElementById("btnConfirmar");

const representante = document.getElementById("representante");
const resultado = document.getElementById("resultado");
const nomeConvite = document.getElementById("nomeConvite");
const listaConvidados = document.getElementById("listaConvidados");
const totalSelecionados = document.getElementById("totalSelecionados");
const mensagem = document.getElementById("mensagem");

// =====================================================
// ABRIR CONVITE
// =====================================================

btnAbrir.addEventListener("click", () => {

    cover.style.opacity = "0";

    setTimeout(() => {

        cover.style.display = "none";
        site.style.display = "block";
        site.classList.add("fade");

    }, 700);

});

// =====================================================
// CONTADOR
// =====================================================

const contador = document.getElementById("contador");

const dataCasamento = new Date(2026,10,7,16,30);

function atualizarContador(){

    const agora = new Date();

    const diferenca = dataCasamento - agora;

    if(diferenca <= 0){

        contador.innerHTML = "Chegou o grande dia! 🤍";
        return;

    }

    const dias = Math.floor(diferenca / 86400000);

    const horas = Math.floor((diferenca % 86400000)/3600000);

    const minutos = Math.floor((diferenca % 3600000)/60000);

    const segundos = Math.floor((diferenca % 60000)/1000);

    contador.innerHTML =
    `${dias} dias • ${horas}h ${minutos}m ${segundos}s`;

}

setInterval(atualizarContador,1000);

atualizarContador();

// =====================================================
// BUSCAR CONVITE
// =====================================================

btnBuscar.addEventListener("click", buscarConvite);

async function buscarConvite(){

    const nome = representante.value.trim();

    if(nome===""){

        mostrarMensagem("Digite o nome do representante.","erro");

        return;

    }

    resultado.style.display="none";

    mostrarMensagem("Buscando convite...","aviso");

    try{

        const resposta = await fetch(SCRIPT_URL,{

            method:"POST",

            body:new URLSearchParams({

                acao:"buscar",

                representante:nome

            })

        });

        const dados = await resposta.json();

        if(dados.status==="ok"){

            preencherConvite(dados);

            mensagem.style.display="none";

        }

        else{

            mostrarMensagem(dados.mensagem,"erro");

        }

    }

    catch{

        mostrarMensagem("Erro ao conectar com o servidor.","erro");

    }

}

// =====================================================
// PREENCHER CONVIDADOS
// =====================================================

function preencherConvite(dados){

    resultado.style.display="block";

    nomeConvite.innerHTML=dados.convite;

    listaConvidados.innerHTML="";

    dados.pessoas.forEach(nome=>{

        listaConvidados.innerHTML += `

        <div class="convidado">

            <label>

                <input
                    type="checkbox"
                    checked
                    value="${nome}"
                    class="checkPessoa">

                ${nome}

            </label>

        </div>

        `;

    });

    atualizarTotal();

    document.querySelectorAll(".checkPessoa")

    .forEach(item=>{

        item.addEventListener("change",atualizarTotal);

    });

}

// =====================================================
// CONTADOR DE PESSOAS
// =====================================================

function atualizarTotal(){

    const marcados=document.querySelectorAll(".checkPessoa:checked");

    totalSelecionados.innerHTML=marcados.length;

}

// =====================================================
// CONFIRMAR PRESENÇA
// =====================================================

btnConfirmar.addEventListener("click",confirmarPresenca);

async function confirmarPresenca(){

    const pessoas=[];

    document

    .querySelectorAll(".checkPessoa:checked")

    .forEach(item=>{

        pessoas.push(item.value);

    });

    if(pessoas.length===0){

        mostrarMensagem(

            "Selecione pelo menos uma pessoa.",

            "erro"

        );

        return;

    }

    try{

        const resposta=await fetch(SCRIPT_URL,{

            method:"POST",

            body:new URLSearchParams({

                acao:"confirmar",

                representante:representante.value,

                pessoas:JSON.stringify(pessoas)

            })

        });

        const dados=await resposta.json();

        if(dados.status==="ok"){

            mostrarMensagem(

                "Presença confirmada com sucesso! 💙",

                "sucesso"

            );

            btnConfirmar.disabled=true;

        }

        else{

            mostrarMensagem(dados.mensagem,"erro");

        }

    }

    catch{

        mostrarMensagem("Erro ao enviar.","erro");

    }

}

// =====================================================
// MENSAGENS
// =====================================================

function mostrarMensagem(texto,tipo){

    mensagem.style.display="block";

    mensagem.className="";

    mensagem.classList.add(tipo);

    mensagem.innerHTML=texto;

}
