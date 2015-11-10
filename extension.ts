import * as vscode from 'vscode'; 

export function activate() { 
	console.log('DNX Watcher: Detected your "global.json" file correctly.');
	var currentSdkVersion=null;
	var path = vscode.workspace.rootPath+"/global.json";
	var getCurrentSdkVersion = function(callback){
		try{
			vscode.workspace.openTextDocument(path).then(function(file){
				var json = JSON.parse(file.getText());
				//Checking current version				
				currentSdkVersion=(json.sdk!=null?json.sdk.version:null);
				console.log('DNX Watcher: Detected SDK version '+currentSdkVersion);
				callback();
			});
			
		}
		catch(e){
			//Watching for malformed global.json
			currentSdkVersion=null;
			console.log('DNX Watcher: Failed to parse or read SDK version: '+e.message);
		}
	};
	
	// Initialize for first time version checking
	getCurrentSdkVersion(function(){});
	
	//Watcher for file changes
	
	var watcher = vscode.workspace.createFileSystemWatcher(path);		
	watcher.onDidChange(function(e){		
		console.log('DNX Watcher: "global.json" file changed');
		var localCurrentSdkVersion = currentSdkVersion;
		getCurrentSdkVersion(function(){
			if(localCurrentSdkVersion != currentSdkVersion){
				vscode.commands.executeCommand("o.restart").then(function(){
					console.log('DNX Watcher: Omnisharp restarted');
				});				
			}
		});					
	});	
}