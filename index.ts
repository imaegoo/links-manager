import { URL } from 'url'
import axios, { AxiosResponse } from 'axios'
import { load, Element } from 'cheerio'

const domain = 'imaegoo.com'
const friendPage = 'https://www.imaegoo.com/friends/'
const friendQuerySelector = '.friend a'

async function main() {
  const friendPageRes = await axios({
    url: friendPage,
    responseType: 'text',
    timeout: 60000
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
  // console.log(friendLinks.join('\n'))
  // return
  // friendLinks = [friendLinks[0]]
  for (const friendLink of friendLinks) {
    checkMyLink(friendLink).then(hasMyLink => {
      console.log(friendLink, '是否回链', hasMyLink)
    }).catch((e: any) => {
      console.log(friendLink, e.message)
    })
  }
}

async function checkMyLink(friendLink: string, deep = 0) {
  if (deep > 10) return false
  let friendPageRes: AxiosResponse
  try {
    friendPageRes = await axios({
      url: friendLink,
      responseType: 'text',
      timeout: 60000
    })
    const friendPageHtml = friendPageRes.data
    const friendPageQuery = load(friendPageHtml)
    const links: Element[] = []
    friendPageQuery('a').map(async (i, el) => {
      links.push(el)
      return
    })
    for (const el of links) {
      if (el.attribs.href) {
        if (el.attribs.href.indexOf(domain) >= 0) {
          return true
        } else if (isLinksPage(friendPageQuery(el).text())) {
          const url = new URL(friendLink)
          const subUrl = new URL(el.attribs.href, friendLink)
          if (subUrl.protocol !== 'http:' && subUrl.protocol !== 'https:') continue
          if (url.hostname !== subUrl.hostname) continue
          if (url.pathname === subUrl.pathname) continue
          const href = subUrl.href.replace(/#.*$/g, '')
          const checkRes = await checkMyLink(href, deep + 1)
          if (checkRes) {
            return true
          }
        }
      }
    }
    return false
  } catch (e: any) {
    console.log(friendLink, e.message)
    return false
  }
}

function isLinksPage(text: string) {
  const linksPage = ['link', 'friend', '友链', '友情链接', '朋友', '后♂宫', '友人帐']
  const textLower = text.toLowerCase()
  for (const link of linksPage) {
    if (textLower.indexOf(link) >= 0) {
      return true
    }
  }
  return false
}

main()
