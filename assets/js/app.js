$(function(){

	var socket = io();
	socket.on('welcome', function(object){
		console.log( object );
	})

});