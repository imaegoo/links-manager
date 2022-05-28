import axios from 'axios'
import { load } from 'cheerio'

const domain = 'www.imaegoo.com'
const friendPage = 'https://www.imaegoo.com/friends/'
const friendQuerySelector = '.friend a'

async function main() {
  const friendPageRes = await axios({
    url: friendPage,
    responseType: 'text'
  })
  const friendPageHtml = friendPageRes.data
  const friendPageQuery = load(friendPageHtml)
  let friendLinks: string[] = []
  friendPageQuery(friendQuerySelector).map((i, el) => {
    if (el.attribs.href && el.attribs.href.startsWith('http')) {
      friendLinks.push(el.attribs.href)
    }
  })
  friendLinks = Array.from(new Set(friendLinks))
  for (const friendLink of friendLinks) {
    console.log(friendLink)
  }
}

async function checkMyLink(friendLink: string) {
  const friendPageRes = await axios({
    url: friendLink,
    responseType: 'text'
  })
  const friendPageHtml = friendPageRes.data
  const friendPageQuery = load(friendPageHtml)
  friendPageQuery('a').map((i, el) => {
    // TODO
  })
}

main()
