const PORT = process.env.PORT || 8000

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app =  express()

const newspapers = [
    {
        name: 'cityam',
        address: 'https://www.cityam.com/?s=turkey',
        base: ''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/past-six-days/2022-10-01/news',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/world/turkey',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/turkey/',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/topic/destination/turkey',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/search?q=turkey',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/search?text=turkey',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/search?q=turkey',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/turkey',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/?s=turkey',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/home/search.html?sel=site&searchPhrase=turkey',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/turkey/',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Turkey")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        }).catch(err => console.log(err))
})

app.get('/', (req, res) => {
    res.json('Welcome to my News Scrapper API...')
})

app.get('/news', (req, res) => {
   res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Turkey")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })

            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log('Server running on PORT: ' + PORT))