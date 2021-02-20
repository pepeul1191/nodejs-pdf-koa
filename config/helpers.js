import constants from './constants'

const loadCss = (csss) => {
  var resp = ''
  if (typeof csss != 'undefined'){
    for(var i = 0; i < csss.length; i++){
      resp = resp + '<link rel="stylesheet" type="text/css" href="'+ constants.data.static_url + csss[i] + '.css" />'
    }
  }
  return resp
}

const loadJs = (jss) => {
  var resp = ''
  if (typeof jss != 'undefined'){
    for(var i = 0; i < jss.length; i++){
      resp = resp + '<script src="' + constants.data.static_url + jss[i] + '.js"></script>'
    }
  }
  return resp
}

export const randomSN = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default {
  loadCss,
  loadJs,
  randomSN,
}
