import constants from '../../config/constants'

export const accessCss = () => {
  var rpta = [];
  if(constants.data.static == 'dev'){
    rpta = [
      'bower_components/bootstrap/dist/css/bootstrap.min',
      'bower_components/font-awesome/css/font-awesome.min',
      'assets/css/constants',
      'assets/css/error',
    ];
  }
  if(constants.data.static == 'produccion'){
    rpta = [
      'dist/test.min'
    ];
  }
  return rpta;
}

export const accessJs = () => {
  var rpta = [];
  if(constants.data.static == 'dev'){
    rpta = [
      'bower_components/jquery/dist/jquery.min',
      'bower_components/bootstrap/dist/js/bootstrap.min',
    ];
  }
  if(constants.data.static == 'produccion'){
    rpta = [
    ];
  }
  return rpta;
}

export default {
  accessCss,
  accessJs,
}
