const express = require('express')
const bodyParser = require('body-parser')
const request = require('request-promise')
const cheerio = require('cheerio')
var cors = require('cors')
const app = express()

const player = "https://www.espncricinfo.com/india/content/player/28235.html"
    let shikharUrl = "https://www.espncricinfo.com/india/content/player/28235.html"
    let viratUrl = "https://www.espncricinfo.com/india/content/player/253802.html"
    let rahulUrl = "https://www.espncricinfo.com/india/content/player/422108.html"
    let bumrahUrl = "https://www.espncricinfo.com/india/content/player/625383.html"
    


var port = process.env.PORT ||5050

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function getData (name) {
    let playerData = []
    let obj = {
        data:[]
    }
    let playerUrl = ''
    if(name==='virat'){
        playerUrl="https://www.espncricinfo.com/india/content/player/253802.html"
    } else if(name === 'rahul'){
        playerUrl="https://www.espncricinfo.com/india/content/player/422108.html"
    } else if(name === 'bumrah'){
        playerUrl="https://www.espncricinfo.com/india/content/player/625383.html"
    } else if(name === 'dhawan'){
        playerUrl="https://www.espncricinfo.com/india/content/player/28235.html"
    }

    const response = await request({
        uri:playerUrl,
        headers:{
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language":" en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        gzip:true
    });
    let $ = cheerio.load(response)
    let full_name =  $('#ciHomeContentlhs > div.pnl490M > div:nth-child(2) > div:nth-child(1) > p:nth-child(1) > span').text()
    let born = $('#ciHomeContentlhs > div.pnl490M > div:nth-child(2) > div:nth-child(1) > p:nth-child(2) > span').text().trim()
    let age = $('#ciHomeContentlhs > div.pnl490M > div:nth-child(2) > div:nth-child(1) > p:nth-child(3) > span').text()
    let teams = $('#ciHomeContentlhs > div.pnl490M > div:nth-child(2) > div:nth-child(1) > p:nth-child(4)').text().slice(12)
    let role = $('#ciHomeContentlhs > div.pnl490M > div:nth-child(2) > div:nth-child(1) > p:nth-child(5) > span').text()
    let batting_style = $('#ciHomeContentlhs > div.pnl490M > div:nth-child(2) > div:nth-child(1) > p:nth-child(6) > span').text()
    let bowling_style = $('#ciHomeContentlhs > div.pnl490M > div:nth-child(2) > div:nth-child(1) > p:nth-child(7) > span').text()

    let batData = []
    let battingData = $('#ciHomeContentlhs > div.pnl490M > table:nth-child(4) > tbody > tr > td').each((index,data) => {batData.push($(data).text())})
    //newData.map((index,innerData)=>{ batData.push(innerData.innerText)})

    let bowlData = []
    let bowlingData = $('#ciHomeContentlhs > div.pnl490M > table:nth-child(6) >tbody> tr>td').each((index,data)=> {bowlData.push($(data).text())})
    //let bowlingData = $('#ciHomeContentlhs > div.pnl490M > table:nth-child(6) >tbody> tr>td').each((index,data)=> {console.log(`Index : ${index} ,Data : ${$(data).text()}`)})
    let last_update = new Date().toLocaleString()
    playerData.push({
        full_name,
        born,
        age,
        teams,
        role,
        batting_style,
        bowling_style,
        batData,
        bowlData,
        last_update
    })

    obj.data.push({
        full_name,
        born,
        age,
        teams,
        role,
        batting_style,
        bowling_style,
        batData,
        bowlData,
        last_update
    })
    
    //obj.data.push(playerData)

    //let jsonData = JSON.stringify(obj)
    let jsonData = obj
    // jsonData=JSON.parse(jsonData)
    console.log(typeof(jsonData))
    console.log(jsonData.data)
    return jsonData
}

app.get('/',(req,res)=> {
    res.send('Hello')
})

app.get('/players/:paramName',(req,res) => {
    console.log(req.params)
    let name=req.params.paramName
    console.log(`Param name is ${name}`)
    //let {playerUrl} = req.body
    let callData = getData(name)
    callData.then(finalData =>{
        console.log(finalData)
         res.json(finalData)
    })
})

app.post('/abc',(req,res) => {
    console.log(req.body)
    return res.json(req.body)
})

app.listen(port,()=> {
    console.log(`Server started at port ${port}`)
})