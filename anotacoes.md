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