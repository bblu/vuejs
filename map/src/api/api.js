import axios from 'axios';
import config from '../config.js'

let commonReqHeader;

let addHeader = function(){
	console.log(arguments);
	var args = Array.prototype.slice.call(arguments, 1);
	if(!commonReqHeader){
		commonReqHeader = {
			headers: {
				Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).token
			}
		};
	}
	args.push(commonReqHeader);

	return arguments[0].apply(null, args);
}

//Authorization api
export const register = params => { return axios.post( window.__config.apiServer + `/user/register`, params).then(res => res.data); };
export const login = params => { return axios.post( window.__config.apiServer + `/user/login`, params).then(res => res.data); };


//data edit api
export const add = params => { 
	return addHeader(axios.post,  window.__config.apiServer + `/mapspot/insert`, params).then(res => res.data); 
};

export const del = params => {  
	return addHeader(axios.post,  window.__config.apiServer + `/mapspot/delete`, params).then(res => res.data); 
};

export const fetchList = params => { 
	return addHeader(axios.post,  window.__config.apiServer + `/mapspot/list`, params).then(res => res.data); 
};

export const exportData = params => { 
	document.getElementById('download').src =  window.__config.apiServer + `/mapspot/export?` + ['type', params.exportType].join('=') + '&' + ['polygon', encodeURIComponent(JSON.stringify(params.exportRange))].join('=') + '&' + ['token', 'Bearer ' + params.token].join('=');
};


export const spatialQuery = params => { 
	return addHeader(axios.post,  window.__config.apiServer + `/mapspot/spatial-query`, params).then(res => res.data); 
};

export const getMapConfig = () => {
	return axios.get('/data.ini').then(res => res.data);
}