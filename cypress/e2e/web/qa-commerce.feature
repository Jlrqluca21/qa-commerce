# language: pt
# Feature: Testes BDD para os fluxos principais da loja QA-Commerce
# Este arquivo descreve cenários claros e declarativos em formato Gherkin.
Funcionalidade: Fluxos essenciais do QA-Commerce
  # O usuário deve conseguir comprar e validar formulários sem depender de testes técnicos.
  Como usuário do site QA-Commerce
  Quero adicionar produtos ao carrinho, finalizar compras e ver validações precisas
  Para garantir que os principais fluxos funcionem corretamente

  # Cenário principal de compra: adicionar produto ao carrinho e verificar o carrinho.
  Cenário: Adicionar produto ao carrinho
    Dado que eu abra a página inicial do QA-Commerce
    E que eu espere a lista de produtos carregar
    Quando eu adicionar o primeiro produto disponível ao carrinho
    Então o contador do carrinho deve mostrar "1"
    E o produto deve aparecer na página do carrinho

  # Cenário de checkout completo com pagamento por cartão de crédito.
  Cenário: Checkout simples
    Dado que eu tenha pelo menos um produto no meu carrinho
    E que eu abra a página de checkout
    Quando eu preencher informações de entrega válidas
    E eu selecionar pagamento com cartão de crédito
    E eu aceitar os termos e finalizar o pedido
    Então eu devo ser redirecionado para a página de status do pedido
    E eu devo ver um número de pedido confirmado e o preço total

  # Cenário de validação de campos obrigatórios no checkout.
  Cenário: Validação de campos obrigatórios no checkout
    Dado que eu abra a página de checkout
    Quando eu enviar o formulário de checkout sem preencher os campos obrigatórios
    Então a página deve mostrar mensagens de validação para os campos obrigatórios
    E o pedido não deve ser enviado
