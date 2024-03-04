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

    const index = document.getElementById("nome_musica").dataset.index;

    if (index == "new") {
      createCard(card);
      updateTable();
      closeModal();
    } else {
      updateCard(index, card);
      updateTable();
      closeModal();
    }
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
  const entradaFormatada = formatarData(card.entrada);
  const vencimentoFormatado = formatarData(card.vencimento);

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
  newRow.setAttribute("data-position", `${card.posicao}`);
  newRow.setAttribute("data-due-date", `${vencimentoFormatado}`);

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
  organizarLista();
};

const fillCard = (card) => {
  document.getElementById("posicao").value = card.posicao;

  document.getElementById("nome_musica").value = card.musica;

  document.getElementById("nome_artista").value = card.artista;

  document.getElementById("data_entrada").value = card.entrada;

  document.getElementById("data_vencimento").value = card.vencimento;

  document.getElementById("nome_musica").dataset.index = card.index;
};

const editCard = (index) => {
  const card = readCard()[index];
  card.index = index;
  fillCard(card);
  openModal();
};

const editDelete = (event) => {
  if (event.target.className == "editIcon") {
    const [action, index] = event.target.id.split("-");

    if (action == "edit") {
      editCard(index);
      organizarLista();
    }
  } else if (event.target.className == "deleteIcon") {
    const [action, index] = event.target.id.split("-");
    const card = readCard()[index];
    const response = confirm(
      `Deseja realmente excluir a música ${card.musica}?`
    );

    if (response) {
      deleteCard(index);
      updateTable();
      organizarLista();
    }
  }
};

const organizarLista = () => {
  const cardList = document.querySelector(".recomendados_cards");
  const proximoVencimento = document.querySelector(".proxVencimento");

  // Converte os elementos da lista em um array
  const items = Array.from(cardList.children);

  items.sort((a, b) => {
    const dateA = parseDate(a.dataset.dueDate);
    const dateB = parseDate(b.dataset.dueDate);

    // Verifica se as datas são válidas
    if (!dateA || !dateB) {
      console.error("Data inválida no atributo data-due-date");
      return 0; // Mantém a ordem atual se houver datas inválidas
    }

    return dateA - dateB;
  });

  function parseDate(dateString) {
    // Converte a string "DD/MM/YYYY" para um objeto Date
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  }

  // Limpa a lista
  cardList.innerHTML = "";

  // Adiciona os itens ordenados de volta à lista
  items.forEach((item) => cardList.appendChild(item));

  // const primeiroItem = cardList.firstElementChild;

  // if (primeiroItem) {
  //   const dataProximoVencimento = proximoVencimento.firstElementChild
  //     ? proximoVencimento.firstElementChild.dataset.dueDate
  //     : null;

  //   // Verifica se a data do primeiro item é diferente da data já presente em "próximo vencimento"
  //   if (
  //     !dataProximoVencimento ||
  //     primeiroItem.dataset.dueDate !== dataProximoVencimento
  //   ) {
  //     proximoVencimento.innerHTML = ""; // Limpa a lista "próximo vencimento"
  //     proximoVencimento.appendChild(primeiroItem);
  //   }
  // }
};

updateTable();

//Eventos
document.querySelector(".adicionar_btn").addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);
document.querySelector(".red").addEventListener("click", closeModal);

document.querySelector(".green").addEventListener("click", saveCard);

const editIcon = document.querySelectorAll(".editIcon");

const deleteIcon = document.querySelectorAll(".deleteIcon");

editIcon.forEach(() => {
  addEventListener("click", editDelete);
});

deleteIcon.forEach(() => {
  addEventListener("click", editDelete);
});

document.addEventListener("DOMContentLoaded", organizarLista());

// document.addEventListener("DOMContentLoaded", () => {
//   const cardList = document.querySelector(".recomendados_cards");

//   if (cardList.textContent == "") {
//     const proxVencimento = document.querySelector(".agendamentos")

//     proxVencimento.innerHTML = `<section class="card_vencimento">
//             <div class="card_info">
//             <div class="card_info_status">
//               <span class="posicao">#10</span>
//               <img
//                 src="./assets/img/editar.png"
//                 alt="ícone de editar"
//                 class="editIcon"
//               />
//             </div>

//             <h3 class="card_servico">Nome da Música</h3>

//             <figure class="card_artista">
//               <figcaption class="card_artista_legenda">
//                 Nome do Artista
//               </figcaption>
//             </figure>
//           </div>

//           <section class="card_data_vencimento">
//             <button class="delete_container">
//               <p class="data__entrada">Entrou em: <br> 22/01/2010</p>

//               <img
//                 src="./assets/img/bin.png"
//                 alt="ícone de editar"
//                 class="deleteIcon"
//               />
//             </button>

//             <div class="data_vencimento">
//               <p class="data__vencimento">
//                 Vence em: <br />
//                 22/02/1996
//               </p>
//             </div>
//           </section>
//         </section>`;
//   }
// });
