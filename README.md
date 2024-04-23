# App

Api Delivery

## RFs (Requisitos Funcionais)



## ADMIN

- [X] Deve ser possível cadastrar um novo cliente com acesso a aplicação;
- [X] Deve ser possível ao cadastrar um novo cliente gerar uma senha aleatória de 8 caracteres;

## CLIENT

- [X] Deve ser possível verificar o token de acesso a aplicação;
- [X] Deve ser possível se autenticar;
- [X] Deve ser possível pegar os dados do perfil do client (sem senha);
- [X] Deve ser possível cadastrar um produto;
- [X] Deve ser possível listar todos os produtos desse cliente;
- [X] Deve ser possível listar todos os produtos de uma categoria;
- [X] Deve ser possível listar um produto específico desse cliente;
- [X] Deve ser possível alterar um produto desse cliente;
- [X] Deve ser possível marcar um produto como inativo ou (fora de estoque);
- [X] Deve ser possível deletar um produto desse cliente;
- [ ] Deve ser possivel connfigurar alguns produtos como promoção;
- [ ] Deve ser possivel listar todos os pedidos feitos por usuarios desse cliente
;


## USER

- [X] Deve ser possível cadastrar um usuário;
- [X] Deve ser possível se autenticar;
- [X] Deve ser possível pegar os dados do perfil do usuário (sem senha);
- [X] Deve ser possível pegar os dados pessoais do usuário (sem senha);
- [X] Deve ser possível salvar no banco os dados pessoais de entrega e pagamento;
- [X] Deve ser possível atualizar os dados pessoais do usuário;
- [X] Deve ser possível inserir ou remover item do carrinho;
- [X] Deve ser possível ao finalizar compra, salvar os dados no banco e deletar os dados do carrinho;
- [MAYBE] Deve ser possível atualizar o perfil do usuário;
- [X] Deve ser possível pegar os dados pessoais somente da pessoa logada (com o cookie armazenado localmente);
- [MAYBE] Deve ser possível pegar o endereço via CEP;
- [X] Deve ser possível listar todos os pedidos desse usuário;
- [MAYBE] Deve ser possível listar um pedido específico desse usuário;
- [MAYBE] Deve ser possivel entrar com o google;



## RNs (Regras de Negócio)


- [X] Não deve ser possível cadastrar um usuário com email já existente;
- [X] Não deve ser possível cadastrar um usuário com telefone já existente;
- [X] Não deve ser possível cadastrar um novo cliente sem ser ADMIN;
- [X] Não deve ser possível realizar qualquer operação sem ter um token de API válido;



## RNFs (Requisitos Não Funcionais)



## Models (Tabelas)

- [X] User
- [X] Client
- [X] Cart
- [X] Products
- [X] Orders
