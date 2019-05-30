'use babel';
import Content from './Content';
const fs = require('fs');

export default class VitaContent {
	//인자로 받은 파일경로를 열어서 컨텐츠 겍체로 저장
	constructor(path){
		this.path=path;
		this.contents=[];
		this.setContents();
		console.log(this);
	}
	//컨텐츠 갯수를 리턴
	getCount(){
		return this.contents.length;
	}
	getH1Count(){
		var cnt=0;
		this.contents.forEach(function(c){
			var tag=c.getTagName();
			if(tag == "h1")cnt++;
		});
		return cnt;
	}
	isContentId(pare){
		//if(pare.length != 2)throw("잘못된 값 입니다."+pare.toString())
		var regex="- contents_id";
		return pare[0] == regex;
	}
	getContents(){
		return this.contents;
	}
	//파일을 읽어서 서비스 객체를 만들어 배열로 저장
	setContents(){
		if(!fs.existsSync(this.path))throw('파일을 읽을 수 없습니다.:'+this.path);
		let vitaContent=this;
		var data=fs.readFileSync(this.path,'utf8');
		var lines=data.split(/\r\n|\r|\n/);
		var regexPare = /:/;//key,value
		var content;
		var result = lines.forEach(function(line){
			if(line.trim() != "" && line.match(regexPare)){
				var pare=line.split(regexPare);
				if(vitaContent.isContentId(pare)){
					if(content != undefined)vitaContent.contents.push(content);
					content=new Content();
					content[pare[0].trim().substr(2)]=pare[1].trim();
				}else{
					content[pare[0].trim()]=pare[1].trim();
				}
			}
		});
		if(content != undefined)vitaContent.contents.push(content);
	}
}
