# listaCidades

**ATENÇÃO! PROJETO ARQUIVADO. Este script não funciona mais, dada mudanças em ambos os sites. Eu fiz para uma necessidade específica e não tenho intenções de voltar a atualizar.**

Isto é um simples crawler que consulta o site do IBGE e dos CORREIOS
para pegar as informações de faixa de CEP válidas e código do IBGE.

Este software é fornecido sem garantias. Este software usa uma solução heurística para cruzar os dados do site do IBGE e Correios pelo nome do município
mesmo quando estão grafados de forma diferente em cada fonte. Recomendo verificar o número de municípios e se houve alguma informação 

É necessário configurar o arquivo config.js, e em seguida rodar o main.js.
Este primeiro commit é uma versão alpha. Apenas gera um .csv em codificação UTF-8, mas encorajo qualquer um com conhecimento básico de programação
a alterar o código

Todas as partes do código foram feitas por mim. Alguns módulos não específicos do correios e ibge eu programei em inglês,
porque poderia ser generalizado para outro lugar.

Este arquivo é parte do programa listaCidades

    listaCidades é um software livre; você pode redistribuí-lo e/ou 
    modificá-lo dentro dos termos da Licença Pública Geral GNU como 
    publicada pela Fundação do Software Livre (FSF); na versão 3 da 
    Licença, ou (na sua opinião) qualquer versão.

    Este programa é distribuído na esperança de que possa ser  útil, 
    mas SEM NENHUMA GARANTIA; sem uma garantia implícita de ADEQUAÇÃO
    a qualquer MERCADO ou APLICAÇÃO EM PARTICULAR. Veja a
    Licença Pública Geral GNU para maiores detalhes.

    Você deve ter recebido uma cópia da Licença Pública Geral GNU junto
    com este programa, Se não, veja <http://www.gnu.org/licenses/>.

# Utilizando o software

Você deve fazer o download e descompactar o software Phantom.js, disponível em <http://www.phantomjs.org>. Esta versão alpha foi testada com as versões
2.1.1 do Phantom.js, para Microsoft Windows e para Linux.

A seguir, configurar o arquivo config.js, de acordo com os comentários no arquivo (configurações de proxy, UF desejada e arquivo de saída).
Nesta versão alpha o script irá fazer uma unidade da federação por vez,
apenas a que estiver configurada no arquivo config.js.

Por fim, basta executar o phantom passando o script main.js como parâmetro.

Por exemplo, se você usar Microsoft Windows e descompactou o Phantom.js e este projeto em C:\, você pode rodar assim:

    cd C:\listaCidades
    C:\phantomjs-2.1.1-windows\bin\phantomjs main.js

## Erros

Esta é uma versão alpha, que foi desenvolvida rapidamente e foi capaz de resolver minha necessidade no momento.
Se você não encontrar uma saída adequada, é possível que diferenças na conexão tenham feito algum passo ser lido
antes que a página necessária tenha sido carregada. Se você tiver conhecimentos em programação, por favor avise e tente colaborar com a resolução de erros.


## Problemas conhecidos:

### Acentos não são lidos corretamente no Microsoft Excel:
Por default o Excel lê o arquivo como se fosse codificado em ISO-8859-1, porém, por uma limitação de API, geramos a saída em UTF-8.
Note que isto é uma questão particular do Excel.
Outros softwares, inclusive concorrentes como o Google Docs e o LibreOffice ou o Apache OpenOffice.org devem ser capaz de
abrir o arquivo corretamente.

Um workaround para este problema é abrir em um software capaz de ler corretamente UTF-8 e salvar em outro formato. Ou ainda, abrir no bloco de notas
do Microsoft Windows, e salvar com a codificação UTF-8. A partir daí o Excel é capaz de reconhecer a codificação correta do arquivo. Verificarei no futuro
uma correção para este problema.

### O arquivo está todo numa linha só
As quebras de linha do arquivo de saída estão no padrão Unix (apenas LF, o "\n" de muitas linguagens de programação), ao invés do padrão windows
(caracteres CR seguido de LF). A maioria dos programas funciona bem com esse formato. Alguns mais antigos, como o bloco de notas do Windows não lêem a
quebra de linha corretamente (note que isto não impede usarmos o bloco de notas para o workaround anterior).

Se preferir gerar no formato Windows, altere o main.js, no final das chamadas ao fs.write(), onde houver '\n' substituir por \r\n


## TODO List
- Limpeza e melhorias de código, de acordo com as boas práticas e orientação a objeto.
- Melhoria de performance, paralelismo
- Gerar um CSV que o Microsoft Excel leia corretamente
- Outros formatos de saída (por exemplo SQL Script com comandos INSERT)
