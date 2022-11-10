const express = require("express");
const cors= require("cors");
const jwt = require('jsonwebtoken')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()


app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.quaequt.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db("web3services").collection("services");
        const reviewCollection = client.db("web3services").collection("review");
        // const Addservice = client.db("web3services").collection("addservices")
        app.post("/jwt",(req,res) =>{
            const user = req.body;
            const token = jwt.sign(user,process.env.ACCESS_TOKEN)
            res.send(token)
            console.log(user);
        })
        app.get('/services', async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query).sort({ title : -1});
            const services = await cursor.limit(3).toArray()
            console.log(cursor)
            res.send(services)
        })
        app.get('/allservices', async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get("/services/:id",async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.post("/addservices",async(req,res) =>{
            const result = await serviceCollection.insertOne(req.body)
            if(result.insertedId){
                res.send({
                    success:true,
                    message: "succesfully added"
                })
            }
            else{
                res.send({
                    success:false,
                    error:"cannot fetch"
                })
            }
        })

        app.get('/allReviews', async(req,res)=>{
            let query = {}
            console.log(req.query)
            if(req.query.email){
                query = {
                    Email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray()
            res.send(review)
        })

        
        // app.get('/myreviews', async(req,res)=>{
        //     let query = {}
        //     console.log(req.query)
        //     if(req.query.email){
        //         query = {
        //             Email: req.query.email
        //         }
        //     }
        //     const cursor = reviewCollection.find(query);
        //     const review = await cursor.toArray()
        //     res.send(review)
        // })

        

        app.post("/reviews",async(req,res) =>{
            const result = await reviewCollection.insertOne(req.body)
            if(result.insertedId){
                res.send({
                    success:true,
                    message: "succesfully added"
                })
            }
            else{
                res.send({
                    success:false,
                    error:"cannot fetch"
                })
            }
        })
        app.delete("/reviews/:id",async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })
        app.patch

        
    }
    finally{

    }

}

run().catch(err => console.error(err))


app.get('/',(req,res) =>{
    res.send("service")
})

app.listen(port,() =>{
    console.log(`server is running on ${port}`)

})
