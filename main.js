const request = require('request');
const cheerio = require('cheerio');

// Demo url, with UNC 6
var url = 'https://www.footpatrol.com/footwear/294367-6'
var size = '11'

grabScrapeInfo(url, size)

// Grabs needed product info to check stock
function grabScrapeInfo(url, size) {
  request({
    url: url,
    gzip: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
      'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding':'gzip, deflate, br',
      'Accept-Language':'en-US,en;q=0.9',
      'Cache-Control':'max-age=0',
      'Connection':'keep-alive'
    }
  }, function(err, res, body) {
    if (err) {
      console.log(err)
    } else {
      var $ = cheerio.load(body)
      var variant = ''
      var attribute = $('option').each(function(i, elem) {
        if (elem.children[0]['data'] === size) {
          variant = elem.attribs['value']
        }
      })
      var product_id = $('#product_id').attr('value')
      return checkStock(url, variant, product_id)
    }
  })
}

// Obv. checks stock
function checkStock(url, variant, product_id) {
  request({
    url: `${url}/ajax/Ajax_Products/getVariationData`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
      'Accept':'application/json',
      'Accept-Encoding':'gzip, deflate, br',
      'Accept-Language':'en-US,en;q=0.9',
      'Cache-Control':'max-age=0',
      'Connection':'keep-alive',
    },
    gzip: true,
    method: 'post',
    body: 'json',
    json: true,
    form: {
      'ajax': true,
      'attributes': `attributes[2]=${variant}&`,
      'product_id': product_id
    }
  }, function(err, res, body) {
    if (err || body === undefined) {
      console.log(err)
    } else {
      console.log(body)
      console.log("Stock number of item is " + body['variation_stock'])
    }
  })
}
