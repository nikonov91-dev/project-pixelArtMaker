'use strict';
var inputHeightValue = 'no height value'; 	// test value
var inputWidthValue = 'no width value'; 	// test value
var colorValue = '#000'; 					//test value
var isAdvancedActive = false;				//test value nneeded to ivoke counters for counting rows and coloms
$(document).ready(function(){ 						//waits until the whole doc is downloaded
	$('#sizePicker').submit(function(event){		//assignes size values to the variables
		event.preventDefault(); // prevent page refresh
		$('tr').remove();
		inputHeightValue = $('#input_height').val();
		inputWidthValue = $('#input_width').val();
		buildPixels(); // invokes function to build pixels
	});

	function buildPixels(){ 						//takes input size value and creates pixels
		for(var i = 1; i <= inputHeightValue; i++){
			$('#pixel_canvas').append('<tr></tr>');
			for(var j = 1; j <= inputWidthValue; j++){
				$('table tr:last').append('<td></td>');
			}
		};
		return;
	};
	function pickColor(){							//takes color value from the canvas
		$('#colorPicker').on('change', function(){
			colorValue = $(this).val();
		});
	}
	function selectPixels(){						//get the pixel selected and access to its css property
		$('#pixel_canvas').hover(function(){
			$(this).css('cursor','pointer');
		});
		$('#pixel_canvas').on('click','td', function(){
			$(this).css('background',colorValue);
		});
	}
pickColor();
selectPixels();
advancedModeListener();

	// herefrom the advanced PAM
	function advancedModeListener(){			//turn the advanced mode on by radio listener
			$('input:radio[id="advanced"]').on('click', function(){	//to turn the listen of correction buttons on
				livePixelCorrectorListener();
					$('form#tableCorrection').slideDown();
				alert('the mode under testing');
				$('input:radio[id="genuine"]').on('click', function(){
					$('form#tableCorrection').off('click');
					isAdvancedActive = false;
					$('form#tableCorrection').slideUp();
				});
			});
	};

	function livePixelCorrectorListener(){		 //listens clicks to understand 
		$('form#tableCorrection').on('click', 'input', function(event){
			isAdvancedActive = true; // to add the pixel line
			livePixelCorrector();

// here need to be implemented the get the click from click listener and 
//invoking the proper method
		});
	};

	function livePixelCorrector(){
		alert('testing message of corrector');
		//var idTopAdd = $('#tableCorrection input:button[id="topAdd"]');

	};
});

