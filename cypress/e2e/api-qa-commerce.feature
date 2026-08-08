# language: pt
# Feature de API QA-Commerce baseada na documentação disponível em /api-docs.
@api @bdd
Funcionalidade: Testes de API da QA-Commerce
  Como analista de qualidade
  Quero validar um GET e um POST da API
  Para garantir que o endpoint responde com o status correto e obedece à regra de negócio

  Contexto:
    Dado que o carrinho do usuário com id 1 está limpo

  @produtos
  Cenário: Listar produtos com paginação padrão
    Quando eu solicitar a lista de produtos sem parâmetros de paginação
    Então a resposta deve retornar status 200
    E o corpo deve conter uma lista de produtos
    E a página atual deve ser 1

  @carrinho
  Cenário: Adicionar produto ao carrinho via API
    Quando eu adicionar o produto com id 1 ao carrinho do usuário 1 com quantidade 2
    Então a resposta deve retornar status 201
    E a mensagem deve indicar que o produto foi adicionado com sucesso
    E o carrinho do usuário 1 deve conter o produto com id 1 e quantidade 2
