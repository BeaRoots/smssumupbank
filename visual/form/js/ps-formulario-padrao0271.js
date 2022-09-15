/*
--------------------------------
A FAZER:
--------------------------------

--------------------------------
PENDENTES FASE 2:
--------------------------------

- Lista de cidades a partir do estado (opcional, caso o CEP carregue todos os endereços ?)

- Validação de idade

- Carregar produtos dinamicamente no select de produtos/
	- Select de produtos alterar o subproduto:
		- Opção 1: subprodutos no select
		- Opção 2: sub select de sub produtos

--------------------------------
FEITO FASE 1:
--------------------------------
- Pegar a referencia de campanha da URL

- Data de vigência do formulário (Em caso de promoções por tempo limitado, por exemplo)

- Carregar campos PJ ou PF

- Validação de CEP

- Busca de endereço apartir do campo CEP opcional.
	- Inserir os campos hidden de endereço somenre em caso de busca

- Funçoes genéricas:
	- Função de pegar parâmetro na URL
	- Função de pegar Data e Hora
	- ID Google
	- Busca de CEP a partir de endereço
	- Endereço automático a partir do CEP

- Regras de métricas: data-type no botão de submit

- Regras de métricas: dataLayer no sucesso

- Função no init de verificação de campos obrigatórios, como canal, idproduto, campanha, etc...

- Submit:
	- Regras de envio de dados, como ddd separado do telefone, etc
	- Mensagem de sucesso

--------------------------------
DÚVIDAS:

--------------------------------

statusLead sinliza para o SIEBEL se ele deve ou não distribuir o lead.
	- Se não mandar nenhuma SUSEP, enviar o statusLead sem valor, para o SIEBEL distribuir
	- Enviou SUSEP, manda statusLead sem valor, para o SIEBEL não distribuir;
	- Enviou grupo Corretor, enviar statuslead' como 'Assinalada', para o SIEBEL distribuir;

	- Validação se já tem SUSEP atrelada

- Validação se já tem grupo de Corretor atrelado

*/

function psForm(obj) {

	//Altera para ambiente de homologação
	this.Homolog = false,

		//O formulário específcio que está sendo tratado:
		this.formObj = obj;

	//Variáveis de retorno de busca de endereço:
	this.endereco = "";
	this.tipoLogradouro = "";
	this.logradouro = "";
	this.bairro = "";
	this.cidade = "";
	this.estado = "";

	this.tipoPessoa;

	this.idGoogle;

	//this.selectTipoLogradouro;
	//this.selectProdutos;

	//Campos do Formulario:
	this.dataEncerramento;
	this.inputCanal;
	this.inputProduto;
	this.inputProdutoIndicacao;
	this.inputOrigemIndicacao;
	this.inputGenerico2;
	this.inputDataLayerEvento;
	this.inputEmail;
	this.inputTipoPessoa;
	this.inputNome;
	this.inputCpf;
	this.inputNomEmpresa;
	this.inputNomeRepresentante;
	this.inputCnpj;
	this.inputDataNascimento;
	this.inputEstadoCivil;
	this.inputSexo;
	this.inputPossuiVeiculo;
	this.inputCep;
	this.inputTipoLogradouroHidden;
	this.inputLogradouroHidden;
	this.inputEnderecoCompleto
	this.inputEnderecoNumero;
	this.inputEnderecoComplemento;
	this.inputCidadeHidden;
	this.inputEstadoHidden;
	this.inputLatitude;
	this.inputLongitude;
	this.inputTelefone;
	this.inputTelefoneCelular;
	this.inputMeioContato;
	this.inputDescricaoIndicacao;
	this.inputStatusLead;
	this.inputGrupoCorretores;
	this.inputSusep;
	this.inputPergunta1;
	this.inputPergunta2;
	this.inputPergunta3;
	this.inputPergunta4;
	this.inputPergunta5;
	this.inputPergunta6;
	this.inputPergunta7;
	this.inputPergunta8;
	this.inputPergunta9;
	this.inputPergunta10;
	this.inputResposta1;
	this.inputResposta2;
	this.inputResposta3;
	this.inputResposta4;
	this.inputResposta5;
	this.inputResposta6;
	this.inputResposta7;
	this.inputResposta8;
	this.inputResposta9;
	this.inputResposta10;
	this.inputGenerico1;
	this.inputTipoLogradouroCepGenerico;
	this.inputEnderecoCepGenerico;

	//Métricas:
	this.posicaoForm;
	this.produtoForm;

	//Flag de período válido:
	this.periodoValido = true;

	//Flag de busca de endereço habilitada ou não:
	this.buscaEndereco = false;

	//statusLead sem valor sinaliza para o SIEBEL distribuir o lead:
	this.statusLead = '';

	//Verifica se o formulário ainda pode ser preenchido:
	this.psFormPeriodoValidade()

	if (this.periodoValido == true) {

		//Guarda os objetos do form em variáveis::
		this.psFormGetCampos("init");

		//Verifica se a busca de endereço esta ativa e adiciona os campos hidden de endereço no form:
		this.psFormEnderecoCamposHidden();

		//Esconde os campos de endereço para complemento de CEP Genérico:
		this.psFormCamposGenericos(false);

		//Configura o campo de campanha com o parâmetro 'ref' na URL:
		this.psFormCampanha();

		//Define os dados do formulário conforme o tipo de pessoa:
		this.getTipoPessoa();

		//Configura todos os clicks de manipulação do form:
		this.setMouseEvents();

		//Configura todos os eventos de manipulação do form:
		this.setEvents();

		//Adiciona os tipos de logradouro no select:
		this.psFormSelectTipoLogradouro();

		//Implementar Fase 2: Adiciona os produtos no select:
		//psFormSelectProdutos
	}

	this.dataLayerEvento = '';
	this.dataLayerNomeForm = '';
	this.dataLayerProdutoForm = '';
	this.dataLayerPosicaoForm = '';
}


//#######################################
//	 Pega todos os elementos do formulário
//#######################################

psForm.prototype.psFormGetCampos = function (campos) {
	var self = this;

	if (campos == "init") {
		this.dataEncerramento = $("input[name='ps-frm-dataEncerramento']", this.formObj);
		this.inputCanal = $("[name='ps-frm-canal']", this.formObj);
		this.inputProduto = $("[name='ps-frm-idProduto']", this.formObj);
		this.inputProdutoSelect = $("[name='ps-frm-idProdutoSelect']", this.formObj);
		this.inputProdutoIndicacao = $("[name='ps-frm-produtoIndicacao']", this.formObj);
		this.inputOrigemIndicacao = $("[name='ps-frm-origemIndicacao']", this.formObj);
		this.inputGenerico2 = $("[name='ps-frm-generico2']", this.formObj);
		this.inputDataLayerEvento = $("[name='ps-frm-eventoDatalayer']", this.formObj);
		this.inputEmail = $("[name='ps-frm-email']", this.formObj);
		this.inputTipoPessoa = $("[name='ps-frm-tipoPessoa']", this.formObj);
		this.inputNome = $("[name='ps-frm-nome']", this.formObj);
		this.inputCpf = $("[name='ps-frm-cpf']", this.formObj);
		this.inputNomEmpresa = $("[name='ps-frm-nomeempresa']", this.formObj);
		this.inputNomeRepresentante = $("[name='ps-frm-nomerepresentante']", this.formObj);
		this.inputCnpj = $("[name='ps-frm-cnpj']", this.formObj);
		this.inputDataNascimento = $("[name='ps-frm-dataNascimento']", this.formObj);
		this.inputEstadoCivil = $("[name='ps-frm-estadoCivil']", this.formObj);
		this.inputSexo = $("[name='ps-frm-sexo']", this.formObj);
		this.inputPossuiVeiculo = $("[name='ps-frm-possuiVeiculo']", this.formObj);
		this.inputCep = $("[name='ps-frm-cep']", this.formObj);
		this.inputEnderecoCompleto = $("[name='ps-frm-enderecoCompleto']", this.formObj);
		this.inputEnderecoNumero = $("[name='ps-frm-numero']", this.formObj);
		this.inputEnderecoComplemento = $("[name='ps-frm-complemento']", this.formObj);
		this.inputTipoLogradouroCepGenerico = $("[name='ps-frm-tipoLogradouroCepGenerico']", this.formObj);
		this.inputEnderecoCepGenerico = $("[name='ps-frm-enderecoCepGenerico']", this.formObj);
		//Procura por estes campos, mesmo que eles não existam ainda. Necessário quando não há busca por CEP:
		this.inputTipoLogradouroHidden = $("[name='ps-frm-tipoLogradouroHidden']", this.formObj);
		this.inputLogradouroHidden = $("[name='ps-frm-logradouroHidden']", this.formObj);
		this.inputCidadeHidden = $("[name='ps-frm-cidadeHidden']", this.formObj);
		this.inputEstadoHidden = $("[name='ps-frm-estadoHidden']", this.formObj);
		this.inputLatitude = $("[name='ps-frm-latitude']", this.formObj);
		this.inputLongitude = $("[name='ps-frm-longitude']", this.formObj);
		//
		this.inputTelefone = $("[name='ps-frm-telefone']", this.formObj);
		this.inputTelefoneCelular = $("[name='ps-frm-telefoneCelular']", this.formObj);
		this.inputMeioContato = $("[name='ps-frm-meioContato']", this.formObj);
		this.inputDescricaoIndicacao = $("[name='ps-frm-descricaoIndicacao']", this.formObj);
		this.inputStatusLead = $("[name='ps-frm-statusLead']", this.formObj);
		this.inputGrupoCorretores = $("[name='ps-frm-grupoCorretores']", this.formObj);
		this.inputSusep = $("[name='ps-frm-susep']", this.formObj);
		this.inputPergunta1 = $("[name='ps-frm-pergunta1']", this.formObj);
		this.inputPergunta2 = $("[name='ps-frm-pergunta2']", this.formObj);
		this.inputPergunta3 = $("[name='ps-frm-pergunta3']", this.formObj);
		this.inputPergunta4 = $("[name='ps-frm-pergunta4']", this.formObj);
		this.inputPergunta5 = $("[name='ps-frm-pergunta5']", this.formObj);
		this.inputPergunta6 = $("[name='ps-frm-pergunta6']", this.formObj);
		this.inputPergunta7 = $("[name='ps-frm-pergunta7']", this.formObj);
		this.inputPergunta8 = $("[name='ps-frm-pergunta8']", this.formObj);
		this.inputPergunta9 = $("[name='ps-frm-pergunta9']", this.formObj);
		this.inputPergunta10 = $("[name='ps-frm-pergunta10']", this.formObj);
		this.inputResposta1 = $("[name='ps-frm-resposta1']", this.formObj);
		this.inputResposta2 = $("[name='ps-frm-resposta2']", this.formObj);
		this.inputResposta3 = $("[name='ps-frm-resposta3']", this.formObj);
		this.inputResposta4 = $("[name='ps-frm-resposta4']", this.formObj);
		this.inputResposta5 = $("[name='ps-frm-resposta5']", this.formObj);
		this.inputResposta6 = $("[name='ps-frm-resposta6']", this.formObj);
		this.inputResposta7 = $("[name='ps-frm-resposta7']", this.formObj);
		this.inputResposta8 = $("[name='ps-frm-resposta8']", this.formObj);
		this.inputResposta9 = $("[name='ps-frm-resposta9']", this.formObj);
		this.inputResposta10 = $("[name='ps-frm-resposta10']", this.formObj);
		this.inputGenerico1 = $("[name='ps-frm-generico1']", this.formObj);
	} else if (campos == "enderecosHidden") {
		this.inputTipoLogradouroHidden = $("[name='ps-frm-tipoLogradouroHidden']", this.formObj);
		this.inputLogradouroHidden = $("[name='ps-frm-logradouroHidden']", this.formObj);
		this.inputCidadeHidden = $("[name='ps-frm-cidadeHidden']", this.formObj);
		this.inputEstadoHidden = $("[name='ps-frm-estadoHidden']", this.formObj);
		this.inputLatitude = $("[name='ps-frm-latitude']", this.formObj);
		this.inputLongitude = $("[name='ps-frm-longitude']", this.formObj);
	}

	self.psFormCamposObrigatorios();
}

//#######################################
//	 Validação de Campos obrigatórios
//#######################################

psForm.prototype.psFormCamposObrigatorios = function () {
	//verifica se campo existe
	//Verifica se tem valor
	//Warn valor
	//Erro existe
	//Warn não existe
	//

	//Link da documentação, usado nos warnings:
	var link = "http://www.portoseguro.com.br/visual/form/form-padrao-portoseguro.html";

	//Os campos abaixo possuem valor inicial, e é feita a verificação se existe e se possui valor inicial:

	if (psVerificaObjeto(this.inputCanal)) {
		if (this.inputCanal.val() == '') { psWarnings('campoObrigatorioVasio', 'CANAL (ps-frm-canal)', link) }
	} else {
		psWarnings('campoObrigatorioFaltando', 'CANAL (ps-frm-canal)', link)
	}

	if (psVerificaObjeto(this.inputProduto)) {
		if (this.inputProduto.prop('tagName') == "INPUT") {
			if (this.inputProduto.val() == '') {
				psWarnings('campoObrigatorioVasio', 'PRODUTO (ps-frm-idProduto)', link)
			}
		}
	} else {
		psWarnings('campoObrigatorioFaltando', 'PRODUTO (ps-frm-idProduto input)', link)
	}

	if (psVerificaObjeto(this.inputProdutoIndicacao)) {
		if (this.inputProdutoIndicacao.val() == '') { psWarnings('campoObrigatorioVasio', 'PRODUTO INDICAÇÃO (ps-frm-produtoIndicacao)', link) }
	} else {
		psWarnings('campoObrigatorioFaltando', 'PRODUTO INDICAÇÃO (ps-frm-produtoIndicacao)', link)
	}

	if (psVerificaObjeto(this.inputOrigemIndicacao)) {
		if (this.inputOrigemIndicacao.val() == '') { psWarnings('campoObrigatorioVasio', 'ORIGEM INDICAÇÃO (ps-frm-origemIndicacao)', link) }
	} else {
		psWarnings('campoObrigatorioFaltando', 'ORIGEM INDICAÇÃO (ps-frm-origemIndicacao)', link)
	}

	if (psVerificaObjeto(this.inputDataLayerEvento)) {
		if (this.inputDataLayerEvento.val() == '') { psWarnings('campoObrigatorioVasio', 'EVENTO DO DATALYER (ps-frm-inputDataLayerEvento)', link) }
	} else {
		psWarnings('campoObrigatorioFaltando', 'EVENTO DO DATALYER (ps-frm-inputDataLayerEvento)', link)
	}

	//Os campos abaixo não possuem valor inicial:

	if (!psVerificaObjeto(this.inputGenerico2)) {
		psWarnings('campoObrigatorioFaltando', 'GENERICO 2 (ps-frm-generico2)', link)
	}

	//Se a busca por endereço está habilitada, valida se os campos hidden de endereço foram inseridos:
	if (this.buscaEndereco == true) {
		if (!psVerificaObjeto(this.inputTipoLogradouroHidden)) {
			psWarnings('campoObrigatorioFaltando', 'TIPO LOGRADOURO HIDDEN (ps-frm-tipoLogradouroHidden)', link)
		}

		if (!psVerificaObjeto(this.inputLogradouroHidden)) {
			psWarnings('campoObrigatorioFaltando', 'LOGRADOURO HIDDEEN (ps-frm-logradouroHidden)', link)
		}

		if (!psVerificaObjeto(this.inputCidadeHidden)) {
			psWarnings('campoObrigatorioFaltando', 'CIDADE HIDDEN (ps-frm-cidadeHidden)', link)
		}

		if (!psVerificaObjeto(this.inputEstadoHidden)) {
			psWarnings('campoObrigatorioFaltando', 'ESTADO HIDDEN (ps-frm-estadoHidden)', link)
		}
	}

	if (!psVerificaObjeto(this.inputEmail)) {
		psWarnings('campoObrigatorioFaltando', 'E-MAIL (ps-frm-email)', link)
	}
}

function psWarnings(tipo, dado, link) {
	switch (tipo) {
		case 'campoObrigatorioFaltando':
			console.warn('Campo obrigatório ' + dado + ' não foi encontrado. Para mais informações, acesse: ' + link)
			break;
		case 'campoObrigatorioVasio':
			console.warn('Campo obrigatório ' + dado + ' sem valor definido. Para mais informações, acesse: ' + link)
			break;
	}
}

//#######################################
//	 Select de produtos
//#######################################

psForm.prototype.psFormSelectProdutos = function () {

	//Verifica se o select existe:
	if (psVerificaObjeto(this.inputProdutosSelect)) {
		//Verifica se o select está vazio:
		if (this.inputProdutoSelect.find('option').length == 0) {
			//Chama a função que insere os produtos no select:
			psSelectProdutos(this.inputProdutosSelect);
		}
	}
}

//#######################################
//			Paremetro de campanha
//#######################################

psForm.prototype.psFormCampanha = function () {
	//Chama função genérica de pegar parâmetros na URL, e pega o parâmetro 'ref':
	var ref = $.psGetUrlParam('ref')

	//Executa apenas se tem o parâmetro na URL:
	if (ref) {
		//Atrinui o valor de 'ref' no input hidden de campanha:
		this.inputOrigemIndicacao.val(ref)
	}
}

//#######################################
//			ID Google
//#######################################

psForm.prototype.psFormIdGoogle = function () {
	//Chama função genérica de pegar parâmetros na URL, e pega o parâmetro 'ref':
	this.idGoogle = $.psGetIDGoogle();

	//Atrinui o valor de 'ref' no input hidden de campanha:
	this.inputGenerico2.val(this.idGoogle)
}

//#######################################
//			Período de validade
//#######################################

psForm.prototype.psFormPeriodoValidade = function () {
	var self = this;

	var dataEncerramento = $("input[name='ps-frm-dataEncerramento']", this.formObj)

	if (psVerificaObjeto(dataEncerramento)) {
		//Pega valor do campo "ps-frm-dataEncerramento" e coloca em um array de 3 indices [DD][MM][AAAA]:
		var dataLimite = dataEncerramento.val().split('/');
		dataLimite[1] = parseFloat(dataLimite[1]) - 1;

		//Verifica se existe uma data de validade:
		if (dataLimite.length > 0) {
			//Verifica se a data está completa, com os 3 indices dia, mês e ano:
			if (dataLimite.length > 2) {
				//Pega os dados do dia atual e transforma em milisegundos:
				var dataAtual = Date.UTC($.psClock.year, $.psClock.month, $.psClock.day);

				//Transforma a data do form para milisegundos:
				dataLimite = Date.UTC(dataLimite[2], dataLimite[1], dataLimite[0]);

				//Se a data atual for maior que a data de validade do form, encerra o form:
				if (dataAtual > dataLimite) {
					//Exclui o form e substitui por mensagem de encerramento do período:
					$(this.formObj).replaceWith('<p>Data de preenchimento encerrada.</p>')
					this.periodoValido = false;
				}
			}
		}
	}
}

//#######################################
//		Pessoa Física ou Jurídica
//#######################################

psForm.prototype.getTipoPessoa = function () {
	//Verifica qual radio está selecionado: PF ou PJ
	this.tipoPessoa = $("input[name='ps-frm-tipoPessoa']:checked", this.formObj).val();

	//Se PF está selecionado
	switch (this.tipoPessoa) {
		case 'PF':
			$('.psFormMostraPF', this.formObj).show(); //Aparece campos com classe psFormMostraPF
			$('.psFormMostraPJ', this.formObj).hide(); //Esconde campos com classe psFormMostraPJ
			$('#div_privacidade').show();
			break;
		// (forçar o sublime a identar direito)
		case 'PJ':
			$('.psFormMostraPJ', this.formObj).show();//Aparece campos com classe psFormMostraPJ
			$('.psFormMostraPF', this.formObj).hide(); //Esconde campos com classe psFormMostraPF
			$('#div_privacidade').hide();
			break;
		// (forçar o sublime a identar direito)
		default:
			break
	}
}

//#######################################
//		Busca de Endereço a partir do CEP
//#######################################

//Adciona os campos hidden em caso de busca de endereço:
psForm.prototype.psFormEnderecoCamposHidden = function () {
	var camposHidden = '<input type="hidden" name="ps-frm-tipoLogradouroHidden" class="ps-frm-entry"/>\
	<input type="hidden" name="ps-frm-logradouroHidden" class="ps-frm-entry"/>\
	<input type="hidden" name="ps-frm-cidadeHidden" class="ps-frm-entry"/>\
	<input type="hidden" name="ps-frm-estadoHidden" class="ps-frm-entry"/>\
	<input type="hidden" name="ps-frm-latitude" class="ps-frm-entry" vlaue=""/>\
	<input type="hidden" name="ps-frm-longitude" class="ps-frm-entry" vlaue=""/>';

	if (psVerificaObjeto(this.inputCep)) {
		//Verifica se o campo de CEP tem o atributo data-busca-cep = true:
		if (this.inputCep.data("busca-cep") == true) {

			this.buscaEndereco = true;

			//Adiciona os campos hidden de endereço no fformulario:
			$(this.formObj).append(camposHidden);

			//Carrega os campos criados acima em variaveis:
			this.psFormGetCampos("enderecosHidden");
		}
	}
}

//Adiciona os tipos de logradouro no select:
psForm.prototype.psFormSelectTipoLogradouro = function (status) {
	//Pega o select para manipulação:
	this.selectTipoLogradouro = $('.ps-frm-selectLogradouro', this.formObj);

	//Verifica se o select existe:
	if (psVerificaObjeto(this.selectTipoLogradouro)) {
		//Chama a função que insere os tipos de logradouro no select:
		psSelectTipoLogradouro(this.selectTipoLogradouro);
	}
}

//Mostra ou esconde os campos de endereço para complemento de CEP Genérico
psForm.prototype.psFormCamposGenericos = function (status) {
	var self = this;

	if (status) {
		$(".psFormMostraCepGenerico", this.formObj).show();
	} else {
		$(".psFormMostraCepGenerico", this.formObj).hide();
	}
}

//Chama a função genércia de busca de endereço a partir do CEP:
psForm.prototype.psFormBuscaDeEndereco = function (cep) {
	//Chama função genérica de busca de endereço.
	//Passa qual formulário deve ser manipulado no segundo parametro:
	psPesquisaDeEndereco(cep, this);
}

//Retorno do Endereço com sucesso, da função genérica de busca de endereço:
function pesquisaDeEnderecoSucesso(retornoBusca, alvo) {
	//Chama função que insere os endereços no campos certos.
	//Passa qual formulário deve ser manipulado no segundo parametro:
	alvo.psFormCepCompletaEndereco(retornoBusca, alvo);
}

//Retorno do Endereço com erro, da função genérica de busca de endereço.
function pesquisaDeEnderecoErro(retornoBusca, alvo) {
	//Chama a função de mensagens de erro.
	//Passa qual formulário deve ser manipulado no segundo parametro:
	alvo.pesquisaDeEnderecoErros(retornoBusca, alvo)
}

//Retorno de erro de conexão, da função genérica de busca de endereço:
function pesquisaDeEnderecoErroConexao(retornoBusca, alvo) {
	//Chama a função de mensagens de erro.
	//Passa qual formulário deve ser manipulado no segundo parametro:
	alvo.pesquisaDeEnderecoErros(retornoBusca, alvo)
}

//Mensages de erro da busca:
psForm.prototype.pesquisaDeEnderecoErros = function (retornoBusca, alvo) {
	var self = this;

	//Status false aciona a ciaxa de erro
	var status = retornoBusca.status;

	//Mensagem que deve aparecer relativa ao tipo de erro:
	var mensagem = retornoBusca.mensagem;

	//Exibe mensagem de erro no campo CEP:
	psLib.FormShowFieldError($(".ps-frm-zipcode", this.formObj), status);

	//Procura a div gerada pelo guide que contém a mensagem de erro e altera o texto:
	$(".ps-frm-zipcode", this.formObj).siblings('.ps-frm-ctt-error').find('.ps-panel-ctt').html('<span class="ps-ico ps-ico-alert"></span>' + mensagem)

	//Chama a função que completa os campos de endereço. Netse caso, limpa os campos:
	self.psFormCepCompletaEndereco(retornoBusca, alvo);
}

//Insere os dados de endereço no formulário:
psForm.prototype.psFormCepCompletaEndereco = function (retornoBusca, alvo) {
	var self = this

	//Status true esconde a ciaxa de erro
	var status = retornoBusca.status;

	//Esconde a mensagem de erro, se estiver visível:
	psLib.FormShowFieldError($(".ps-frm-zipcode", this.formObj), status);

	//----------------------------------------------------------------------------
	//Verifica se os campos existem no formulário e insere o respectivo valor.
	//----------------------------------------------------------------------------

	//Endereço completo (tipoLogradouro + Logradouro + Cidade + estado) em um único campo:
	if (psVerificaObjeto(this.inputEnderecoCompleto)) {
		this.inputEnderecoCompleto.val(retornoBusca.endereco);
	}

	// Tipo de Logradouro, ex.; Rua, Avenida, Alameda:
	if (psVerificaObjeto(this.inputTipoLogradouroHidden)) {
		this.inputTipoLogradouroHidden.val(retornoBusca.tipoLogradouro);
	}

	//Endereço:
	if (psVerificaObjeto(this.inputLogradouroHidden)) {
		this.inputLogradouroHidden.val(retornoBusca.logradouro);
	}

	//Bairro:
	/*if(campoBairro.length > 0){
		campoBairro.val(this.bairro);
	}*/

	//Cidade:
	if (psVerificaObjeto(this.inputCidadeHidden)) {
		this.inputCidadeHidden.val(retornoBusca.cidade);
	}

	//Estado:
	if (psVerificaObjeto(this.inputEstadoHidden)) {
		this.inputEstadoHidden.val(retornoBusca.estado);
	}

	//----------------------------------------------------------------------------
	//CEP Genérico: CEPs de cidades pequenas que servem para toda a cidade, não tendo especificação de logradouro.
	//Nestes casos, é preiso mostrar o campo de logradouro, para a pessoa inserir a rua.
	//----------------------------------------------------------------------------

	//Verifica se teve retorno de cidade e logradouro:
	if (retornoBusca.logradouro == 'undefined') {
		//Cep Genérico, mostra os campos de complemento:
		self.psFormCamposGenericos(true);
	} else {
		//Cep normal, esconde os campos de complemento:
		self.psFormCamposGenericos(false);

		//Reseta o valor do campo de endereço:
		this.inputEnderecoCepGenerico.val('');

		//Reseta o valor do campo de tipo de logradoro:
		this.inputTipoLogradouroCepGenerico.val('');
	}
}

//#######################################
//		Busca de CEP a partir do endereço
//#######################################

//Configura as variáveis que serão passadas para a função genérica de busca de CEP:
function chamaPesquisaPorCep() {
	var alvo = $('#ps-frm-buscaCEP').data('target');
	var listaResultado = '#ps-frm-listaEnderecosBuscaCep';

	//Pega valores dos campos do formulario de busca de cep. Campos devem estar em maiuscula e sem caracter especial. Classe  ps-frm-cleanup do guide faz isso:
	logradouro = $('input[name=ps-frm-buscaEndereco]').val();
	cidade = $('input[name=ps-frm-buscaCidade]').val();
	unidadeFederacao = $('select[name=ps-frm-buscaEstado]').val();

	//Função genérica de busca de CEP:
	psPesquisaPorCep(logradouro, cidade, unidadeFederacao, alvo, listaResultado)
}

//Em caso de retornar um CEP:
function pesquisaPorCepSucesso(xml, alvo, listaResultado) {
	//Limpa a lista, caso tenha mensagem de erro, etc:
	$(listaResultado).empty();

	//looping monta lista de endereços do resultado da busca
	$(xml).find('retorno>endereco').each(function () {
		//Pega os dados no xml de endereços:
		var endereco = $(this).find("tipoLogradouro").text() + " " + $(this).find("logradouro").text();
		var numero = $(this).find("complementoLogradouro").text();
		var bairro = $(this).find("bairro").text();
		var cep = $(this).find("cepPrincipal").text() + "-" + $(this).find("complementoCep").text();
		var itemLista = '<li class="ps-frm-itemResultadoBuscaCep ps-list-ico" style="cursor:pointer;" data-cep="' + cep + '"><span class="ps-ico ps-ico-check"></span>' + endereco + " <strong>" + numero + "</strong>" + "<br /> <small>" + bairro + " - " + cep + "</small>";

		//Adiciona o endereço na lista de resultado de busca + click para enviar o cep para o formulário:
		$(itemLista).appendTo('#ps-frm-listaEnderecosBuscaCep').click(function () {
			//Pega o Cep do atributo data-cep:
			var meuCep = $(this).data('cep');

			//Campo de cep do formulario a ser preenchido:
			var campoCep = $(".ps-frm-zipcode", "#" + alvo);

			//Insere o CEP no campo correto:
			campoCep.val(meuCep);

			//Fecha o modal e adiciona o foco no campo de CEP. Assim, quando clicar em outro local, ele faz a busca de Cep:
			psLib.ModalShowHide("#ps-modal-buscaCep", false, false, '', campoCep.focus());
		});
	});
}

//Em caso de erro na busca pelo CEP:
function pesquisaPorCepErro(listaResultado) {
	//Limpa a lista, caso tenha mensagem de erro, etc:
	$(listaResultado).empty();

	//Insere mensagem de erro:
	$(listaResultado).append("<li>CEP não encontrado. Confira os dados inseridos nos campos acima e tente novamente.</li>")
}

//Em caso de erro de conexão:
function pesquisaPorCepErroConexao(listaResultado) {
	//Limpa a lista, caso tenha mensagem de erro, etc:
	$(listaResultado).empty();

	//Insere mensagem de erro:
	$(listaResultado).append("<li>Desculpe, a busca está indisponível no momento. <br /> Por favor, volte um pouco mais tarde</li>")
}

//#######################################
//			Submit
//#######################################

var psFrmValidate = false;

//Função chamada pelo atributo 'data-validatesuccess' no botão de envio do form, após a validação do formulário:
function psFormValid() {
	//Sinaliza que o form está válido:
	psFrmValidate = true;
}

//Função chamada pelo botão de submit. Aguarda alguns segundos para a validação do formulário, então chama a função de submit:
psForm.prototype.psFormTimeoutSubmit = function (self) {

	//Configura o campo 'ps-frm-generico2' com o ID Google:
	self.psFormIdGoogle();

	setTimeout(function () { self.psFormSubmit(self) }, 1000)
}

//Função de submit, acionada alguns segundos após o click no botão de submit. Aguarda para fazer a validação do form:
psForm.prototype.psFormSubmit = function (self) {
	//Se 'psFrmValidate' igual a 'true', então form é válido e pode ser enviado:
	if (psFrmValidate == true) {
		//Por ser uma variável global, volta o falor para 'false', caso outra validação precise ser feita:
		psFrmValidate = false;

		//Pega todos os campos do form
		var req = self.psFormGetFormData();

		//Envia para o Siebel
		self.psFormSubmitSiebel(req);
	} else {
		//Para testes, apagar:
		self.psFormGetFormData();
	}
}

//Pega os valores do formulário e monta arequisição:
psForm.prototype.psFormGetFormData = function () {
	var self = this;

	var req = '';

	// ***********************************
	//	Campos obrigatórios:
	// ***********************************

	//Contato
	//req: email
	var email = "email=" + psInputGetVal(this.inputEmail);

	//Campanha
	//req: Canal
	var campanha = $.psGetUrlParam('codigoParceiroExterno') != null ? "Meu Porto Seguro" : null;
	var canal = campanha != null ? "canal=" + campanha : "canal=" + this.inputCanal.val();
	//req: origem
	var idVendedor = $.psGetUrlParam('codigoRepresentanteParceiroExterno');
	var origemIndicacao = idVendedor != null? "origemIndicacao=" + idVendedor : "origemIndicacao=" + psInputGetVal(this.inputOrigemIndicacao);

	//Produto
	//req: ID do produto
	var idProduto;
	var getIdProduto;

	//Duas opções de campo, um hidden e outro select. O select é para formulários genéricos, onde o usuário pode escolher qual produto.

	//Verifica se existe o input de produto:
	if (psVerificaObjeto(this.inputProduto)) {
		//Verifica se tem o selct de produtos:
		if (psVerificaObjeto(this.inputProdutoSelect)) {
			//Pega o valor do select e adiciona no input de produtos:
			this.inputProduto.val(psInputGetVal(this.inputProdutoSelect));

			//Pega o texto da opção selecionada e adiciona no campo ps-frm-produtoIndicacao:
			var nomeProduto = $("#ps-frm-idProdutoSelect  option:selected", this.formObj).text();
			this.inputProdutoIndicacao.val(nomeProduto);
		}

		//Pega o Id do produto no campo hidden ps-frm-idProduto:
		getIdProduto = psInputGetVal(this.inputProduto);

		//ID produto para a requisição:
		idProduto = "idProduto=" + getIdProduto;
	}

	//dataLayer: pega o Id do produto:
	this.dataLayerIdProdutoForm = getIdProduto;

	//req: Pega o nome do produto no campo
	var produtoIndicacao = "produtoIndicacao=" + psInputGetVal(this.inputProdutoIndicacao);

	//dataLayer: Pega o produto:
	this.dataLayerProdutoForm = psInputGetVal(this.inputProdutoIndicacao);

	//req: ID Google:
	var idGoogle = "generico2=" + psInputGetVal(this.inputGenerico2);

	//Requisição mínima, com os dados obrigatórios:
	req = email + "&" + canal + "&" + origemIndicacao + "&" + idProduto + "&" + produtoIndicacao + "&" + idGoogle;

	// ***********************************
	//
	//	Campos opcionais:
	//   1 - Verificar se os campos existem
	//		2 - Verificar se tem valor
	//			4 - Se não tem valor, devolve erro

	// ***********************************

	//Dados pessoais

	//Verifica se tem a opção de escolher o Tipo de Pessoa.
	//Se tem, segue o fluxo. Se não tem, verifica se tem os campos de nome, cpf, nome emrpesa, nome representante e cnpj.
	if (psVerificaObjeto(this.inputTipoPessoa)) {
		req += ('&tipoPessoa=' + psInputGetVal(this.inputTipoPessoa));
	} else {

		//Se é pessoa física, pega os dados de nome e cpf:
		if (psVerificaObjeto(this.inputNome)) {
			req += ('&nome=' + psInputGetVal(this.inputNome).toUpperCase());
		}
		if (psVerificaObjeto(this.inputCpf)) {
			req += ('&cpfCnpj=' + psInputGetVal(this.inputCpf));
		}

		//Se é pessoa física, pega os dados de nome da empresa, do representante e cnpj:
		if (psVerificaObjeto(this.inputNomEmpresa)) {
			req += ('&nome=' + psInputGetVal(this.inputNomEmpresa));
		}
		if (psVerificaObjeto(this.inputNomeRepresentante)) {
			req += ('&responsavel=' + psInputGetVal(this.inputNomeRepresentante));
		}
		if (psVerificaObjeto(this.inputCnpj)) {
			req += ('&cpfCnpj=' + psInputGetVal(this.inputCnpj));
		}
	}

	//Se tem a opção de escolher entre o tipo de pessoa, verifica somente os campos de cada tipo:
	if (this.tipoPessoa == 'PF') {
		//Se é pessoa física, pega os dados de nome e cpf:
		if (psVerificaObjeto(this.inputNome)) {
			req += ('&nome=' + psInputGetVal(this.inputNome).toUpperCase());
		}
		if (psVerificaObjeto(this.inputCpf)) {
			req += ('&cpfCnpj=' + psInputGetVal(this.inputCpf));
		}
	} else {
		//Se é pessoa física, pega os dados de nome da empresa, do representante e cnpj:
		if (psVerificaObjeto(this.inputNomEmpresa)) {
			req += ('&nome=' + psInputGetVal(this.inputNomEmpresa));
		}
		if (psVerificaObjeto(this.inputNomeRepresentante)) {
			req += ('&responsavel=' + psInputGetVal(this.inputNomeRepresentante));
		}
		if (psVerificaObjeto(this.inputCnpj)) {
			req += ('&cpfCnpj=' + psInputGetVal(this.inputCnpj));
		}
	}

	if (psVerificaObjeto(this.inputDataNascimento)) {
		req += ('&dataNascimento=' + psInputGetVal(this.inputDataNascimento));
	}
	if (psVerificaObjeto(this.inputEstadoCivil)) {
		req += ('&estadoCivil=' + psInputGetVal(this.inputEstadoCivil));
	}
	if (psVerificaObjeto(this.inputSexo)) {
		req += ('&sexo=' + psInputGetVal(this.inputSexo));
	}

	//Veículo
	if (psVerificaObjeto(this.inputPossuiVeiculo)) {
		req += ('&possuiVeiculo=' + psInputGetVal(this.inputPossuiVeiculo));
	}

	//Endereço:
	if (psVerificaObjeto(this.inputCep)) {
		req += ('&cep=' + psInputGetVal(this.inputCep));
	}
	if (psVerificaObjeto(this.inputTipoLogradouroHidden)) {
		req += ('&tipoLogradouro=' + psInputGetVal(this.inputTipoLogradouroHidden));
	}
	if (psVerificaObjeto(this.inputLogradouroHidden)) {
		req += ('&logradouro=' + psInputGetVal(this.inputLogradouroHidden));
	}
	if (psVerificaObjeto(this.inputEnderecoNumero)) {
		req += ('&numero=' + psInputGetVal(this.inputEnderecoNumero));
	}
	if (psVerificaObjeto(this.inputEnderecoComplemento)) {
		req += ('&complemento=' + psInputGetVal(this.inputEnderecoComplemento));
	}
	if (psVerificaObjeto(this.inputCidadeHidden)) {
		req += ('&cidade=' + psInputGetVal(this.inputCidadeHidden));
	}
	if (psVerificaObjeto(this.inputEstadoHidden)) {
		req += ('&estado=' + psInputGetVal(this.inputEstadoHidden));
	}
	if (psVerificaObjeto(this.inputLatitude)) {
		req += ('&latitude=' + psInputGetVal(this.inputLatitude));
	}
	if (psVerificaObjeto(this.inputLongitude)) {
		req += ('&longitude=' + psInputGetVal(this.inputLongitude));
	}

	//Contato:
	if (psVerificaObjeto(this.inputTelefone)) {
		req += ('&telefone=' + psInputGetVal(this.inputTelefone));
	}
	if (psVerificaObjeto(this.inputTelefoneCelular)) {
		req += ('&telefoneCelular=' + psInputGetVal(this.inputTelefoneCelular));
	}
	if (psVerificaObjeto(this.inputMeioContato)) {
		var valorMeioContato = psInputGetVal(this.inputMeioContato);

		//Na documentação do serviço da Camada de Centralização não ficava claro se era pra enviar IDs (1 ou 2), ou Texto (E-mail ou Telefone).
		//Inicialmente, o fomr enviava os valores dos IDs, quando na verdade deveria enviar os Textos.
		//Para comnpatibilidade com forms que enviam IDs, converte o Id para Texto:
		if (valorMeioContato == "1") {
			valorMeioContato = "E-mail"
		} else if (valorMeioContato == "2") {
			valorMeioContato = "Telefone"
		}

		req += ('&meioContato=' + valorMeioContato);
	}

	//Produto
	if(campanha != null || idVendedor != null) {
		req += ('&descricaoIndicacao=Lead gerado a partir de um vendedor da campanha Meu Porto Seguro');
	}else if (psVerificaObjeto(this.inputDescricaoIndicacao)) {
		req += ('&descricaoIndicacao=' + psInputGetVal(this.inputDescricaoIndicacao));
	}

	//Status Lead: pega a configuração do form, caso ela exista. 
	//O valor pode ser alterado na validação de Grupo de Corretor.
	//Neste caso, statusLead deve ficar sem valor, para que o lead seja distribuido:
	if (psVerificaObjeto(this.inputStatusLead)) {
		this.statusLead = psInputGetVal(this.inputStatusLead);
	}

	//Se tem Grupo de Corretor, força o valor de statusLead para vazio, sobrescrevendo a configuração do form:
	if (psVerificaObjeto(this.inputGrupoCorretores)) {
		req += ('&grupodeCorretores=' + psInputGetVal(this.inputGrupoCorretores));
		//Força o valor de statusLead, caso esteja configurado errado no form como 'Aceita', o que impediria a distribuição do lead:
		this.statusLead = '';
	}

	//Susep.
	if (psVerificaObjeto(this.inputSusep)) {
		req += ('&susep=' + psInputGetVal(this.inputSusep));
	}

	//Perguntas
	if (psVerificaObjeto(this.inputPergunta1)) {
		req += ('&pergunta1=' + psInputGetVal(this.inputPergunta1));
	}
	if (psVerificaObjeto(this.inputPergunta2)) {
		req += ('&pergunta2=' + psInputGetVal(this.inputPergunta2));
	}
	if (psVerificaObjeto(this.inputPergunta3)) {
		req += ('&pergunta3=' + psInputGetVal(this.inputPergunta3));
	}
	if (psVerificaObjeto(this.inputPergunta4)) {
		req += ('&pergunta4=' + psInputGetVal(this.inputPergunta4));
	}
	if (psVerificaObjeto(this.inputPergunta5)) {
		req += ('&pergunta5=' + psInputGetVal(this.inputPergunta5));
	}
	if (psVerificaObjeto(this.inputPergunta6)) {
		req += ('&pergunta6=' + psInputGetVal(this.inputPergunta6));
	}
	if (psVerificaObjeto(this.inputPergunta7)) {
		req += ('&pergunta7=' + psInputGetVal(this.inputPergunta7));
	}
	if (psVerificaObjeto(this.inputPergunta8)) {
		req += ('&pergunta8=' + psInputGetVal(this.inputPergunta8));
	}
	if (psVerificaObjeto(this.inputPergunta9)) {
		req += ('&pergunta9=' + psInputGetVal(this.inputPergunta9));
	}
	if (psVerificaObjeto(this.inputPergunta10)) {
		req += ('&pergunta10=' + psInputGetVal(this.inputPergunta10));
	}

	//Respostas
	if (psVerificaObjeto(this.inputResposta1)) {
		req += ('&resposta1=' + psInputGetVal(this.inputResposta1));
	}
	if (psVerificaObjeto(this.inputResposta2)) {
		req += ('&resposta2=' + psInputGetVal(this.inputResposta2));
	}
	if (psVerificaObjeto(this.inputResposta3)) {
		req += ('&resposta3=' + psInputGetVal(this.inputResposta3));
	}
	if (psVerificaObjeto(this.inputResposta4)) {
		req += ('&resposta4=' + psInputGetVal(this.inputResposta4));
	}
	if (psVerificaObjeto(this.inputResposta5)) {
		req += ('&resposta5=' + psInputGetVal(this.inputResposta5));
	}
	if (psVerificaObjeto(this.inputResposta6)) {
		req += ('&resposta6=' + psInputGetVal(this.inputResposta6));
	}
	if (psVerificaObjeto(this.inputResposta7)) {
		req += ('&resposta7=' + psInputGetVal(this.inputResposta7));
	}
	if (psVerificaObjeto(this.inputResposta8)) {
		req += ('&resposta8=' + psInputGetVal(this.inputResposta8));
	}
	if (psVerificaObjeto(this.inputResposta9)) {
		req += ('&resposta9=' + psInputGetVal(this.inputResposta9));
	}
	if (psVerificaObjeto(this.inputResposta10)) {
		req += ('&resposta10=' + psInputGetVal(this.inputResposta10));
	}

	//Campos genéricos:
	if (psVerificaObjeto(this.inputGenerico1)) {
		req += ('&generico1=' + psInputGetVal(this.inputGenerico1));
	}

	//Adiciona o statusLEad na resquisição, após configurar o valor conforme a existênvcia dos campos 'grupoCorretor' e 'suesp':
	req += ('&statusLead=' + this.statusLead);

	req += '&callbackName=teste';

	self.psFormPrintDados(req.split('&'));

	return req
}

//Envia os dados para o Siebel:
psForm.prototype.psFormSubmitSiebel = function (req) {
	var self = this;

    // pegando o valor dos campos de nome, cpf
	var nome = $("#ps-frm-nome1").val();
	var cpf = $("#ps-frm-cpf1").val();
	// pegando o valor dos checkboxes existentes
	// var termo = ($("#ps-frm-check-termodeuso").is(":checked") || 
	//				$("#ps-frm-check-termoDeConsentimento1").is(":checked") ||
	//					$("#ps-frm-check-termoDeConsentimento2").is(":checked")).toString();
	
	var termo = $("#ps-frm-check-termodeuso").is(":checked").toString();
	var termoPortoSegInsti = $("#ps-frm-check-termoDeConsentimento1").is(":checked").toString();
	var termoPortoSegRespCivil = $("#ps-frm-check-termoDeConsentimento2").is(":checked").toString();
	// var termoCamposEliseosGentil = $("#ps-frm-check-termoDeConsentimento2").is(":checked").toString();

	var optin = $("#psfrm-OptIn1").is(":checked").toString();

	var siebelURL = this.Homolog ? 'https://aplwebhml/seguradoravirtual/services/IndicacaoCorretorService' : 'https://wwws.portoseguro.com.br/seguradoravirtual/services/IndicacaoCorretorService';

	//Adiciona uma barra de loading abaixo do botão de submit:
	$('<span id="ps-frm-submitLoading" class="ps-ico-loading-bar ps-sm-pad--top"><div class="ps-ico-bar-container"><div class="ps-ico-bar-spinner" style="left: 157.107px;"></div></div></span>').insertAfter('#cta-desk-cotacao1')
	psLib.Loading()
	return $.ajax({
		url: siebelURL,
		jsonp: true,
		dataType: "jsonp",
		data: req,
		jsonpCallback: 'teste',
		beforeSend: function () {
			//Antes de enviar, desabilita o botão de enviar, evitando que o usuário clique várias vezes no botão e faça varios envios, em caso de lentidão ou falha no envio:
			$('.ps-frm-submitBtn', this.formObj).prop("disabled", true);
		},
		success: function (data) {
		    
			//Chamando a função para consumir API de Privacidade
			if($('input[name="ps-frm-tipoPessoa"]').length != 0){
				if($("input[name='ps-frm-tipoPessoa']:checked", this.formObj).val() == 'PF'){
					if(termo == "true" || optin == "true" || termoPortoSegInsti == "true" || termoPortoSegRespCivil == "true") {
						sendDadosPrivacidade(nome, cpf, termo, termoPortoSegInsti, termoPortoSegRespCivil, "false", optin);
					}
				}
			}else{	
				if(termo == "true" || optin == "true"|| termoPortoSegInsti == "true" || termoPortoSegRespCivil == "true") {
					sendDadosPrivacidade(nome, cpf, termo, termoPortoSegInsti, termoPortoSegRespCivil, "false", optin);
				}
			}
		    
			//Habilita o botão de submit:
			$('.ps-frm-submitBtn', this.formObj).prop("disabled", false);

			//Remove o loading de submit:
			$('#ps-frm-submitLoading', this.formObj).remove();

			//Caso o form esteja em algum modal, verifica se tem um modal aberto na página, e fecha:
			if ($('.ps-modal-visible').length > 0) {
				psLib.ModalShowHide(".ps-modal-visible");
			}

			//Abre modal de sucesso após alguns segundos, para não ter incompatibilidade com a chamada da função psLib.ModalShowHide que fecha o modal quando o form está em um:
			setTimeout(function () {
				psLib.ModalShowHide('#ps-modal-frmsucesso', false, true);
			}, 500);

			if (self.Homolog) {
				self.dataLayerEvento = self.inputDataLayerEvento.val() + '_teste';
			}

			//DataLayer de Métricas:
			psDataLayer(self.dataLayerEvento, self.dataLayerNomeForm, self.dataLayerIdProdutoForm, self.dataLayerProdutoForm, self.dataLayerPosicaoForm, data.leadId)

			self.psFormPrintDados([self.dataLayerEvento, self.dataLayerNomeForm, self.dataLayerIdProdutoForm, self.dataLayerProdutoForm, self.dataLayerPosicaoForm, data.leadId]);

			//Verifica se função alternativa existe:
			if (typeof psFormSubmitAlternativo === 'function') {
				//Chamada para uma função customizável, para envio das informações para um sistema específico, caso houver.
				//Passa como parâmetro o ID do Siebel, que é retornado no objeto de sucesso:
				psFormSubmitAlternativo(data.leadId);
			}
		},
		error: function (parsedjson, textStatus, errorThrown) {
			//Mensagem de erro
		}
	});
}

psForm.prototype.psFormPrintDados = function (dados) {
	var self = this;

	if (this.Homolog) {
		console.log(dados);
	}
}

//#######################################
//			Eventos
//#######################################

//Envento de mouse
psForm.prototype.setMouseEvents = function () {
	var self = this;

	//Radio tipo de pessoa:
	this.inputTipoPessoa.click(function () {
		//Define os dados do formulário conforme o tipo de pessoa:
		self.getTipoPessoa();
	})

	//Pesquisa por CEP:
	$(".ps-frm-zipcode", this.formObj).blur(function () {
		//Pega o valor do campo de cep:
		var cep = $(".ps-frm-zipcode", self.formObj).val();

		//Função de pesquisa por CEP:
		self.psFormBuscaDeEndereco(cep);
	})

	//Link 'Não sei meu CEP':
	$('.ps-frm-cepBusca', this.formObj).bind('click', function () {
		//Passa o ID do formulario para o modal de busca de CEP:
		$('#ps-frm-buscaCEP').data('target', self.formObj.attr('id'));
	})

	//Botão de submit:
	$('.ps-frm-submitBtn', this.formObj).bind('click', function () {

		//dataLayer: Pega a posição do CTA no botão de submit do formulário:
		self.dataLayerPosicaoForm = $(this).data('gtm-posicao');

		//dataLayer: Pega o ID do formulario:
		self.dataLayerNomeForm = $(self.formObj).attr('id');

		//dataLayer: Pega o par função+tipo de formulário:
		self.dataLayerEvento = self.inputDataLayerEvento.val();

		//Aguarda alguns segundos para a validação do formulário, então chama  a função de submit:
		self.psFormTimeoutSubmit(self);
	});
}

//Outros eventos
psForm.prototype.setEvents = function () {
	//Atualiza o valor do campo hidden de Tipo de Logradouro com o valor do campo aberto:
	this.inputTipoLogradouroCepGenerico.bind('change', function () {
		this.inputTipoLogradouroHidden.val($(this).val());
	});

	//Atualiza o valor do campo hidden de Logradouro com o valor do campo aberto:
	this.inputEnderecoCepGenerico.bind('change', function () {
		this.inputLogradouroHidden.val($(this).val());
	});
}






/*********************************
Biblioteca de funções básicas
*********************************/

function sendDadosPrivacidade(nome, cpf, termo, termoPortoSegInsti, termoPortoSegRespCivil, termoCamposEliseosGentil,
	optin) { 
	$.ajax({
		type: "POST",
		url: "/backend-portal/web/api/wem/PrivacidadeLGPD",
		data: JSON.stringify({
			nome: nome,
			cpf: cpf,
			termo: termo,
			termoPortoSegInsti: termoPortoSegInsti,
			termoPortoSegRespCivil: termoPortoSegRespCivil,
			termoCamposEliseosGentil: termoCamposEliseosGentil,
			optin: optin
		}),
		dataType: "json",
		contentType: "application/json;charset=UTF-8"
	})
	.done(function (data) {
		console.log("Sucesso no envio de privacidade.");
	})
	.fail(function (data) {
		console.log("Ocorreu um erro ao enviar os dados do privacidade LGPD.");
	});
}

//Pega parametros da URL:
$.psGetUrlParam = function (name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results == null) {
		return null;
	}
	else {
		return results[1] || 0;
	}
}
//Ex.: $.psGetUrlParam('ref');

//Pega dia e horário:
$.psClock = new function () {
	this.now = new Date();
	this.hour = this.now.getHours();
	this.minutes = this.now.getMinutes();
	this.seconds = this.now.getSeconds();
	this.month = this.now.getMonth();
	this.day = this.now.getDate();
	this.year = this.now.getFullYear();
	this.weekday = new Array(7);
	this.weekday[0] = "Sunday";
	this.weekday[1] = "Monday";
	this.weekday[2] = "Tuesday";
	this.weekday[3] = "Wednesday";
	this.weekday[4] = "Thursday";
	this.weekday[5] = "Friday";
	this.weekday[6] = "Saturday";
	this.hourToMinuts = (this.hour * 60) + this.minutes;
}
//Ex.: $.psClock.hour;

//Pega o ID Google
$.psGetIDGoogle = function () {
	var clientId
	ga(function () {
		//Pega todas as instâncias dos rastreadores, independetes se foi criado um nome ou se utiliza o valor de nome padrão:
		var trackers = ga.getAll();
		trackers.forEach(function (tracker) {
			//pega o ID do rastreador
			clientId = tracker.get('clientId');
		});
	});
	return clientId;
}
//Ex.: $.psGetIDGoogle();

//Pesquisa de endereço a partir do CEP:
function psPesquisaDeEndereco(cep, alvo) {
	var self = this;

	//Divide o CEP para enviar para o serviço (tem que ir separado):
	divideCep = cep.split('-');

	pesqCep = divideCep[0];
	pesqCompCep = divideCep[1];

	if (pesqCep != null && pesqCep != "" && pesqCompCep != null && pesqCompCep != "") {

		//mostrarAguarde();

		//monta a requisição com as variáveis 'pesqCep' e 'pesqCompCep'
		var req = "numeroCep=" + pesqCep + "&complementoCep=" + pesqCompCep;

		//Cria objeto de resposta da busca:
		var retornoBusca = new Object();

		$.ajax({
			url: "https://wwws.portoseguro.com.br/vendaonline/rest/guiapostal/buscar-cep",
			dataType: "xml",
			data: req,
			method: "GET",
			beforeSend: function () {
				//Antes de enviar, desabilita o botão de enviar, evitando que o usuário clique várias vezes no botão e faça varios envios, em caso de lentidão ou falha no envio:
			},
			success: function (xml) {
				//Entra no nó "retorno" do XML:
				$(xml).find("retorno").each(function () {
					//Pega o valor do nó "valido"
					valido = $(this).find('valido').text();

					//Se valido = 'true', então CEP existe:
					if (valido == 'true') {
						//Adiciona dados no objeto de resposta:

						//Tipo Logradour + Logradouro + Cidade + Estado:
						retornoBusca.endereco = $(this).find('endereco').text();

						//Tipo logradour. E.x: Rua, Av, Alameda
						retornoBusca.tipoLogradouro = $(this).find('tipoLogradouro').text();
						//Nome da rua: se for CEP Genérico, não tem o nó de Logradouro no XML,e  passa o Logradouro com 'undefined'. Caso não, retorna o endereço:
						retornoBusca.logradouro = $(this).find('logradouro').length > 0 ? $(this).find('logradouro').text() : 'undefined';
						retornoBusca.bairro = $(this).find('bairro').text();
						retornoBusca.cidade = $(this).find('cidade').text();
						retornoBusca.estado = $(this).find('codigoUF').text();

						retornoBusca.status = true;

						//Chama função de sucesso:
						pesquisaDeEnderecoSucesso(retornoBusca, alvo)
					} else {
						//Apaga os dados no objeto de resposta:

						//Tipo Logradour + Logradouro + Cidade + Estado:
						retornoBusca.endereco = '';

						//Tipo logradour. E.x: Rua, Av, Alameda
						retornoBusca.tipoLogradouro = '';
						//Nome da rua:
						retornoBusca.logradouro = '';
						retornoBusca.bairro = '';
						retornoBusca.cidade = '';
						retornoBusca.estado = '';

						retornoBusca.status = false;
						retornoBusca.mensagem = 'CEP não encontrado';

						//Chama função de erro:
						pesquisaDeEnderecoErro(retornoBusca, alvo)
					}
				})
			},
			error: function (erro) {
				//Apaga os dados no objeto de resposta:

				//Tipo Logradour + Logradouro + Cidade + Estado:
				retornoBusca.endereco = '';

				//Tipo logradour. E.x: Rua, Av, Alameda
				retornoBusca.tipoLogradouro = '';
				//Nome da rua:
				retornoBusca.logradouro = '';
				retornoBusca.bairro = '';
				retornoBusca.cidade = '';
				retornoBusca.estado = '';

				retornoBusca.status = false;
				retornoBusca.mensagem = 'Desculpe, a busca está indisponível no momento. <br /> Por favor, volte um pouco mais tarde.';

				//Chama função de erro de conexão:
				pesquisaDeEnderecoErroConexao(retornoBusca, alvo)
			}
		});
	}
}

//Pesquisa de CEP a partir do endereço:
function psPesquisaPorCep(logradouro, cidade, unidadeFederacao, alvo, listaResultado) {
	//Verifica se os campos foram preenchidos:
	if (logradouro != "" && cidade != "" && unidadeFederacao != "") {
		//monta a requisição com as variáveis 'pesqCep' e 'pesqCompCep'
		var req = "logradouro=" + logradouro + "&cidade=" + cidade + "&unidadeFederacao=" + unidadeFederacao;

		//envia os dados de endereço para o serviço de busca
		$.ajax({
			url: "https://wwws.portoseguro.com.br/vendaonline/rest/guiapostal/buscar-logradouro",
			dataType: "xml",
			data: req,
			method: "GET",
			beforeSend: function () { },
			//sucesso
			success: function (xml) {
				//Confere se existe o nó "mensagem"	no XML. Esse nó só aparece em caso de erro:
				if ($(xml).find('mensagem').length == 0) {
					//Busca retornou resultados com sucesso:
					pesquisaPorCepSucesso(xml, alvo, listaResultado);
				} else {
					//Busca retornou erro devido a dados incorretos:
					pesquisaPorCepErro(listaResultado);
				}
			},
			//erro
			error: function () {
				//Erro de conexão com o serviço.
				pesquisaPorCepErroConexao(listaResultado);
			}
		});
	}
}

//Adiciona as opções de tipo de logradouro no select específico:
function psSelectTipoLogradouro(selectTipoLogradouro) {

	var listaTipoLogradouro = [];
	listaTipoLogradouro.push({ value: "", label: "aeroporto" });
	listaTipoLogradouro.push({ value: "AL", label: "alameda" });
	listaTipoLogradouro.push({ value: "", label: "área" });
	listaTipoLogradouro.push({ value: "AV", label: "avenida" });
	listaTipoLogradouro.push({ value: "", label: "campo" });
	listaTipoLogradouro.push({ value: "", label: "chácara" });
	listaTipoLogradouro.push({ value: "", label: "colônia" });
	listaTipoLogradouro.push({ value: "", label: "condomínio" });
	listaTipoLogradouro.push({ value: "", label: "conjunto" });
	listaTipoLogradouro.push({ value: "", label: "distrito" });
	listaTipoLogradouro.push({ value: "", label: "esplanada" });
	listaTipoLogradouro.push({ value: "", label: "estação" });
	listaTipoLogradouro.push({ value: "", label: "estrada" });
	listaTipoLogradouro.push({ value: "", label: "favela" });
	listaTipoLogradouro.push({ value: "", label: "fazenda" });
	listaTipoLogradouro.push({ value: "", label: "feira" });
	listaTipoLogradouro.push({ value: "", label: "jardim" });
	listaTipoLogradouro.push({ value: "", label: "ladeira" });
	listaTipoLogradouro.push({ value: "", label: "lago" });
	listaTipoLogradouro.push({ value: "", label: "lagoa" });
	listaTipoLogradouro.push({ value: "", label: "largo" });
	listaTipoLogradouro.push({ value: "", label: "loteamento" });
	listaTipoLogradouro.push({ value: "", label: "morro" });
	listaTipoLogradouro.push({ value: "", label: "núcleo" });
	listaTipoLogradouro.push({ value: "", label: "parque" });
	listaTipoLogradouro.push({ value: "", label: "passarela" });
	listaTipoLogradouro.push({ value: "", label: "pátio" });
	listaTipoLogradouro.push({ value: "", label: "praça" });
	listaTipoLogradouro.push({ value: "", label: "quadra" });
	listaTipoLogradouro.push({ value: "", label: "recanto" });
	listaTipoLogradouro.push({ value: "", label: "residencial" });
	listaTipoLogradouro.push({ value: "ROD", label: "rodovia" });
	listaTipoLogradouro.push({ value: "R", label: "rua" });
	listaTipoLogradouro.push({ value: "", label: "setor" });
	listaTipoLogradouro.push({ value: "", label: "sítio" });
	listaTipoLogradouro.push({ value: "TV", label: "travessa" });
	listaTipoLogradouro.push({ value: "", label: "trecho" });
	listaTipoLogradouro.push({ value: "", label: "trevo" });
	listaTipoLogradouro.push({ value: "", label: "vale" });
	listaTipoLogradouro.push({ value: "", label: "vereda" });
	listaTipoLogradouro.push({ value: "", label: "via" });
	listaTipoLogradouro.push({ value: "", label: "viaduto" });
	listaTipoLogradouro.push({ value: "", label: "viela" });
	listaTipoLogradouro.push({ value: "", label: "vila" });

	for (var i = 0; i < listaTipoLogradouro.length; i++) {
		//Verifica se o value está vazio:
		if (listaTipoLogradouro[i].value !== "") {
			//Adiciona os options com as valores no select:
			selectTipoLogradouro.append('<option value="' + listaTipoLogradouro[i].value + '">' + listaTipoLogradouro[i].label + '</option>')
		}
	}
}

//Adiciona as opções de produtos no select específico:
function psSelectProdutos(selectProduto) {

	var listaprodutos = [];

	listaprodutos.push({ value: "40", produto: "Alarmes Monitorados" });
	listaprodutos.push({ value: "84", produto: "Aluguel Caução" });
	listaprodutos.push({ value: "78", produto: "Ambulatório ??" });
	listaprodutos.push({ value: "1 ", produto: "Agronegócio" });
	listaprodutos.push({ value: "68", produto: "Azul Seguro Automóvel" });
	listaprodutos.push({ value: "70", produto: "Azul Seguro Residência" });
	listaprodutos.push({ value: "5 ", produto: "Bares e Restaurantes" });
	listaprodutos.push({ value: "21", produto: "Capital de Giro" });
	listaprodutos.push({ value: "44", produto: "Cartão de Crédito Visa" });
	listaprodutos.push({ value: "66", produto: "Cartão de Crédito Mastercard" });
	listaprodutos.push({ value: "3 ", produto: "Concessionárias" });
	listaprodutos.push({ value: "24", produto: "Consórcio - Automóvel" });
	listaprodutos.push({ value: "25", produto: "Consórcio - Imóvel" });
	listaprodutos.push({ value: "19", produto: "Crédito Consignado" });
	listaprodutos.push({ value: "23", produto: "Crédito Pessoal" });
	listaprodutos.push({ value: "18", produto: "Financiamento de Veículos" });
	listaprodutos.push({ value: "9 ", produto: "Garantia Estendida" });
	listaprodutos.push({ value: "10", produto: "Global de Bancos  ??" });
	listaprodutos.push({ value: "87", produto: "Health For Pet" });
	listaprodutos.push({ value: "2 ", produto: "Hotéis e Pousadas" });
	listaprodutos.push({ value: "82", produto: "Investimento" });
	listaprodutos.push({ value: "72", produto: "Itaú Seguro de Automóvel" });
	listaprodutos.push({ value: "74", produto: "Itaú Seguro de Residencia" });
	listaprodutos.push({ value: "80", produto: "Medicina Ocupacional" });
	listaprodutos.push({ value: "57", produto: "Parcerias Corporativas ??" });
	listaprodutos.push({ value: "12", produto: "Perda e Roubo de Cartões" });
	listaprodutos.push({ value: "83", produto: "PortoCap Aluguel" });
	listaprodutos.push({ value: "65", produto: "Portofaz" });
	listaprodutos.push({ value: "29", produto: "Portomed" });
	listaprodutos.push({ value: "36", produto: "Previdência Empresarial" });
	listaprodutos.push({ value: "35", produto: "Previdência Individual" });
	listaprodutos.push({ value: "38", produto: "Previdência Infantil" });
	listaprodutos.push({ value: "41", produto: "Rastreador" });
	listaprodutos.push({ value: "20", produto: "Refinanciamento de Veículos" });
	listaprodutos.push({ value: "86", produto: "Renova Ecopeças" });
	listaprodutos.push({ value: "46", produto: "Reparos Emergenciais" });
	listaprodutos.push({ value: "14", produto: "Responsabilidade Civil" });
	listaprodutos.push({ value: "15", produto: "Riscos de Engenharia" });
	listaprodutos.push({ value: "16", produto: "Riscos Diversos" });
	listaprodutos.push({ value: "31", produto: "Segurança e Saúde Ocupacional ??" });
	listaprodutos.push({ value: "77", produto: "Segurança e Saúde Ocupacional ??" });
	listaprodutos.push({ value: "81", produto: "Segurança do Trabalho" });
	listaprodutos.push({ value: "34", produto: "Seguro de Acidentes Pessoais" });
	listaprodutos.push({ value: "43", produto: "Seguro de Aluguel - Fiança Locatícia" });
	listaprodutos.push({ value: "27", produto: "Seguro de Automóvel" });
	listaprodutos.push({ value: "4 ", produto: "Seguro Condomínio" });
	listaprodutos.push({ value: "7 ", produto: "Seguro de Equipamentos Portáteis" });
	listaprodutos.push({ value: "6 ", produto: "Seguro Empresarial" });
	listaprodutos.push({ value: "8 ", produto: "Seguro de Eventos" });
	listaprodutos.push({ value: "17", produto: "Seguro Garantia" });
	listaprodutos.push({ value: "11", produto: "Seguro Imobiliária" });
	listaprodutos.push({ value: "30", produto: "Seguro Odontológico" });
	listaprodutos.push({ value: "13", produto: "Seguro Residencial" });
	listaprodutos.push({ value: "28", produto: "Seguro Saúde" });
	listaprodutos.push({ value: "61", produto: "Seguro Viagem" });
	listaprodutos.push({ value: "32", produto: "Seguro de Vida Individual" });
	listaprodutos.push({ value: "33", produto: "Seguro de Vida Grupo" });
	listaprodutos.push({ value: "39", produto: "Transportes" });
	listaprodutos.push({ value: "42", produto: "Transportes Monitorados" });
	listaprodutos.push({ value: "37", produto: "Vida Prêmio" });

	for (var i = 0; i < listaprodutos.length; i++) {
		//Verifica se o value está vazio:
		if (listaprodutos[i].value !== "") {
			//Adiciona os options com as valores no select:
			selectProduto.append('<option value="' + listaprodutos[i].value + '">' + listaprodutos[i].produto + '</option>')
		}
	}
}

//Verifica se um objeto existe:
function psVerificaObjeto(objeto) {
	if (objeto.length > 0) {
		return true;
	} else {
		return false;
	}
}

//Retorna o valor conforme o tipo do campo (select, imput text, imput radio, etc...)
function psInputGetVal(objeto) {
	//Verifica se é do tipo 'radio':
	if (objeto.attr('type') == 'radio' || objeto.attr('type') == 'checkbox') {
		//Pega o valor do radio selecionado:
		return objeto.filter(':checked').val();
	} else {
		//Caso seja qualquer outro tipo, pega o valor do campo:
		return objeto.val();
	}
}

//Métricas: função para envio de dados para o data layer do Analytics:
function psDataLayer(evento, nomeForm, idProduto, nomeProduto, posicaoCTA, idSiebel) {
	//dataLayer.push({'event':'sucesso_form','formulario':nomeForm,'produto':nomeProduto, 'posicao':posicaoCTA});
	dataLayer.push({ 'event': evento, 'formulario': nomeForm, 'idProduto': idProduto, 'produto': nomeProduto, 'id': idSiebel, 'retorno': 'sucesso' });
}