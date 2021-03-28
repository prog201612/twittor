// I m p o r t s
importScripts( 'js/sw-utils.js' )

// C O N S T A N T S :

const STATIC_CACHE = 'static-v2'
const DYNAMIC_CACHE = 'dynamic-v2'
const INMUTABLE_CACHE = 'inmutable-v1'

const APP_SHELL = [
  // '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js',
]

const APP_SELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	"https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
]

// I N S T A L L

self.addEventListener('install', e => {
  // Create caches
  const staticPromise = caches.open( STATIC_CACHE )
    .then( cache => cache.addAll( APP_SHELL ))
  const inmutablePromise = caches.open( INMUTABLE_CACHE )
    .then( cache => cache.addAll( APP_SELL_INMUTABLE ))

  e.waitUntil( Promise.all([staticPromise, inmutablePromise]) ) 
})

// A C T I V A T E

self.addEventListener('activate', e => {
  const cleanCashesPromise = caches.keys().then( keys => {
    keys.forEach( key => {
      if ( key.includes('static') && key !== STATIC_CACHE) {
        return caches.delete( key )
      }
      if ( key.includes('dynamic') && key !== DYNAMIC_CACHE) {
        return caches.delete( key )
      }
    })
  })
  e.waitUntil( cleanCashesPromise )
})

// F E T C H

self.addEventListener('fetch', e => {
  const fetchPromise = caches.match( e.request ).then( resp => {
    if ( resp ) {
      return resp
    } else {
      return fetch( e.request ).then( newRes => {
        return updateCache( DYNAMIC_CACHE, e.request, newRes )       
      })
    }
  })
  e.respondWith( fetchPromise )
})
