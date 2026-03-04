const express=require('express');
const mysql=require('mysql2')
const app=express();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Urp!1456',
    database:'testdb'
})

connection.connect((err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("Connection has been created");

    const creationQuery=`create table users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name varchar(20),
        email varchar(20)
    )`

    connection.execute(creationQuery,(err)=>{
        if(err){
            console.log(err);
            connection.end();
            return;
        }
        console.log("Table is created");
    })
})

app.get('/',(req,res)=>{
    res.send('Hello world')
})

app.listen(3000,(err)=>{
    console.log('Server running')
})