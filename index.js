const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404)
            return res.end('404 - Not Found')
        }
        res.writeHead(200)
        res.end(data)
    })
})

server.listen(3000, () => console.log('Server running on http://localhost:3000'))