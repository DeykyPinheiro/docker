docker run --help -> lista os comandos

docker ps/ docker container ls -> serve para listar os containers em execucao
docker ps -a/ docker container ls -a  -> mostra todos os container, mesmo os fora de execucao



docker run ubuntu sleep 1d -> roda o container e executa durante um dia
docker stop <id container / nome> - > para execucao do container, se adicionar  -t=0 a pausa fica instantanea, antes do nome do container
docker start <id container / nome> - >  reiniciar o container com mesmo id ou nome
docker exec -it  <id container / nome>  bash -> executa em modo interativo (mode exec) é execucao it é iterativo, o ultimo parametro é pra dizer que comando , i-> iterativo t -> terminal vai executar, isso acessa o terminal do container, entra em um container ja em execucao
exit -> sai do container

docker pause  <id container / nome> - > pausa o container, nao reinicia os processos
docker unpause  <id container / nome> - > despausa o container
top dentro do container -> mostra a arvore de processos

docker rm <id container / nome> - > excluir o container

docker run -it ubuntu bash -> executa o ubuntu em modo iterativo, quando der exit o container morre, ja que nao ha processos sendo executados


==============================================
executando aplicacao pratica no docker

docker run dockersamples/static-site -> executar um site statico pronto e deixa disponivel na porta 80 do container
docker run -d dockersamples/static-site -> -d serve pra executar o container e nao travar o terminal
docker rm <id container / nome>  --force -> parar e remover o containar de uma vez
docker run -d -P dockersamples/static-site ->  expoe a porta do container em alguma porta
docker run -d -p 8080:80 dockersamples/static-site -> 8080 da minha maquina, seja a 80 do container
docker port <id container / nome>  -> mostra como ta o mapeamento das portas




para acessar a porta tenho que expor

==============================================
o que sao imagens? -> 
sao receitas para gerar containeres, 
imagens são varios layers/ camadas
imagens sao read only, nao conseguimos modificar depois de criada

como imagens viram containers?
containers sao imagens com uma camamda temporaria de read/write,
eles sao processos dentro do nosso sistema, tal qual um pid

como criamos nosssas imagens?

docker images -> lista todas as imagens baixadas
docker inspect <id / nome> -> descreve o container
docker history <id / nome> -> mostra as camadas do container

==============================================
criando nossas imagens

docker build -t test/node:1.0 . -> builda a imagen e tickar ela como test/node, e coloco a versao 1.0 que vai ser executado no contexto do diretorio atual no caso "."

isso explica tudo o que temos no dockerfile
criamos um Dockerfile
    criarmos a imagem a parti do node 14
    definimos workdir como /app
    copiamos todos os aquivos locais menos o Dockerfile para dentro de workdir
    instalamos as dependencias
    e depois definimos o ponto de entrada como npm start


docker run -d -p 8080:3000 test/node:1.0 -> executa a aplicacao e ja deixa no entrypoint, ai basta acessa localhost:8080

==============================================

docker stop -t=0 $(docker ps -q) -> para mais de um container de uma vez, com o -t=0 para instantaneo
prestar atencao nas variaveis de ambiente, se salvar env e for usar ENV vai dar ruim

==============================================
como empurar a imagem
docker login -u <nome do login> -> loga primeiro, o -u acho que é igual do github pra deixar como padrao
docker push test/node:1.0 -> isso da errado mesmo com a imagem na maquina, pq eu tenho que por a tag com meu nome
docker tag <nome antigo:versao> <nome nome:versao> -> isso gera uma nova copia com tag escolinha na imagem

POSSO EMPURRAR VARIAS VERSOES DO CONTAINER

==============================================
PERSISTIR DADOS
docker rmi $(docker image ls -aq) --force -> exclui todas as imagens

docker ps -s -> mostra o tamanho do container (imagem + camada read/write)


    BIND MOUTHS
    serve para eu persistir no localhost
    persiste os dados mesmo que os containeres caiam
    
    docker run -it -v <pasta local>:<local da onde persistir>  ubuntu bash -> o -v significar que vai persistir o volume, 
    docker run -it -v C:/Users/pinheiro/Downloads/download_testes:/app  ubuntu bash -> exemplo da aplicacao acima
    docker run -–mount type=bind,source=C:/Users/pinheiro/Downloads/download_testes,target=/app bash -> exemplo mais atual

    VOLUMES
    o mais recomendado e é gerenciado pelo docker
    docker volume ls -> lista volumes
    docker volume create <nome do volume> -> cria uma volume
    docker run -it -v <volume>:<pasta no container> <imagem> <comando>  -> executa em modo iterativo e usa o volume configurado
    docker run -it -v meu-volume:/app ubuntu bash  -> exemplo de uso de volume,
    docker run -–mount source=meu-volume,target=/app bash -> exemplo mais atual
    docker volume -> lista de comandos
    se o volume nao tiver criado o docker cria
    volumes ficarm dentro de uma pasta local mas totalmente gerenciada pelo docker, depende do sistema, dai procura se quiser saber

    TMPFS
    só ta disponivel no linux, nao vou fazer

==============================================
    NETWORK
docker inspect <id / nome> -> inpeciona detalhes do container em execucao
o "NetworkID" mostra a rede, e como os container que subi (2), tem o mesmo NetworkID entao estão na mesma rede
docker network ls -> mostra as redes que o docker tem 

quando nao configurada uma rede, o container vai por padrao para a rede "bridge"

COMO PINGAR OUTRO CONTAINER NA MESMA REDE: 
apt-get update -> atualiza o ubuntu
apt-get install iputils-ping -y -> intalar o ping
ping <ipaddress> - eu consido conexao com o outro container ("IPAddress": "172.17.0.2",)

CONECTANDO CONTAINER USANDO OS NOMES, AO INVEZ DE IP
docker run -it --name ubuntu1 ubuntu bash -> --name serve para da nome ao container, ao invez de ter um nome aleatorio
docker run -it --name ubuntu1 --network <rede> ubuntu bash  -> exemplo: docker run -it --name ubuntu1 --network  minha-bridge ubuntu bash

docker run -it --name pong --network  minha-bridge ubuntu bash, da pra pingar ping pong e ele retorna a conexao


CRIANDO PROPRIA REDE
docker network create --driver <driver escolhido, geralmente o bridge> <nome da rede> 
->  exeplo "docker network create --driver bridge minha-bridge"

docker run -it --network none ubuntu bash ->  quando utilizamos o drive none, é como se disessemos que o drive nao vai ter interface de rede vinculada com ele, ele fica isolado em nivel de rede
docker run -it --network host ubuntu bash -> roda na rede que o usuario roda o docker, no caso eu, isso retira qualquer isolamento do container

docker network prune -> remove rede nao usada por container, pode usar sem dó, só exclui redes de containeres

==============================================
COMUNICANDO APLICACAO E BANCO

docker pull mongo:4.4.6
docker pull aluradocker/alura-books:1.0

docker run -d --name meu-mongo --network minha-rede mongo:4.4.6 -> executa o docker, como meu mongo e coloca ele na rede que eu criei
docker run -d -p 3000:3000 --network minha-rede  --name alurabooks aluradocker/alura-books:1.0 -> executa na mesma rede 

http://localhost:3000 -> tem uma aplicacao
http://localhost:3000/seed -> popula o banco



baixei essas duas imagens

==============================================
CONHECENDO DOCKER COMPOSE, basicamente, pega todos os comando e coloca em um scrip, ainda NÃO é um orquestrador

criei um arquivo chamado docker-compsoe.yaml

version: "3.9" //versao do yaml
services: // servicos que vamos usar, basicamente cada container que vamos subir
  mongodb: // nome do servico, pode ser qualquer um
    image: mongo:4.4.6 // carregando essa imagem
    container_name: meu-mongo // nome do container
    networks: // redes
      - compose-bridge // rede que vai ta conectado

  alurabooks:
    image: aluradocker/alura-books:1.0
    container_name: alurabooks
    networks:
      - compose-bridge
    ports: // mapeamento de porta
      - 3000:3000 // 8080 local  e 3000 do container

networks: // criando rede
  compose-bridge: // nome da rede criada
    driver: bridge // qual drive vai usar

