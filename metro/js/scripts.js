$( document ).ready(function() {
	
	$('.tile').on('click', function(){
			if($(this).hasClass('selected'))
			{
				$(this).removeClass('selected');
			}
			else
			{
				if(!$(this).hasClass('unselectable')) $(this).addClass('selected');
			}
	});
	
	$('.counter').on('click', function(){
			var currentValue = parseInt($(this).find('.badge').html());
			currentValue++;
			$(this).find('.badge').html(currentValue)
	});
	
	$('#btnAdvanceSearch').on('click', function(){
			$('#mnuAdvanceSearch').toggle();
	});
	
	$('#btnPrint, #liPrint').on('click', function(){
		window.print();
	});
	
	$('#liExit').on('click', function(){
		$.Dialog({
			shadow: true,
			overlay: true,
			draggable: true,
			icon: '<span class="icon-blocked"></span>',
			title: 'Invalid operation',
			width: 500,
			padding: 10,
			content: 'Under construction.'
		});
	});	
	
});