'use babel';
import Service from './Service';
const fs = require('fs');

export default class VitaService {
	//인자로 받은 파일경로를 열어서 컨텐츠 겍체로 저장
	constructor(path){
		this.path=path;
		this.services=[];
		this.setServices();
	}
	//컨텐츠 갯수를 리턴
	getCount(){
		return this.services.length;
	}
	getServices(){
		return this.services;
	}
	isVolumeId(pare){
		if(pare.length != 2)throw("잘못된 값 입니다."+pare.toString())
		var regex="- vomlue_id";
		return pare[0] == regex;
	}
	//파일을 읽어서 서비스 객체를 만들어 배열로 저장
	setServices(){
		if(!fs.existsSync(this.path))throw('파일을 읽을 수 없습니다.:'+this.path);
		let vitaService=this;
		var data=fs.readFileSync(this.path,'utf8');
		var lines=data.split(/\r\n|\r|\n/);
		var regexPare = /:/;//key,value
		var service;
		var result = lines.forEach(function(line){
			if(line.trim() != ""){
				var pare=line.split(regexPare);
				if(vitaService.isVolumeId(pare)){
					if(service != undefined)vitaService.services.push(service);
					service=new Service();
					service[pare[0].trim().substr(2)]=pare[1].trim();
				}else{
					service[pare[0].trim()]=pare[1].trim();
				}
			}
		});
		if(service != undefined)vitaService.services.push(service);
	}
}
