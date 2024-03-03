// function formatarData(data) {
//   const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "long" });
//   const capDiaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
//   const mes = data.toLocaleDateString("pt-BR", { month: "long" });
//   const capMes = mes.charAt(0).toUpperCase() + mes.slice(1);
//   const diaMes = data.getDate();
//   const ano = data.getFullYear();

//   return `${capDiaSemana}, ${diaMes} de ${capMes}.`;
// }

// const dataAtual = new Date();
// const dataFormatada = formatarData(dataAtual);

// const dataHTML = document.querySelector(".adicionar_data");
// dataHTML.innerHTML = dataFormatada;

const dataAtual = new Date();
const diaSemana = dataAtual.toLocaleDateString("pt-BR", { weekday: "long" });
const capDiaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
const diaMes = dataAtual.getDate();
const mes = dataAtual.toLocaleDateString("pt-BR", { month: "long" });
const capMes = mes.charAt(0).toUpperCase() + mes.slice(1);
const ano = dataAtual.getFullYear();

const dataFormatada = `${capDiaSemana}, ${diaMes} de ${capMes}.`;

const dataHTML = document.querySelector(".adicionar_data");
dataHTML.innerHTML = dataFormatada;

const adicionar_btn = document.querySelector(".adicionar_btn_img");

// --------- CARD PRÓXIMO VENCIMENTO -----
// const card_data__mes = document.querySelector(".card_data__mes");
// const card_data__diaMes = document.querySelector(".card_data__diaMes");
// const card_data__diaSemana = document.querySelector(".card_data__diaSemana");

// card_data__diaSemana.innerHTML = `${capDiaSemana}`;
// card_data__diaMes.innerHTML = `${diaMes}`;
// card_data__mes.innerHTML = `${capMes}`;

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  limparCampos();
  document.getElementById("modal").classList.remove("active");
};

const getLocalStorage = () => JSON.parse(localStorage.getItem("dbCard")) ?? [];

const setLocalStorage = (dbCard) =>
  localStorage.setItem("dbCard", JSON.stringify(dbCard));

const createCard = (card) => {
  const dbCard = getLocalStorage();
  dbCard.push(card);
  setLocalStorage(dbCard);
};

const readCard = () => getLocalStorage();

const updateCard = (index, card) => {
  const dbCard = readCard();
  dbCard[index] = card;
  setLocalStorage(dbCard);
};

const deleteCard = (index) => {
  const dbCard = readCard();
  dbCard.splice(index, 1);
  setLocalStorage(dbCard);
};

const campoValido = () => {
  return document.querySelector(".modal-form").reportValidity();
};

const limparCampos = () => {
  const campos = document.querySelectorAll(".modal-field");
  campos.forEach((campo) => (campo.value = ""));
};

const saveCard = () => {
  if (campoValido()) {
    const card = {
      posicao: document.getElementById("posicao").value,

      musica: document.getElementById("nome_musica").value,

      artista: document.getElementById("nome_artista").value,

      entrada: document.getElementById("data_entrada").value,

      vencimento: document.getElementById("data_vencimento").value,
    };
    createCard(card);
    updateTable();
    closeModal();
  }
};

const formatarData = (dataString) => {
  // Cria um objeto Date a partir da string
  const data = new Date(dataString);

  // Verifica se a conversão foi bem-sucedida e se data é uma instância válida de Date
  if (isNaN(data.getTime())) {
    throw new Error("A string fornecida não é uma data válida.");
  }

  // Obtém o dia, mês e ano da data
  const dia = ("0" + data.getDate()).slice(-2);
  const mes = ("0" + (data.getMonth() + 1)).slice(-2);
  const ano = data.getFullYear();

  // Formata a data no formato dd/mm/aa
  const dataFormatada = dia + "/" + mes + "/" + ano;

  return dataFormatada;
};


const createRow = (card, index) => {
  const entradaFormatada = formatarData(card.entrada)
  const vencimentoFormatado = formatarData(card.vencimento)

  const newRow = document.createElement("li");
  newRow.innerHTML = `
          <div class="card_info">
            <div class="card_info_status">
              <span
              class="posicao"
              id='posicao'>
              #${card.posicao}
              </span>
              <img
                src="./assets/img/editar.png"
                alt="ícone de editar"
                class="editIcon"
                id='edit-${index}'
              />
            </div>

            <h3
            class="card_servico"
            id='musica'>
            ${card.musica}
            </h3>

            <figure class="card_artista">
              <figcaption class="card_artista_legenda"
              id='artista'>
                ${card.artista}
              </figcaption>
            </figure>
          </div>

          <section class="card_data_vencimento">
            <button class="delete_container">
              <p 
              class="data__entrada"
              id='entrada'>
              Entrou em: <br> ${entradaFormatada}</p>

              <img
                src="./assets/img/bin.png"
                alt="ícone de editar"
                class="deleteIcon"
                id='delete-${index}'
              />
            </button>

            <div class="data_vencimento">
              <p 
              class="data__vencimento"
              id='vencimento'>
                Vence em: <br/>
                ${vencimentoFormatado}
              </p>
            </div>
          </section>
    `;

  newRow.classList.add("agendamentos_card");

  document.querySelector(".recomendados_cards").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll(".agendamentos_card");

  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbCard = readCard();
  clearTable();
  dbCard.forEach(createRow);
};

const fillCard = (card) => {
  document.getElementById("posicao").value = card.posicao;

  document.getElementById("musica").value = card.musica;

  document.getElementById("artista").value = card.artista;

  document.getElementById("entrada").value = card.entrada

  document.getElementById("vencimento").value = card.vencimento
};

const editCard = (index) => {
  const card = readCard()[index];
  fillCard(card);
  // console.log(card)
};

const editDelete = (event) => {
  if (event.target.className == "editIcon") {
    const [action, index] = event.target.id.split("-");

    if (action == "edit") {
      editCard(index);
    }
  } else if (event.target.className == "deleteIcon") {
    const [action, index] = event.target.id.split("-");

    if (action == "delete") {
      // deleteCard(index)
    }
  }
};

updateTable();

//Eventos
document.querySelector(".adicionar_btn").addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);
document.querySelector(".red").addEventListener("click", closeModal);

document.querySelector(".green").addEventListener("click", saveCard);

const card_li = document.querySelectorAll(".agendamentos_card");
card_li.forEach(() => {
  addEventListener("click", editDelete);
});
