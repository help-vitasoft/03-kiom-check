'use babel';
import VitaService from './VitaService';
import VitaContent from './VitaContent';
import VitaConfig from './VitaConfig';

export default class VitaCheck {
	constructor(editor){
		this.editor=editor;
		if(!this.editor){
			this.error('에디터가 확인되지 않습니다.');
		}
		this.serviceName="config_service.yml";
		this.contentName="volume-contents.yml";
		this.configName="config.yml";
		this.service=new VitaService(this.getServicePath());
		this.content=new VitaContent(this.getContentPath());
		this.config=new VitaConfig(this.getConfigPath());
	}
	/**
	**	열린에디터의 인코딩 정보를 확인
	*/
	checkEncoding(){
		var encoding=this.editor.getEncoding();
		if(encoding != "utf8")this.error('인코딩이 utf8 형식이 아닙니다.');
	}
	/*
	** 현재 열린 문서의 경로를 기준으로 파일명 전달(config_service.yml)
	** 마지막에 \ 까지 붙여서 전달
	*/
	getPath(){
		var lastIdx=this.editor.getPath().lastIndexOf('\\')
		return this.editor.getPath().substr(0,lastIdx+1);
	}
	/*
	**	현재문서의 경로 (config_service.yml 을 열어둔 것으로 가정)
	*/
	getContentPath(){
		var path=this.getPath();
		return path+"contents/"+this.contentName;
	}
	/*
	**	현재문서의 경로 config_service.yml 을 열어둔 것으로 가정
	*/
	getServicePath(){
		var path=this.getPath();
		return path+this.serviceName;
	}
	/*
	**	현재문서의 경로 config_service.yml 을 열어둔 것으로 가정
	*/
	getConfigPath(){
		var path=this.getPath();
		return path+this.configName;
	}
	error(str){
		alert(str);
		throw('오류발생');
	}
	/*
	**	service에 명시된 컨텐츠 갯수가 맞는지 확인
	**	- vomlue_id: 갯수와 tagname: h1 의 갯수가 같아야 함
	*/
	checkContents(){
		var s=this.service;
		if(!s)this.error('서비스 파일이 없습니다.');
		var c=this.content;
		if(!c)this.error('컨텐츠 파일이 없습니다.');
		if(s.getCount() != c.getH1Count())this.error('서비스와 컨텐츠의 갯수가 다릅니다.'+s.getCount()+'='+c.getH1Count());
	}
	/*
	**	service: 명시된 서비스언어의 갯수가 맞는지 확인
	**	service: 하위 항목 갯수와 content 에서 서비스항목의 갯수가 같아야 함
	*/
	checkService(){
		if(!this.service)this.error('서비스 파일이 없습니다.');
		var s=this.service.getServices();
		var c=this.content.getContents();
		for(var i=0;i<s.length;i++){
			this.compareService(s[i],c[i]);
		}
	}
	/*
	**	service: 명시된 서비스언어의 권한 확인
	**	config: service_all 하위 항목 권한이 서비스항목의 권한과 같아야 함
	*/
	checkConfig(){
		if(!this.config)this.error('config 파일이 없습니다.');
		var c=this.config;
		console.log(c);
		var s=this.service.getServices();
		var cKeys=Object.keys(c);
		var msg="";
		for(var i=0;i<cKeys.length;i++){//서적의 기준으로 서비스를 확인
			var book=c[cKeys[i]];
			var serviceLanguage="";
			switch(cKeys[i].toLowerCase()){
				case "orginal":
					serviceLanguage="ORginal";
					break;
				case "ancient_korean":
					serviceLanguage="Ancient_Korean";
					break;
				case "explanation":
					serviceLanguage="EXplanation";
					break;
				case "korean":
					serviceLanguage="KOrean";
					break;
				case "english":
					serviceLanguage="ENglish";
					break;
				default:
					this.error("서비스항목에 없는 값입니다. ["+ cKeys[i] +"]");
			}
			console.log(serviceLanguage);
			for(var j=0;j<s.length;j++){
				var volume=s[j][serviceLanguage];
				if(volume == undefined)continue;
				msg=this.compareConfig(volume,book);
				if(msg)this.error(msg+"("+cKeys[i]+")");
			}
		}
	}
	compareConfig(v,book){
		console.log([book,v]);
		var volume=v;
		if(v.toLowerCase() === "true")volume=true;
		if(v.toLowerCase() === "false")volume=false;
		var flag=true;
		var msg="";
		switch(book){//admin,editor,true,false
			case "admin":
				if(volume == "editor" || volume === true)flag=false;
				break;
			case "editor":
				if(volume === true)flag=false;
				break;
			case true:
				break;
			case false:
				if(volume !== false)flag=false;
				break;
			default:
				msg = "[ "+book+" ] : 비교항목은 admin,editor,true,false 외의 다른 값이 올 수 없습니다.";
		}
		if(!flag)msg="올바른 서비스 권한이 아닙니다. ["+book+" => "+volume+"]";
		console.log(msg);
		return msg;
	}
	compareService(s,c){
		var sKeys=Object.keys(s);
		var cKeys=Object.keys(c);
		var flag=true;
		for(var i=0;i<cKeys.length;i++){
			switch(cKeys[i]){
				case "OR":
					flag=sKeys.includes("ORginal");
					break;
				case "AK":
					flag=sKeys.includes("Ancient_Korean");
					break;
				case "OR":
					flag=sKeys.includes("ORginal");
					break;
				case "KO":
					flag=sKeys.includes("KOrean");
					break;
				case "EX":
					flag=sKeys.includes("EXplanation");
					break;
				case "EN":
					flag=sKeys.includes("ENglish");
					break;
				default:
			}
			if(!flag)this.error("서비스 항목이 누락되었습니다.("+s.getVolumeId()+":"+cKeys[i]+")");
		}
	}
}
