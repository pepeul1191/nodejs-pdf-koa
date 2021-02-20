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

export default {
  loadCss,
  loadJs,
}
