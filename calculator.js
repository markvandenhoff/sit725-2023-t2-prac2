var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('myDB');      // file database

db.serialize(function() {
    
    //create new table called calculator
    db.run("CREATE TABLE IF NOT EXISTS Calculator (id integer primary key, calculation TEXT, answer TEXT, date TEXT)");
    console.log("DB has been created")

    db.run("DELETE FROM Calculator");
    // insert some test fields to ensure the db is working ok.
    db.run(`INSERT INTO Calculator (calculation, answer, date) VALUES ("3*4", "12", "2023-11-20")`);
    
    // run a select command to check on terminal it worked to create and insert values
    console.log('Display all content from all rows of the DB');
    db.each("SELECT * FROM Calculator", function(err, row) {
        console.log("[all] ID: " + row.id + "  Calculation: " + row.calculation + " answer: " + row.answer + " date: " + row.date); 
        console.log("Rows are displaying correcltly. DB is ready!")    });
});
db.close(); 