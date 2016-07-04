/*
 * Tic tac toe with jQuery - 2009-08-03
 *     see: http://en.wikipedia.org/wiki/Tictactoe
 *			http://pt.wikipedia.org/wiki/Jogo_da_velha
 * 
 * Copyright (c) 2009 Luiz Paulo
 * Site: http://lppjunior.com
 * 
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 */
tictactoe = {
	victoryPos: [[0,1,2],[3,4,5],[6,7,8],
				 [0,3,6],[1,4,7],[2,5,8],
				 [0,4,8],[2,4,6]],
	
	init: function() {
		jQuery("#tictactoe td").click(tictactoe.ckeckItemClick);
		jQuery("#start").click(tictactoe.startGame);
		tictactoe.startGame();
	},
	
	startGame: function () {
		tictactoe.finish     = false;
		tictactoe.turn       = true;
		tictactoe.autoPlayer = (jQuery("input[name=autoInit]:checked").length > 0);
		tictactoe.gamePos    = 0;
		
		jQuery("#tictactoe td").removeClass("cross").removeClass("circle").removeClass("victory");
		jQuery("#tictactoe h2.finalResult").html("&nbsp;");
		
		tictactoe.autoPlay();
	},
	
	ckeckItemClick: function () {
		tictactoe.autoPlayer = true;
		tictactoe.checkItem(this);
	},
	
	checkItem: function (item) {
		if(jQuery(item).hasClass("circle") || jQuery(item).hasClass("cross") || tictactoe.finish) return;
		
		jQuery(item).addClass((tictactoe.turn) ? "circle" : "cross");
		tictactoe.turn = !tictactoe.turn;
		
		tictactoe.gamePos++;
		var result = tictactoe.getStatus();
		
		if(result.finish) {
			tictactoe.finishGame(result);
		} else {
			tictactoe.autoPlay();
		}
	},
	
	getStatus: function () {
		for(i = 0; i < this.victoryPos.length; i++) {
			var result = jQuery(tictactoe.getQuery(i));
			if(result.closest(".circle").length == 3) return { finish: true, i: i, victory: "circle" };
			else if(result.closest(".cross").length == 3) return { finish: true, i: i, victory: "cross" };
		}
		return (tictactoe.gamePos == 9) ? { finish: true, velha: true } : { finish: false };
	},
	
	getMove: function () {
		for(i = 0; i < this.victoryPos.length; i++) {
			var result = jQuery(tictactoe.getQuery(i));
			if(result.closest(".circle").length == 2 && result.closest(".cross").length == 0)
				return { player: 'circle', pos: result };
			else if(result.closest(".cross").length == 2 && result.closest(".circle").length == 0)
				return { player: 'cross', pos: result };
		}
		return undefined;
	},
	
	getQuery: function (i) {
		var query = "";
		for(ii = 0; ii < 3; ii++) {
			query += "#tictactoe td:eq(" + this.victoryPos[i][ii] + "),";
		}
		return query;
	},
	
	finishGame: function (result) {
		this.finish = true;
		
		if(result.velha != undefined)       jQuery("#tictactoe h2.finalResult").text("Tie!");
		else if(result.victory == "circle") jQuery("#tictactoe h2.finalResult").text("Circle is victory!");
		else if(result.victory == "cross")  jQuery("#tictactoe h2.finalResult").text("Cross is victory!");
		
		var v = this.victoryPos[result.i];
		if(v != undefined)
			for(i = 0; i < v.length; i++)
				jQuery("#tictactoe td:eq(" + v[i] + ")").addClass("victory");
	},
	
	autoPlay: function () {
		if(!tictactoe.autoPlayer) return;
		tictactoe.autoPlayer = false;
		
		if(jQuery("[name=level]").val() == "easy") tictactoe.singlePlayer();
		else if(jQuery("[name=level]").val() == "medium") tictactoe.mediumPlayer();
		else if(jQuery("[name=level]").val() == "hard") tictactoe.hardPlayer();
	},
	
	singlePlayer: function () {
		tictactoe.checkItem(jQuery("#tictactoe td:not(.circle):not(.cross)").get(0));
	},
	
	mediumPlayer: function () {
		
		var move = tictactoe.getMove();
		if(move != undefined) {
			a = move;
			tictactoe.checkItem(move.pos.closest("#tictactoe td:not(.circle):not(.cross)").get(0));
		} else {
			var itens = jQuery("#tictactoe td:not(.circle):not(.cross)");
			tictactoe.checkItem(itens.get(Math.floor(Math.random()* itens.length)));
		}
	},
	
	hardPlayer: function () {
		
		var move = tictactoe.getMove();
		if(move != undefined) {
			a = move;
			tictactoe.checkItem(move.pos.closest("#tictactoe td:not(.circle):not(.cross)").get(0));
		} else if(tictactoe.gamePos == 0) {
			tictactoe.checkItem(jQuery("td").get(0));
		} else if(tictactoe.gamePos == 1) {
			var center = jQuery("#tictactoe td:eq(4):not(.circle):not(.cross)");
			
			if(center.length > 0)
				tictactoe.checkItem(center.get(0));
			else
				tictactoe.checkItem(jQuery("td").get(0));
		} else if(tictactoe.gamePos == 2) {
			tictactoe.checkItem(
				jQuery("#tictactoe td:eq(0)," + 
					   "#tictactoe td:eq(2)," + 
					   "#tictactoe td:eq(6)," + 
					   "#tictactoe td:eq(8)"
					).closest("td:not(.circle):not(.cross)").get(0));
		} else if(tictactoe.gamePos == 3) {
			tictactoe.checkItem(
				jQuery("#tictactoe td:eq(1)," + 
					   "#tictactoe td:eq(3)," + 
					   "#tictactoe td:eq(5)," + 
					   "#tictactoe td:eq(7)"
					).closest("td:not(.circle):not(.cross)").get(0));
		} else {
			tictactoe.mediumPlayer();
		}
	}
}
jQuery(document.body).ready(tictactoe.init);