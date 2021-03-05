// Backbone Models and Collections and View
var Student = Backbone.Model.extend({
	defaults: {
		first_names: '',
    last_names: '',
    email: '',
    grade: '',
    code: '',
	}
});
 
var StudentCollection = Backbone.Collection.extend({
	model: Student
});

var AppView = Backbone.View.extend({
  students: new StudentCollection(),
  basePDF: null,
  pdfType: null,
  el: '#app',
  initialize: function(){
  },
  render: function() {
    
  },
  events: {
    'change input[name=optType]': 'changedType',
    'click #btnSend': 'send',
    'click #btnLoadCSV': 'loadCSV',
    'change #inputFilePDF': 'selectPDF',
  },
  changedType: function(event){
    this.pdfType = event.target.value;
  },
  loadCSV: function(event){
    var inputFile = $('#inputFileCSV');
    var ext = inputFile.val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['csv']) == -1) {
      $('#alertMessage').addClass('alert-danger');
      $('#alertMessage').html('Debe de seleccionar un el archivo CSV con la información de los alumnos');
      $('#alertRow').removeClass('no-height');
      setInterval(() => {
        $('#alertMessage').removeClass('alert-danger');
        $('#alertMessage').html('');
        $('#alertRow').addClass('no-height');
      }, 5000);
      return false
    }
    if(this.pdfType == null) {
      $('#alertMessage').addClass('alert-danger');
      $('#alertMessage').html('Debe de seleccionar Tipo de Certificado a emitir');
      $('#alertRow').removeClass('no-height');
      setInterval(() => {
        $('#alertMessage').removeClass('alert-danger');
        $('#alertMessage').html('');
        $('#alertRow').addClass('no-height');
      }, 5000);
      return false
    }
    this.students.reset();
    if (inputFile.prop('files')[0] != undefined) {
      var reader = new FileReader();
      var _this = this;
      reader.onload = function(e) {
        fileContent = reader.result;
        var allTextLines = fileContent.split(/\r\n|\n/);
        var i = 0;
        allTextLines.forEach(element => {
          if(i != 0 && (allTextLines.length - 2) >= i){
            var dataArray = element.split(':');
            var student = new Student({
              _id: i ,
              last_names: dataArray[0],
              first_names: dataArray[1],
              email: dataArray[2],
              grade: dataArray[3],
            });
            _this.students.add(student);  
          }
          i++;
        });
        _this.showTable();
      }
      reader.readAsText(inputFile.prop('files')[0], 'UTF-8');
    }
  },
  showTable: function(){
    $('#studentTable').empty();
    var tbody = '';
    if(this.pdfType == 'certified'){
      tbody = `
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Nombres</th>
            <th scope="col">Correo</th>
            <th scope="col">Nota</th>
            <th scope="col">Acciones</th>
            <th scope="col">Resultado</th>
          </tr>
        </thead>
        <tbody>
      `;
      var i = 0;
      this.students.forEach(student => {
        tbody += `
          <tr model-id="${student.get('_id')}">
            <th>${++i}</th>
            <td>${student.get('last_names')}</td>
            <td>${student.get('first_names')}</td>
            <td>${student.get('email')}</td>
            <td>${student.get('grade')}</td>
            <td>
              <button type="button" class="btn btn-info btn-resend">
                <i class="fa fa-undo" aria-hidden="true"></i>
                  Reennviar
                </button>
            </td>
            <td>Envio Pendiente</td>
          </tr>
        `;
      });
      tbody += `
        </tbody>
      `;
    }else if(this.pdfType == 'course'){
      tbody = `
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Nombres</th>
            <th scope="col">Correo</th>
            <th scope="col">Nota</th>
            <th scope="col">Registro</th>
            <th scope="col">Acciones</th>
            <th scope="col">Resultado</th>
          </tr>
        </thead>
        <tbody>
      `;
      var i = 0;
      this.students.forEach(student => {
        tbody += `
          <tr model-id="${student.get('_id')}">
            <th>${++i}</th>
            <td>${student.get('last_names')}</td>
            <td>${student.get('first_names')}</td>
            <td>${student.get('email')}</td>
            <td>${student.get('grade')}</td>
            <td>${student.get('code')}</td>
            <td>
              <button type="button" class="btn btn-info btn-resend">
                <i class="fa fa-undo" aria-hidden="true"></i>
                  Reennviar
              </button>
            </td>
            <td>Envio Pendiente</td>
          </tr>
        `;
      });
      tbody += `
        </tbody>
      `;
    }
    $('#studentTable').append(tbody);
  },
  selectPDF: function(event){
    var inputFile = $('#inputFilePDF');
    var ext = inputFile.val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['pdf']) == -1) {
      $('#alertMessage').addClass('alert-danger');
      $('#alertMessage').html('Debe de seleccionar un el archivo PDF del certificado');
      $('#alertRow').removeClass('no-height');
      setInterval(() => {
        $('#alertMessage').removeClass('alert-danger');
        $('#alertMessage').html('');
        $('#alertRow').addClass('no-height');
      }, 5000);
    }else{
      this.basePDF = inputFile[0].files[0];
    }
  },
  send: function(event){
    if(this.pdfType == null){
      $('#alertMessage').addClass('alert-danger');
      $('#alertMessage').html('Debe de seleccionar Tipo de Certificado a emitir');
      $('#alertRow').removeClass('no-height');
      setInterval(() => {
        $('#alertMessage').removeClass('alert-danger');
        $('#alertMessage').html('');
        $('#alertRow').addClass('no-height');
      }, 5000);
    }else{
      // send pdf
      var _this = this;
      var form_data = new FormData();
      form_data.append('pdf_file', _this.basePDF);
      $.ajax({
        type: 'POST',
        url: BASE_URL + 'student/upload',
        headers: {
          // [CSRF_KEY]: CSRF,
        },
        data: form_data,
        //use contentType, processData for sure.
        contentType: false,
        processData: false,
        async: false,
        beforeSend: function() {
        },
        success: function(data) {
          var resp = JSON.parse(data);
          _this.sendStudents(resp.folder, resp.name);
        },
        error: function(xhr, status, error){
          console.error(xhr.responseText);
          resp.status = xhr.status;
          resp.message = xhr.responseText;
        }
      });
      // create websockets
    }
  },
  sendStudents: function(folder, basePDF){
    var _this = this;
    $.ajax({
      url: BASE_URL + 'student/send',
      type: 'POST',
      data: {
        data: JSON.stringify(_this.students.toJSON()),
        file: basePDF,
        folder: folder,
      },
      headers: {
        // [CSRF_KEY]: CSRF,
      },
      async: true,
      beforeSend: function() {
        $("#btnSend").prop("disabled", true);
        $(".btn-resend").prop("disabled", true);
      },
      success: function(data) {
        var respData = JSON.parse(data);
        respData.forEach(data => {
          var tr = $("tr[model-id='" + data._id +"']");
          tr.children().last().html('Enviado')
        });
        $("#btnSend").prop("disabled", false);
        $(".btn-resend").prop("disabled", false);
      }
    });
  },
});

var StudenTable = Backbone.View.extend({
  model: StudentCollection,
  el: 'studentsRow',
  render: function() {
    
  },
});

// form actions

function CSVtoTable(event){
  var inputFile = $('#inputFile');
  var ext = inputFile.val().split('.').pop().toLowerCase();
  if($.inArray(ext, ['csv']) == -1) {
    alert('Upload CSV');
    return false;
  }
  if (inputFile.prop('files')[0] != undefined) {
    var reader = new FileReader();
    reader.onload = function(e) {
      fileContent = reader.result;
      var allTextLines = fileContent.split(/\r\n|\n/);
      var i = 0;
      var students = new StudentCollection();
      allTextLines.forEach(element => {
        if(i != 0 && (allTextLines.length - 2) >= i){
          var dataArray = element.split(':');
          var student = new Student({
            last_names: dataArray[0],
            first_names: dataArray[1],
            email: dataArray[2],
            grade: dataArray[3],
          });
          students.add(student);  
        }
        i++;
      });
      console.log(students)
      /*
      $.ajax({
        url: 'http://localhost:3000/student/send_pdfs',
        type: 'POST',
        data: {
          data: JSON.stringify(students)
        },
        headers: {
          // [CSRF_KEY]: CSRF,
        },
        async: false,
        success: function(data) {
          console.log(data)
        }
      });
      */
    }
    reader.readAsText(inputFile.prop('files')[0], 'UTF-8');
  }
  return false;
}

function sendPDFs(){
  var table = new StudenTable();
  table.render();
}

$(document).ready(function() {
  new AppView();
});