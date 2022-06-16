// inicializamos un array de arrays con la preguntas del juego. 
var questions = [
	[
		"Historia",
		"¿Cuándo se creó la ONU?",
		"1946",
		"1945",
		"1944",
		"1947",
		1
	],
	[
		"Ciencia y naturaleza",
		"¿Existe un mes en el que puede haber menos de 4 fases lunares. ¿Cuál es?",
		"Julio",
		"Octubre",
		"Febrero",
		"Abril",
		2
	],
	[
		"Cine/Espectáculo",
		"¿Cómo se llama la ciudad en la que vivía el Mago de Oz?",
		"Esmeralda",
		"Jade",
		"Diamante",
		"Baldosa",
		0
	],
	[
		"Arte y Literatura",
		"¿De dónde son originarios los haikus?",
		"China",
		"Corea",
		"Japón",
		"Tailandia",
		2
	],
	[
		"Geografía",
		"¿Qué río es el más caudaloso del planeta?",
		"Nilo",
		"Ganges",
		"Indo",
		"Amazonas",
		3
	],
	[
		"Deportes",
		"¿En qué país es más popular el juego de los dardos?",
		"Gran Bretaña",
		"España",
		"Francia",
		"Estados Unidos",
		0
	],
];

// Aquí utilizamos UnderscoreJS para generar un template de pregunta.
var questionTemplate = _.template(" \
	<div class='card question' id='colores<%= index %>'><span class='title'><%= title %></span>\
	<p id='preguntas'><span class='question'><%= question %></span></p>\
      		<ul class='options'> \
        		<li> \
          			<input type='radio' name='question[<%= index %>]' value='0' id='q<%= index %>o1'> \
          			<label for='q<%= index %>o1' id='opColores<%= index %>'><%= a %></label> \
        		</li> \
        		<li> \
          			<input type='radio' name='question[<%= index %>]' value='1' id='q<%= index %>o2'> \
          			<label for='q<%= index %>o2' id='opColores<%= index %>'><%= b %></label> \
        		</li> \
        		<li> \
          			<input type='radio' name='question[<%= index %>]' value='2' id='q<%= index %>o3'> \
          			<label for='q<%= index %>o3' id='opColores<%= index %>'><%= c %></label> \
        		</li> \
        		<li> \
          			<input type='radio' name='question[<%= index %>]' value='3' id='q<%= index %>o4'> \
          			<label for='q<%= index %>o4' id='opColores<%= index %>'><%= d %></label> \
        		</li> \
      		</ul> \
    </div> \
    ");

// Definimos las variables de estado del juego y los valores iniciales (como el tiempo de respuesta de cada pregunta).
var points,
	pointsPerQuestion,
	currentQuestion,
	questionTimer,
	timeForQuestion = 8, // segundos
	timeLeftForQuestion,
	contadorFallos; //añadimos una variable para contar los fallos

// Manipulacion de elementos con JQuery.
$(function () {

	// Uso de jQuery para escuchar el evento click del botón de Comenzar y Volver a jugar.
	$('button.start').click(start); //funcion que busca elementos
	$('.play_again button').click(restart);

	// La función restart inicializa los valores de las variables de estado del juego.
	function restart() {
		points = 0; //reseteamos las variables
		pointsPerQuestion = 1;
		currentQuestion = 0;
		contadorFallos = 0;
		timeLeftForQuestion = timeForQuestion;
		// Se oculta la pantalla de finalizar y un mensaje que dice "Se acabó el tiempo".
		$('.finish.card').hide();
		$('div.start').show();
		$('.fallos').hide();

		generateCards();
		//updateTime();
		updatePoints();
	}

	//  La función start se ejecuta cuando el jugador hace click en comenzar.
	function start() {
		$('div.start').fadeOut(200, function () { //funcion de ocultacion
			moveToNextQuestion(); //cuando termina busca la funcion siguiente pregunta y la ejecuta
		});
	}

	// Esta es una de las funciones clave del juego, encargada de generar las preguntas. 
	function generateCards() {
		$('.questions').html('');
		for (var i = 0; i < questions.length; i++) {
			var q = questions[i];
			var html = questionTemplate({
				title: q[0],
				question: q[1],
				index: i,
				a: q[2],
				b: q[3],
				c: q[4],
				d: q[5],
				//e: q[5]
			});
			$('.questions').append(html);
		};

		// Indicamos que nos interesa el evento change de los inputs dentro de los elementos con clase question y card (cada una de las preguntas).
		$('.question.card input').change(optionSelected);
	}

	// Esta función cambia el estado del juego para pasar de una pregunta a la siguiente.
	function moveToNextQuestion() {
		currentQuestion += 1;
		if (currentQuestion > 1) {
			$('.question.card:nth-child(' + (currentQuestion - 1) + ')').hide();
		}
		// se utiliza para cambiar propiedades de un elemento como una funcion
		//document.getElementById('colores').style.backgroundColor = "yellow";

		// Se muestra la siguiente pregunta.
		showQuestionCardAtIndex(currentQuestion); //muestra las preguntas y las añade
		//setupQuestionTimer();
	}

	// Esta función inicializa el temporizador para responder una pregunta.
	/*function setupQuestionTimer() {
		if (currentQuestion > 1) {
			clearTimeout(questionTimer);
		}
		timeLeftForQuestion = timeForQuestion;

		// Cada 1 segundo, nuestro temporizador llamará a la función countdownTick(). 
		questionTimer = setTimeout(countdownTick, 1000);
	}*/

	// Mostramos la tarjeta de pregunta correspondiente al índice que la función recibe por parámetro.
	function showQuestionCardAtIndex(index) { // staring at 1
		var $card = $('.question.card:nth-child(' + index + ')').show();
	}

	// La función countdownTick() se ejecuta cada un segundo, y actualiza el tiempo restante para responder en la pantalla del jugador.
	/*function countdownTick() {
		timeLeftForQuestion -= 1;
		updateTime();
		if (timeLeftForQuestion == 0) {
			return finish();
		}
		questionTimer = setTimeout(countdownTick, 1000);
	}*/

	// Actualiza el tiempo restante en pantalla, utilizando la función html(). 
	/*function updateTime() {
		$('.countdown .time_left').html(timeLeftForQuestion + 's');
	}*/

	// Actualiza los puntos en pantalla.
	function updatePoints() {
		var punto = ' punto';
		if (points !=1) {
			punto = ' puntos';
		}
		$('.points span.points').html(points + punto);
	}

	// Esta función se ejecuta cuando el jugador escoge una respuesta.
	function optionSelected() {
		var selected = parseInt(this.value);
		var correct = questions[currentQuestion - 1][6];

		if (selected == correct) {
			points += pointsPerQuestion;
			updatePoints();
			correctAnimation();
		} else {
			wrongAnimation();
			contadorFallos++;
		}

		if (currentQuestion == questions.length || contadorFallos == 3) {
			clearTimeout(questionTimer);
			return finish();
		}
		moveToNextQuestion();
	}

	// Animación de respuesta correcta e incorrecta.
	function correctAnimation() {
		animatePoints('right');
	}

	// Animación de respuesta correcta e incorrecta.
	function wrongAnimation() {
		animatePoints('wrong');
	}

	// Esta función anima el puntaje en pantalla.
	function animatePoints(cls) {
		$('header .points').addClass('animate ' + cls);
		setTimeout(function () {
			$('header .points').removeClass('animate ' + cls);
		}, 500);
	}

	// Cuando el juego termina, esta función es ejecutada.
	function finish() {
		document.getElementById("final").style.backgroundImage="url('ganador.gif')";
		document.getElementById("final").style.color="white";
		if (contadorFallos == 3) {
			document.getElementById("final").style.backgroundImage="url('eliminado2.jpg')";
			document.getElementById("final").style.color="black";
			document.getElementById("final").style.backgroundSize="cover";
			$('.fallos').show();
		}
		var punto = ' punto';
		if (points !=1) {
			punto = ' puntos';
		}
		$('p.final_points').html(points + punto);
		$('.question.card:visible').hide();
		$('.finish.card').show();
	}

	// 24
	restart();

});