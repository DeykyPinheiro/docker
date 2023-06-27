docker run --help -> lista os comandos

docker ps/ docker container ls -> serve para listar os containers em execucao
docker ps -a/ docker container ls -a  -> mostra todos os container, mesmo os fora de execucao



docker run ubuntu sleep 1d -> roda o container e executa durante um dia
docker stop <id container / nome> - > para execucao do container, se adicionar  -t=0 a pausa fica instantanea, antes do nome do container
docker start <id container / nome> - >  reiniciar o container com mesmo id ou nome
docker exec -it  <id container / nome>  bash -> executa em modo interativo (mode exec) é execucao it é iterativo, o ultimo parametro é pra dizer que comando , i-> iterativo t -> terminal vai executar, isso acessa o terminal do container
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