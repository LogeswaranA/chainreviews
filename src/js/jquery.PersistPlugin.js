/*!
 * jQuery IPFS Persist Plugin
 * version: 0.0.1
 * Requires jQuery v1.7.2 or later
 * Project repository: https://github.com/zoernert/jquery.ipfsforms
 * Copyright 2017 Thorsten Zoerner
 * Dual licensed under the LGPL-2.1+ or MIT licenses
 * https://github.com/jquery-form/form#license
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
*/


(function ( $ ) {
	 $.qparams = function(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results==null){
		   return null;
		}
		else{
		   return decodeURI(results[1]) || 0;
		}
	}
	var ipfs = null;
    if(typeof IPFS == "undefined") {		
		$.getScript("https://unpkg.com/ipfs/dist/index.min.js",function(data,textStatus,xhr) {
			ipfs = new Ipfs();		
		});
	} else {
		ipfs = new Ipfs();
	}
    $.loadIPFS = function(hash) {
		$.getJSON("https://ipfs.io/ipfs/"+hash,function(data) {
				data["ipfs-hash"]=hash;
				$.each(data,function(i,v) {
						if(i!="ipfs-hash") {
							$("#"+i).val(v);
							$("#"+i).attr('readonly','readonly');
						}
				});				
		});
	};
	$.fillIPFS = function(hash) {
		$.getJSON("https://ipfs.io/ipfs/"+hash,function(data) {
				data["ipfs-hash"]=hash;
				$.each(data,function(i,v) {
						if(i!="ipfs-hash") {
							$("#"+i).html(v);
							$("#"+i).attr('readonly','readonly');
						}
				});				
		});
	};
    $.fn.persist = function() {
		console.log(this.length);
		var obj={};
		this.each(function() {
			obj[$(this).attr('id')]=$(this).val();
			
		});
		var parent=this;
		ipfs.files.add({path:'/',content:new ipfs.types.Buffer(JSON.stringify(obj),'ascii')}, function (err, files) {
				parent.each(function() {
					if($(this).attr('id')!="ipfs-hash") {
						$(this).attr("ipfs-hash",files[0].hash);
						$(this).attr("readonly","readonly");					
					} else {
						$(this).val(files[0].hash);
						$(this).on('change',function() {
								$.loadIPFS($(this).val());
						});
					}
				});				
		});			
		return this;
    };
 
}( jQuery ));
