function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function carregarDados(chave) {
  return JSON.parse(localStorage.getItem(chave)) || [];
}

function gerarId(lista) {
  return lista.length ? lista[lista.length - 1].id + 1 : 1;
}


let clientes = carregarDados("clientes");
let pets = carregarDados("pets");


const clienteForm = document.getElementById("clienteForm");
const clienteTable = document.querySelector("#clienteTable tbody");
const petForm = document.getElementById("petForm");
const petsTable = document.querySelector("#petsTable tbody");
const petClienteSelect = document.getElementById("pet_cliente");


const messageBox = document.createElement('div');
messageBox.style.margin = '10px 0';
messageBox.style.padding = '10px';
messageBox.style.borderRadius = '6px';
messageBox.style.display = 'none';
messageBox.style.color = '#fff';
document.body.insertBefore(messageBox, document.body.firstChild);

function showMessage(msg, success = true) {
  messageBox.textContent = msg;
  messageBox.style.backgroundColor = success ? '#4CAF50' : '#e74c3c';
  messageBox.style.display = 'block';
  setTimeout(() => (messageBox.style.display = 'none'), 3000);
}


function atualizarTabelaClientes() {
  clienteTable.innerHTML = "";
  petClienteSelect.innerHTML = `<option value="">Selecione um cliente</option>`;

  clientes.forEach((cliente) => {
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nome_completo}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.telefone || "-"}</td>
      <td>
        <button class="edit" onclick="editarCliente(${cliente.id})">Editar</button>
        <button class="del" onclick="excluirCliente(${cliente.id})">Excluir</button>
      </td>
    `;
    clienteTable.appendChild(tr);

    
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent = cliente.nome_completo;
    petClienteSelect.appendChild(option);
  });
}

clienteForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("clienteId").value;
  const cliente = {
    id: id ? parseInt(id) : gerarId(clientes),
    nome_completo: document.getElementById("nome_completo").value,
    cpf: document.getElementById("cpf").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    endereco: document.getElementById("endereco").value,
  };

  if (!cliente.nome_completo || !cliente.cpf) {
    showMessage("Preencha todos os campos obrigatórios do cliente.", false);
    return;
  }

  if (id) {
    const index = clientes.findIndex((c) => c.id == id);
    clientes[index] = cliente;
    showMessage("Cliente atualizado com sucesso!");
  } else {
    clientes.push(cliente);
    showMessage("Cliente cadastrado com sucesso!");
  }

  salvarDados("clientes", clientes);
  clienteForm.reset();
  atualizarTabelaClientes();
});


function atualizarTabelaPets() {
  petsTable.innerHTML = "";

  pets.forEach((pet) => {
    const cliente = clientes.find((c) => c.id === pet.clienteId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pet.id}</td>
      <td>${pet.nome}</td>
      <td>${pet.especie || "-"}</td>
      <td>${pet.raca || "-"}</td>
      <td>${cliente ? cliente.nome_completo : "Cliente removido"}</td>
      <td>
        <button class="edit" onclick="editarPet(${pet.id})">Editar</button>
        <button class="del" onclick="excluirPet(${pet.id})">Excluir</button>
      </td>
    `;
    petsTable.appendChild(tr);
  });
}

petForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("petId").value;
  const clienteId = parseInt(document.getElementById("pet_cliente").value);
  const pet = {
    id: id ? parseInt(id) : gerarId(pets),
    clienteId,
    nome: document.getElementById("nome_pet").value,
    especie: document.getElementById("especie").value,
    raca: document.getElementById("raca").value,
    data_nascimento: document.getElementById("data_nascimento").value,
    observacoes: document.getElementById("observacoes").value,
  };

  if (!clienteId || !pet.nome || !pet.especie) {
    showMessage("Preencha todos os campos obrigatórios do pet.", false);
    return;
  }

  if (id) {
    const index = pets.findIndex((p) => p.id == id);
    pets[index] = pet;
    showMessage("Pet atualizado com sucesso!");
  } else {
    pets.push(pet);
    showMessage("Pet cadastrado com sucesso!");
  }

  salvarDados("pets", pets);
  petForm.reset();
  atualizarTabelaPets();
});


function editarCliente(id) {
  const cliente = clientes.find((c) => c.id === id);
  document.getElementById("clienteId").value = cliente.id;
  document.getElementById("nome_completo").value = cliente.nome_completo;
  document.getElementById("cpf").value = cliente.cpf;
  document.getElementById("email").value = cliente.email;
  document.getElementById("telefone").value = cliente.telefone;
  document.getElementById("endereco").value = cliente.endereco;
}

function excluirCliente(id) {
  if (confirm("Tem certeza que deseja excluir este cliente?")) {
    clientes = clientes.filter((c) => c.id !== id);
    pets = pets.filter(p => p.clienteId !== id); 
    salvarDados("clientes", clientes);
    salvarDados("pets", pets);
    atualizarTabelaClientes();
    atualizarTabelaPets();
    showMessage("Cliente e pets relacionados excluídos com sucesso!");
  }
}

function editarPet(id) {
  const pet = pets.find((p) => p.id === id);
  document.getElementById("petId").value = pet.id;
  document.getElementById("pet_cliente").value = pet.clienteId;
  document.getElementById("nome_pet").value = pet.nome;
  document.getElementById("especie").value = pet.especie;
  document.getElementById("raca").value = pet.raca;
  document.getElementById("data_nascimento").value = pet.data_nascimento;
  document.getElementById("observacoes").value = pet.observacoes;
}

function excluirPet(id) {
  if (confirm("Tem certeza que deseja excluir este pet?")) {
    pets = pets.filter((p) => p.id !== id);
    salvarDados("pets", pets);
    atualizarTabelaPets();
    showMessage("Pet excluído com sucesso!");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  atualizarTabelaClientes();
  atualizarTabelaPets();
});