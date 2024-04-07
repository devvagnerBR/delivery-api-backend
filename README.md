# App

Api Delivery

## RFs (Requisitos Funcionais)



## ADMIN

- [X] Deve ser possível cadastrar um novo cliente com acesso a aplicação;

## CLIENT

- [X] Deve ser possível verificar o token de acesso a aplicação;


## USER

- [X] Deve ser possível cadastrar um usuário;
- [X] Deve ser possível se autenticar;
- [X] Deve ser possível pegar os dados do perfil do usuário (sem senha);
- [X] Deve ser possível pegar os dados pessoais do usuário (sem senha);
- [X] Deve ser possível salvar no banco os dados pessoais de entrega e pagamento;
- [X] Deve ser possível atualizar os dados pessoais do usuário;
- [ ] Deve ser possível inserir ou remover item do carrinho;
- [ ] Deve ser possível ao finalizar compra, salvar os dados no banco e deletar os dados do carrinho;
- [ ] Deve ser possível atualizar o perfil do usuário;
- [X] Deve ser possível pegar os dados pessoais somente da pessoa logada (com o cookie armazenado localmente);



## RNs (Regras de Negócio)



- [X] Não deve ser possível cadastrar um usuário com email já existente;
- [X] Não deve ser possível cadastrar um usuário com telefone já existente;
- [X] Não deve ser possível cadastrar um novo cliente sem ser ADMIN;
- [X] Não deve ser possível realizar qualquer operação sem ter um token de API válido;


## RNFs (Requisitos Não Funcionais)



## Models (Tabelas)

- [X] User
- [X] Client
- [] Cart
- [] Products
- [] Orders


nome,telefone,cep,complemento,endereço de entrega,forma de pagamento