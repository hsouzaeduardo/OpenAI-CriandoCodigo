// Cria o banco de dados
var db = openDatabase('meu_banco_de_dados', '1.0', 'Meu Banco de Dados', 2 * 1024 * 1024);

// Cria a tabela contatos
db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS contatos (id INTEGER PRIMARY KEY, nome TEXT, email TEXT, telefone TEXT)');
});

function inserirContato(nome, email, telefone) {
  db.transaction(function(tx) {
    tx.executeSql('INSERT INTO contatos (nome, email, telefone) VALUES (?, ?, ?)', [nome, email, telefone], function(tx, result) {
      // Se a inserção foi realizada com sucesso, atualiza a tabela
      atualizarTabelaContatos();
    }, function(tx, error) {
      console.log('Erro ao inserir contato: ' + error.message);
    });
  });
}

function atualizarTabelaContatos() {
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM contatos', [], function(tx, result) {
      var tabela = document.getElementById('tabela-contatos');
      tabela.innerHTML = '';

      for (var i = 0; i < result.rows.length; i++) {
        var contato = result.rows.item(i);
        tabela.innerHTML += '<tr><td>' + contato.nome + '</td><td>' + contato.email + '</td><td>' + contato.telefone + '</td></tr>';
      }
    }, function(tx, error) {
      console.log('Erro ao consultar contatos: ' + error.message);
    });
  });
}

function listarContatos() {
    db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM contatos', [], function(tx, result) {
        // Seleciona a tabela de contatos
        var tabelaContatos = document.getElementById('tabela-contatos').getElementsByTagName('tbody')[0];
  
        // Limpa os dados anteriores da tabela
        tabelaContatos.innerHTML = '';
  
        // Preenche a tabela com os dados do banco de dados
        for (var i = 0; i < result.rows.length; i++) {
          var row = result.rows.item(i);
          var newRow = tabelaContatos.insertRow(tabelaContatos.rows.length);
  
          var cellNome = newRow.insertCell(0);
          var cellEmail = newRow.insertCell(1);
          var cellTelefone = newRow.insertCell(2);
          var cellDelete = newRow.insertCell(3);
  
          cellNome.innerHTML = row.nome;
          cellEmail.innerHTML = row.email;
          cellTelefone.innerHTML = row.telefone;
          cellDelete.innerHTML = '<button class="btn btn-danger btn-sm" onclick="excluirContato(' + row.id + ')">Excluir</button>';
        }
  
        // Inicializa o DataTables na tabela de contatos
        $('#tabela-contatos').DataTable();
      }, function(tx, error) {
        console.log('Erro ao listar contatos: ' + error.message);
      });
    });
  }
  

// Seleciona o formulário
var formContato = document.getElementById('form-contato');

// Adiciona o evento de submit ao formulário
formContato.addEventListener('submit', function(event) {
  // Previne o comportamento padrão do formulário
  event.preventDefault();

  // Seleciona os campos do formulário
  var inputNome = document.getElementById('nome');
  var inputEmail = document.getElementById('email');
  var inputTelefone = document.getElementById('telefone');

  // Insere o novo contato no banco de dados
  inserirContato(inputNome.value, inputEmail.value, inputTelefone.value);

  // Limpa os campos do formulário
  inputNome.value = '';
  inputEmail.value = '';
  inputTelefone.value = '';
});

function excluirContato(id) {
    db.transaction(function(tx) {
      tx.executeSql('DELETE FROM contatos WHERE id = ?', [id], function(tx, result) {
        // Se a exclusão foi realizada com sucesso, atualiza a tabela
        atualizarTabelaContatos();
      }, function(tx, error) {
        console.log('Erro ao excluir contato: ' + error.message);
      });
    });
  }
  

listarContatos();