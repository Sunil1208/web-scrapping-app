const express = require('express')
const bodyParser = require('body-parser')
const request = require('request-promise')
const cheerio = require('cheerio')
const app = express()

const player = "https://www.espncricinfo.com/india/content/player/28235.html"



var port = process.env.PORT ||5050

async function getData () {
    let playerData = []
    let obj = {
        data:[]
    }

    const response = await request({
        uri:player,
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

    playerData.push({
        full_name,
        born,
        age,
        teams,
        role,
        batting_style,
        bowling_style
    })
    
    obj.data.push(playerData)

    let jsonData = JSON.stringify(obj)
    console.log(jsonData)
    return jsonData
}

let callData = getData()

app.get('/',(req,res) => {
    
    callData.then(finalData =>{
        console.log(finalData)
        res.json(finalData)
    })
})

app.listen(port,()=> {
    console.log(`Server started at port ${port}`)
})