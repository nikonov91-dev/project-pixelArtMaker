'use strict';

//добавить размер кисти
//добавить растяжение холста
//добавить сохранение в жпг 
//добавить авторизацию гугл
//убрать пофиксить заливку при рисовании линии чтобы заливалось все на пути а не при определенной скорости движения мышки

var inputHeightValue = 'no height value'; 	// test value
var inputWidthValue = 'no width value'; 	// test value
var colorValue = '#000';				//test value nneeded to ivoke counters for counting rows and coloms
var historyColorActionArray = [[]];
let newColorValue;
var historyActualArray = 0;
var historyIsUndoHappened = false;
var numberToRemove = 1;

	

$(document).ready(function(){ 	
				//test value
	const canvasTable = $('#pixel_canvas');
	const canvasTableRow = $('#pixel_canvas tr'); 
	const htmlTDSting = '</td><td>';							//waits until the whole doc is downloaded


pickColor();
selectPixels();
advancedModeListener();

	$('#sizePicker').submit(function(event){		//assignes size values to the variables
		event.preventDefault(); // prevent page refresh
		$('tr').remove();
		inputHeightValue = $('#input_height').val();
		inputWidthValue = $('#input_width').val();
		buildPixels();
		historyEditor.arrayFillwithEmptyCells(0); // invokes function to build pixels
	});

	function buildPixels(){ 						//takes input size value and creates pixels
			for(var i = 1; i <= inputHeightValue; i++){
				canvasTable.append('<tr></tr>');
				for(var j = 1; j <= inputWidthValue; j++){
					$('#pixel_canvas tr:last').append('<td></td>'); // it works
					//var canvasTableRow = $('#pixel_canvas tr');        it doesnt
					//canvasTableRow.filter('last').append('<td></td>'); together
				}
			}
		}
	function pickColor(){							//takes color value from the canvas
		$('#colorPicker').on('change', function(){
			colorValue = $(this).val();
		});
	}
	function selectPixels(){						//get the pixel selected and access to its css property
		canvasTable.hover(function(){
			$(this).css('cursor','pointer');
		});

		canvasTable.on('mousedown','td', function(event){
			event.preventDefault();
			canvasTable.on('mousemove','td', function(){
				console.log('runs');
				$(this).css('background-color',colorValue);
			})
		})
				canvasTable.on('mouseup', function(){
					canvasTable.off('mousemove');
					historyEditor.stepInitiator();
					//баг - сабмитит пустые ячейки (как и должно быть) в масссив из предыдущиего круга (до сабмита)
					$('#stepBack').prop({disabled: false});
					$('#stepForward').prop({disabled: false});
					console.log('the step is stored')
				})
	}

	// herefrom the advanced PAM
	function advancedModeListener(){			//turn the advanced mode on by radio listener
			$('input:radio[id="advanced"]').on('click', function(){	//to turn the listen of correction buttons on
				livePixelEditorListener();
				$('form#tableCorrection').slideDown();
				$('input:radio[id="genuine"]').on('click', function(){
					$('form#tableCorrection').off('click');
					$('form#tableCorrection').slideUp();
				});
			});
	};
// here need to be implemented the get the click from click listener and 
//invoking the proper method

	function livePixelEditorListener(){		 //listens clicks to understand 
		$('form#tableCorrection').on('click', 'input', function(event){
			var inputID = $(this).attr('id');
			switch(inputID){
				case 'addTop' : 
					tableRowColumnEditor.addRowTop();
					break;
				case 'addRight' : 
					tableRowColumnEditor.addColumnRight();
					break;
				case 'addBottom' : 
					tableRowColumnEditor.addRowBottom();
					break;
				case 'addLeft' : 
					tableRowColumnEditor.addColumnLeft();
					break;
				case 'removeTop' : 
					historyEditor.arrayRemoveTopRowRecorder(historyActualArray);
					tableRowColumnEditor.removeRowTop();
					break;
				case 'removeRight' : 
					tableRowColumnEditor.removeColumnRight();
					break;
				case 'removeBottom' : 
					historyEditor.arrayRemoveBottomRowRecorder();
					tableRowColumnEditor.removeRowBottom();
					break;
				case 'removeLeft' : 
					tableRowColumnEditor.removeColumnLeft();
					break;
				case 'stepBack' : 
					historyEditor.isStepBackCheck(true);
					break;
				case 'stepForward' : 
					historyEditor.isStepBackCheck(false);//check is it clicked step Back. If true - it is, if false it is Step Forward
														// it's just counts the actual color array back in history or forward
					break;

				default: alert('something went wrong. Step: switchID')
			}
		});
	};

	var tableRowColumnEditor = {
		addRowTop : function(){
			canvasTable.prepend(this.rowRecounting());
			inputHeightValue++;
		},
		addRowBottom : function(){
			canvasTable.append(this.rowRecounting());
			inputHeightValue++;
		},
		addColumnRight : function(){
			canvasTable.each(function (){
				canvasTable.children('tr').append(htmlTDSting);
				inputWidthValue++;
			});
		},
		addColumnLeft : function(){
			canvasTable.each(function(){
				canvasTable.children('tr').prepend(htmlTDSting);
				inputWidthValue++;
			})
		},
		rowRecounting : function(){
			var htmlReturnString = '<tr><td>';
			for (var i = 1; i < inputWidthValue; i++){
				htmlReturnString += htmlTDSting;
			}
			return (htmlReturnString += '</td></tr>');
		},
		removeRowTop : function(){
			if (inputHeightValue > 1) {
				canvasTable.children('tr').first().remove();
				inputHeightValue--;
				} else {
					return (alert('Canvas cannot have zero height'))
					};
		},
		removeRowBottom : function(){
			if (inputHeightValue > 1) {
				canvasTable.children('tr').filter(':last').remove();
				inputHeightValue--;
				}else { 
					return alert('Canvas cannot have zero height');
					};
		},
		removeColumnRight : function(){
			if (inputWidthValue > 1) {
				canvasTable.children('tr').each(function (){
					$(this).children('td').filter(':last').remove();
				});
				inputWidthValue--;
				} else { 
					return alert('Canvas cannot have zero width')
					};			
		},
		removeColumnLeft : function(){
			if (inputWidthValue > 1) {
				canvasTable.children('tr').each(function (){
					$(this).children('td').filter(':first').remove();
				});
				inputWidthValue--;
				} else { 
					return alert('Canvas cannot have zero width')
					};			
		}
	}

	var historyEditor = {
		//accepted arrangments: array[state] - the state mean the history step's number

		undoStep : function(state){
			// boolean parameter 'state' defines the is pressed Step Back (true), or Step Forward (false)
			let currentArray = historyColorActionArray[historyActualArray];
			let whatMethod = historyColorActionArray[historyActualArray][historyColorActionArray[historyActualArray].length-1][1];
			console.log(historyActualArray);
			//below IF checks if the history array is a transformating array?
			if (currentArray[currentArray.length-1][0] === 'meta'){
				historyIsUndoHappened = true;
				switch (whatMethod) {
					case 'removeTopRow' : 
						this.stepBackRemoveTopRowAssembler(state);
						break;
					/*case 'removeBottomRow' : 
						this.undoArrayRemoveBottomRowAssembler(state);
						break;*/
					case 'removeTopRow' : 
						this.stepForwardRemoveTopRowAssembler(state);
						break;/*
					case 'removeBottomRow' : 
						this.forwardArrayRemoveBottomRowAssembler(historyActualArray);
						break;*/
					default: console.log('something went wrong, step: UndoSwitch');
				}
			} else {
			this.cellColorChange(historyActualArray);
			}
		},
		cellColorChange : function(state){
			let rowIndex, cellIndex, actualColorValue;
			historyIsUndoHappened = true;
			$('tr').each(function (){
				rowIndex = $(this).index();
				$(this).children('td').each(function (){
					cellIndex = $(this).index();
					actualColorValue  = historyColorActionArray[state][rowIndex][cellIndex];
					$(this).css('background', actualColorValue)
				});
			});
		},
		//below a function to read canvas cell color and write to array cell
		arrayColorAssign : function(state){
			for (let i = 0;  i < inputHeightValue; i++) {
				 historyColorActionArray[state].push([]);
				for (let j = 0; j < inputWidthValue; j++){
					 historyColorActionArray[state][i].push([]);
					newColorValue = canvasTable.find('tr:nth-child(' + (i+1) + ") td:nth-child(" + (j+1) + ")").css('background-color');
					//below checkup to minimize memory consumption and fill all the array cells with 0 values
					if (newColorValue !== "rgba(0, 0, 0, 0)"){
						historyColorActionArray[state][i][j] = newColorValue;
					} else { historyColorActionArray[state][i][j] = ''};
					
				}
			}
		},
		arrayFillwithEmptyCells : function(state){
			for (let i = 0;  i < inputHeightValue; i++) {
				 historyColorActionArray[state].push([]);
				for (let j = 0; j < inputWidthValue; j++){
					historyColorActionArray[state][i].push([]);
					historyColorActionArray[state][i][j] = '';
				}
			}
		},
		stepInitiator : function(){
			//выполнить проверку на удаление лишних массивов полсе операции undo
			//below the checkup for the array length with next poping legacy sub arrays
			if (historyIsUndoHappened){
				historyEditor.arrayCutOff();
			}
			//below the setting up the limite of history array number. 
			//at this moment the maximum steps stored is 4
			if (historyColorActionArray.length < 4){
				historyColorActionArray.unshift([]);
				this.arrayColorAssign(0);
			} else {
				historyColorActionArray.pop();
				this.stepInitiator();
			}		
		},
		isStepBackCheck : function(state){//check is it clicked step Back. If true - it is, if false it is Step Forward
														// it's just counts the actual color array back in history or forward
			//ниже костыль с ИФ чтобы шаг назад сох
			let isPreviousClickOccured = historyColorActionArray[historyActualArray][historyColorActionArray[historyActualArray].length-1][3];
			let currentArray = historyColorActionArray[historyActualArray];
			if (currentArray[currentArray.length-1][0] !== 'meta')
				{ 
				console.log(currentArray[currentArray.length-1][0]);
				//below the check helps cound up/down the current array and to enable/disable Step Back and Forward buttons
				this.doCount(state);
				} 
			else if (state === true && isPreviousClickOccured === true){ // it's STEP BACK
				historyColorActionArray[historyActualArray][historyColorActionArray[historyActualArray].length-1][3] = isPreviousClickOccured === false ? true : false; 
				historyActualArray++;
				this.doCount(state);
			}
			 else if (state === true && isPreviousClickOccured === false){
					historyColorActionArray[historyActualArray][historyColorActionArray[historyActualArray].length-1][3] = isPreviousClickOccured === false ? true : false; 
				}
			else if (state === false && isPreviousClickOccured === true){ // it's STEP FORWARD
					historyColorActionArray[historyActualArray][historyColorActionArray[historyActualArray].length-1][3] = isPreviousClickOccured ? false : true; 
					historyActualArray--;
					this.doCount(state);
				} else if (state === true && isPreviousClickOccured === false){
					historyColorActionArray[historyActualArray][historyColorActionArray[historyActualArray].length-1][3] = isPreviousClickOccured ? false : true; 
			} else {console.log('something wrong. step: stepForwardRemoveTopRowAssembler')};
			this.undoStep(state);
		},
		doCount : function(state){
			if(state){
					if (historyActualArray < historyColorActionArray.length-1){
						++historyActualArray; 
					} else { //$('#stepBack').prop({disabled: true});//- --------не работает 1!!
						console.log('добавить Елсе делающий кнопку неактивной')}
				} else {
					if (historyActualArray > 0){
						--historyActualArray;
					} else { //$('#stepForward').prop({disabled: true});
						console.log('добавить Елсе делающий кнопку неактивной')}
					}
		},
		arrayCutOff : function(){
			//it cuts the history arrays in case we press 'Undo - undo - undo' and then we do somehow (paint or remove/add), 
			//so we interrupt normal history flow . This function avoid that messing the history up
			if (historyActualArray !== 0){
				historyColorActionArray.shift(historyColorActionArray[historyActualArray-1]);
				historyActualArray--;
				return this.arrayCutOff();
			}
			historyIsUndoHappened = false;
		},
		arrayRemoveTopRowRecorder : function(state){
				if (historyColorActionArray[state][historyColorActionArray[state].length-1][0] !== 'meta'){
					historyColorActionArray[state].push(['meta', 'removeTopRow', numberToRemove,false]);
					//4th item in array[state][subarray] - is the check whether has been clicked the SB button or not
				}


		},
		arrayRemoveBottomRowRecorder : function(state){
			if (historyColorActionArray[state][historyColorActionArray[state].length-1][0] !== 'meta'){
				historyColorActionArray[state].push(['meta', 'removeBottomRow', numberToRemove,false]);
				//4th item in array[state][subarray] - is the check whether has been clicked the SB button or not
			}
		},
		undoCellColorChange : function(state){
			//использовать одну фукнцию вместо CellColorChange и undoCellColorChange вызывающую разнве методы 

			//вставить условие на уменьшение циклов применения цвета изза определенного количества удаленных-возвращенных ячеек
			let rowIndex, cellIndex, actualColorValue;
			$('tr').each(function (){
				rowIndex = $(this).index();
				$(this).children('td').each(function (){
					cellIndex = $(this).index();
					actualColorValue  = historyColorActionArray[state][rowIndex][cellIndex];
					$(this).css('background', actualColorValue)
				});
			});
			
		},
		stepBackRemoveTopRowAssembler : function(state){ // state - what is the button pressed Back or Forward?
			//устроить еще рекурсию или другой способ множественного восстановления строк при их удалении
			//}	
			tableRowColumnEditor.addRowTop();
			this.undoCellColorChange(historyActualArray);
		},
		stepForwardRemoveTopRowAssembler : function(state){
			let isPreviousClickOccured = historyColorActionArray[historyActualArray][historyColorActionArray[historyActualArray].length-1][3];
			
			tableRowColumnEditor.removeTopRow();
		}
	};
		

	

});

/*backupsss -------------------------------

function stepCounter(state){
		var variable = 0;
		if (state){
			return function(){
				if (variable < historyColorActionArray.length){
					return variable++;		
				}
			}	
		} else {
			return function(){
				if (variable > 0){
					return variable--;	
				}
			}
		}
		alert(variable);
	}

function livePixelHistoryListener(){
		//canvasTable.on('click', 'td', function(){
			historyColorActionArray[0] = historyColorActionArray[1].slice();
			if (historyColorActionArray[0][0] !== undefined){
				justInitiatedArray = false;
			}
			historyColorActionArray[1].length = 0;
			//if ($(this).css('background-color') === emptyCellColorValue) 
			
			for (let i = 0;  i < inputHeightValue; i++) {
				historyColorActionArray[1].push([]);
				for (let j = 0; j < inputWidthValue; j++){
					historyColorActionArray[1][i].push([]);
					// добавить проверку пустого пикселя и запись в массив истории нулевого значения
					newColorValue = canvasTable.find('tr:nth-child(' + (i+1) + ") td:nth-child(" + (j+1) + ")").css('background-color');
					historyColorActionArray[1][i][j] = newColorValue;
					if (justInitiatedArray){
						historyColorActionArray[0][i][j] = emptyCellColorValue;
					}
				}
			}
		//canvasTable.off('click', 'td');
		//});
	};

*/