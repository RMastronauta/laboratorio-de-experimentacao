# 🚀 Análise de Repositórios Populares no GitHub  

Este projeto tem como objetivo coletar e analisar dados dos **1.000 repositórios mais populares** do GitHub, utilizando a **API GraphQL do GitHub**. Os dados extraídos ajudarão a responder **questões de pesquisa** sobre as características desses repositórios, como idade, frequência de atualização, quantidade de contribuições externas, entre outros fatores.  

---

## 📌 Funcionalidades  

- Coleta de dados via **GraphQL** para os **1.000 repositórios mais estrelados**.  
- **Armazenamento dos dados** em arquivos `.csv` para análise posterior.  
- **Análise estatística** e **visualização** dos dados coletados.  

---

## 📊 Questões de Pesquisa  

1️⃣ **Os sistemas populares são maduros/antigos?**  
    🔹 **Métrica**: Idade do repositório (calculada a partir da data de criação).  

2️⃣ **Os sistemas populares recebem muita contribuição externa?**  
    🔹 **Métrica**: Total de pull requests aceitas.  

3️⃣ **Os sistemas populares lançam releases com frequência?**  
    🔹 **Métrica**: Total de releases.  

4️⃣ **Os sistemas populares são atualizados com frequência?**  
    🔹 **Métrica**: Tempo até a última atualização.  

5️⃣ **Os sistemas populares são escritos nas linguagens mais populares?**  
    🔹 **Métrica**: Linguagem primária do repositório.  

6️⃣ **Os sistemas populares possuem um alto percentual de issues fechadas?**  
    🔹 **Métrica**: Razão entre número de issues fechadas e total de issues.  

---

## 📂 Estrutura do Projeto  

```plaintext
📂 lab-1
│── 📂 src
│   │── 📂 requisitos        # Scripts para responder às questões de pesquisa
│   │   │── requisito-1.js   # RQ 01: Idade do repositório
│   │   │── requisito-2.js   # RQ 02: Contribuições externas (PRs)
│   │   │── requisito-3.js   # RQ 03: Número de releases
│   │   │── requisito-4.js   # RQ 04: Atualizações frequentes
│   │   │── requisito-5.js   # RQ 05: Linguagem primária
│   │   │── requisito-6.js   # RQ 06: Issues fechadas
│   │── 📂 service           # Serviços auxiliares para requisições ao GitHub
│   │   │── git-service.js   # Serviço para conexão com API GraphQL do GitHub
│   │── 📂 utils             # Utilitários auxiliares
│   │   │── progress-bar.utils.js  # Barra de progresso para exibir andamento das consultas
│   │── main.js              # Arquivo principal para execução dos scripts
│── .gitignore               # Arquivos ignorados no versionamento
│── README.md                # Documentação do projeto
│── example.txt              # Exemplo de saída dos dados (opcional)
│── index.js                 # Ponto de entrada do projeto
│── package.json             # Dependências do projeto
│── package-lock.json        # Controle de versões das dependências
```

---

## 🏗 Tecnologias Utilizadas  

- 🟢 **JavaScript (Node.js)** → Para requisições à API do GitHub e processamento de dados.  
- 🔵 **GraphQL** → Para buscar informações detalhadas sobre os repositórios.  
- 📊 **CSV Parser** → Para salvar e manipular os dados extraídos.  

---

## 🚀 Como Executar  

### 1️⃣ Instale as dependências  

 - npm install


### 2️⃣ Configure o token de acesso  
Crie um arquivo \`config.js\` na raiz do projeto e adicione:  
```
module.exports = {
  GITHUB_TOKEN: "seu-token-aqui"
};
```

### 3️⃣ Execute a coleta de dados  

 - node index.js

