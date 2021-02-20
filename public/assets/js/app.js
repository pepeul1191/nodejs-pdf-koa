
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
      var students = [];
      allTextLines.forEach(element => {
        if(i != 0 && (allTextLines.length - 2) >= i){
          var dataArray = element.split(':');
          students.push({
            last_names: dataArray[0],
            first_names: dataArray[1],
            email: dataArray[2],
            grade: dataArray[3],
          })
        }
        i++;
      });
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
    }
    reader.readAsText(inputFile.prop('files')[0], 'UTF-8');
  }
  return false;
}
