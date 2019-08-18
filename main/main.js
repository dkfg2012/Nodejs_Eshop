$(document).ready(function(){

	/*main adv screen*/
	$('.left-slider-button').on('click',function(){
		var currentImg = $(".active");
		var prevImg = currentImg.prev();
		var lastImg = $('.last');
		if(prevImg.length){
			currentImg.removeClass('active');
			prevImg.addClass('active');
		}else if(prevImg.length == 0){
			currentImg.removeClass('active');
			lastImg.addClass('active');
		}
	})

	$('.right-slider-button').on('click',function(){
		var currentImg = $(".active");
		var nextImg = currentImg.next();
		var firstImg = $('.first')
		if(nextImg.length){
			currentImg.removeClass('active');
			nextImg.addClass('active');
		}else if(nextImg.length == 0){
			currentImg.removeClass('active');
			firstImg.addClass('active');
		}
	})

	setInterval(function(){
		var currentImg = $(".active");
		var nextImg = currentImg.next();
		var firstImg = $('.first')
		if(nextImg.length){
			currentImg.removeClass('active');
			nextImg.addClass('active');
		}else if(nextImg.length == 0){
			currentImg.removeClass('active');
			firstImg.addClass('active');
		}
	}, 3000);


});

