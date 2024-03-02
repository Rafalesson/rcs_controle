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
const card_data__mes = document.querySelector(".card_data__mes");
const card_data__diaMes = document.querySelector(".card_data__diaMes");
const card_data__diaSemana = document.querySelector(".card_data__diaSemana");

card_data__diaSemana.innerHTML = `${capDiaSemana}`
card_data__diaMes.innerHTML = `${diaMes}`;
card_data__mes.innerHTML = `${capMes}`


// adicionar_btn.onclick = () => {
//     const tabElement = document.createElement("div");
//     tabElement.classList.add("abaCriar");

//     // Conteúdo da aba
//     tabElement.innerHTML = `
//     <h3>${1}</h3>
//     <p>Artista: ${2}</p>
//     <p>Data de Entrada: ${3}</p>
//     <p>Data de Vencimento: ${4}</p>
//     <button class="close-button">Fechar</button>
//     `
    
//    console.log(tabElement) 
// };


const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () =>
  document.getElementById("modal").classList.remove("active");

document.querySelector(".adicionar_btn").addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);
document.querySelector(".red").addEventListener("click", closeModal);

