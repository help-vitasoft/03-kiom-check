'use babel';
const fs = require('fs');
YAML = require('yamljs');

export default class VitaConfig {
	constructor(path){
		this.load(path);
	}
	load(path){
		if(!fs.existsSync(path))throw('파일을 읽을 수 없습니다.:'+path);
		var data=fs.readFileSync(path,'utf8');
  	  	var o = YAML.parse(data);
		if(o != undefined){
			this.ORginal=o.contents.service_all.ORginal;
			this.Ancient_Korean=o.contents.service_all.Ancient_Korean;
			this.EXplanation=o.contents.service_all.EXplanation;
			this.KOrean=o.contents.service_all.KOrean;
			this.ENglish=o.contents.service_all.ENglish;
		}
	}
	getOrginal(){
		return this.ORginal;
	}
	getAncientKorean(){
		return this.Ancient_Korean;
	}
	getExplanation(){
		return this.EXplanation;
	}
	getKorean(){
		return this.KOrean;
	}
	getEnglish(){
		return this.ENglish;
	}
}
