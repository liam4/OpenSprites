OpenSprites.models = {};

OpenSprites.models.BaseModel = function(_target){
	var modelObj = {};
	modelObj._target = _target;
	modelObj.loadJson = function(json){
		
	};
	return modelObj;
};

OpenSprites.models.AssetList = function(_target){
	var modelObj = OpenSprites.models.BaseModel(_target); // attempting a java-class-like structure
	modelObj.loadJson = function(json){
		modelObj._target.html("");
		console.log(modelObj._target);
		for(var i = 0;i<json.length;i++) {
			var html = $("<div>").addClass("file").addClass(json[i].type).attr("data-name", json[i].name).attr("data-utime", json[i].upload_time);
			if(json[i].type == "image"){ 
				html.css("background-image", "url("+OpenSprites.domain + json[i].url+")");
			}
        		modelObj._target.append(html);
		}
	};
	return modelObj;
};

OpenSprites.models.SortableAssetList = function(_target){
	var modelObj = OpenSprites.models.BaseModel(_target);
	
	var listing = $('<div class="assets-list">Loading...</div>');
	var subModel = OpenSprites.models.AssetList(listing);
	function loadAssetList(sort, max, type){
		$.get(OpenSprites.domain + "/site-api/list.php?sort="+sort+"&max="+max+"&type="+type, function(data){
			subModel.loadJson(data);
		});
	}
	
	var orderBy = {
		popularity: "Popularity",
		alphabetical: "A-Z",
		newest: "Newest",
		oldest: "Oldest"
	};
	var types = {
		all: "All",
		image: "Costumes",
		sound: "Sounds",
		script: "Scripts"
	};
	
	var currentSort = "popularity";
	var currentType = "all";
	loadAssetList(currentSort, 15, currentType);
	
	var buttonSetClick = function(){
		$(this).parent().find("button").removeClass("selected");
		$(this).addClass("selected");
	};
	
	var sortButtons = $('<div class="sortby toggleset">Sort by: </div>');
	for(key in orderBy){
		var button = $("<button>").attr("data-for", key).click(function(){
			currentSort = key;
			loadAssetList(currentSort, 15, currentType);
		}).click(buttonSetClick);
		button.text(orderBy[key]);
		if(key == currentSort) button.addClass("selected");
		sortButtons.append(button);
	}
	var typesButtons = $('<div class="types toggleset">Types: </div>');
	for(key in types){
		var button = $("<button>").attr("data-for", key).click(function(){
			currentType = key;
			loadAssetList(currentSort, 15, currentType);
		}).click(buttonSetClick);
		button.text(types[key]);
		if(key == currentType) button.addClass("selected");
		typesButtons.append(button);
	}
	
	_target.html('').append(sortButtons).append(typesButtons).append("<br/>").append(listing);
	
	return modelObj;
};
