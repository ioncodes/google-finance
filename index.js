var express = require('express')
var app = express()

app.get('/:from/:to/:amount', function (req, res) {
    var json = {'result':'error','currency':'0','amount':'0','reason':''}

    var from
    var to
    var amount

    // from = req.query['from']
    // to = req.query['to']
    // amount = req.query['amount']

    from = req.params.from;
    to = req.params.to;
    amount = req.params.amount;

    if(from === 'undefined' || to === 'undefined' || amount === 'undefined') {
        json.result = 'error'
        console.log(json)
        res.send(json)
    } else {
        if(from === '' || to === '' || amount === '') {
            json.reason = 'parameter was empty'
            res.send(json)
        } else {
            console.log('from: ' + from)
            console.log('to: ' + to)
            console.log('amount: ' + amount)

            convert(amount, from, to, function(result) {
                if(result === 'undefined') {
                    json.result = 'error'
                    console.log(json)
                    res.send(json)
                } else {
                    json.result = 'success'
                }
                json.currency = to
                json.amount = result
                console.log(json)
                res.send(json)
            })
        }
    }
})

app.listen(3000, function () {
  console.log('Listening on port 3000.')
})

function convert(amount, from, to, callback) {
    var http = require('http')
    var options = {
        host: 'www.google.com',
        path: '/finance/converter?a={amount}&from={from}&to={to}'.replace('{amount}',amount).replace('{from}',from).replace('{to}',to)
    }

    var req = http.get(options, function(res) {
        var bodyChunks = []
        res.on('data', function(chunk) {
            bodyChunks.push(chunk)
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks) + ''
            var html = body.substring(body.lastIndexOf("<span class=bld>")+1,body.lastIndexOf("<input type=submit value=\"Convert\">"))
            var myRegexp = /[0-9]+\.[0-9]+/
            var match = myRegexp.exec(html)
            callback(match[0])
        })
    })

    req.on('error', function(e) {
        console.log('ERROR: ' + e.message)
    })
}
