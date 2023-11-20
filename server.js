var express = require ("express")
var app = express ()
var port = process.env.port || 3000;
var sqlite3 = require('sqlite3').verbose();

// create a db to store a histoy of the calculations.
var db = new sqlite3.Database('myDB');

//Listening on port...
app.listen(port, ()=>{
    console.log("App Listening to: " + port)
})

//Help page for the calculator on how to use it.
app.get("/help", function(req, res){
  let html = ''; 
  html += '<h1>The API Calculator</h1>'; 
  html += '<p>Functions available in this calculator</p>';
  html += '<p>addition, subtraction, multiplication, division</p>';
  html += '<p>To use this service, use the format /"calculator function"/ "Number 1" / "Number 2"</p>';
  html += '<p>Example - /addition/3/4 = 3+4</p>';
  html += '<p>Example - /subtraction/3/4 = 3-4</p>';
  html += '<p>Example - /multiplication/3/4 = 3*4</p>';
  html += '<p>Example - /division/3/4 = 3/4</p>';
	res.send(html)
});


//The Calculator REST end point
app.get('/:operator/:num1/:num2', function(req,res){
	
  //setup parameters and variables
	var operator = req.params.operator
	var num1 = parseInt(req.params.num1);
	var num2 = parseInt(req.params.num2);
	var result;
  var calculation;

  //create loop for calculator functions
	switch(operator){
		case "addition":
		result = add(num1, num2);
    calculation = "+";
		break;

		case "subtraction":
		result = subtract(num1, num2);
    calculation = "-";
		break;

		case "multiplication":
		result = multiply(num1, num2);
    calculation = "*";
		break;

		case "division":
		result = divide(num1, num2);
    calculation = "/";
		break;

    //show error if not valid number
		default:
		result = "Sorry, please enter a valid operator!"
	}

  //add function
	function add(a, b){
		return a + b
	}

  //subtract function
	function subtract(a, b){
		return a - b
	}

  //multiple function
	function multiply(a, b){
		return a * b
	}

  //divide function
	function divide(a, b){
		return a / b
	}

  //html to display the results
  let html = ''; 
  html += '<h1>The API Calculator</h1>'; 
  html += '<p>Total = ' + result + '</p>';
	res.send(html);

  //set today's date
  var date = new Date().toISOString().slice(0, 10);
  //write the calculation in the db to save history
  db.run(`INSERT INTO Calculator (calculation, answer, date) VALUES ("${num1}${calculation}${num2}", "${result}", "${date}")`);

});

// Display webpage for the Calculator HISTORY
app.get('/history', function (req, res) {
  let html = '';

  // Display it in a Table
  html += '<!doctype html><html lang="en">';
  html += '<head>';
  html += '<title>Bootstrap Express/SQLite3 Demo</title>';
  html += '<meta charset="utf-8">';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';
  html += '<link rel="stylesheet"';
  html += '  href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"';
  html += '  integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"';
  html += '  crossorigin="anonymous">';
  html += '</head>';

  html += '<body><div class="container">';
  html += '<h3> The Calculator History Table </h3>';
  html += '<table class="table">';
  html += '<thead class="thead-dark"><tr>';
  html += '<th>ID</th><th>Calculation</th><th>Answer</th><th>Date</th>';
  html += '<tr></thead><tbody>';

  // Retrieve data from calculator db
  // and display it in the table
  db.all('SELECT * FROM Calculator', function(err, rows){
      if (err) {
          return console.error(err.message);
      }
      if (rows.length === 0) { 
          console.log("Array is empty!") 
          html += '<tr><td colspan="3"> No data found </td></tr>';
      } else {
          rows.forEach(function (row){
              html += '<tr>';
              html += '<td>'+row.id+'</td>';
              html += '<td>'+row.calculation+'</td>';
              html += '<td>'+row.answer+'</td>';
              html += '<td>'+row.date+'</td>';
          });
      }

      html += '</tbody></table>';
      html += '</div>';
      html += '</body></html>';
      res.send( html );
  });
});

