let currentCacheName = 'vX';

let resources = [
	'/',
	'/restaurant.html',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/css/styles.css',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];

addEventListener('install', event => {
	skipWaiting();
	event.waitUntil(
		caches.open(currentCacheName)
		.then(cache => cache.addAll(resources))
	);
});

addEventListener('fetch', event => {
	//if restaurant page is requested
	if(event.request.url.includes('restaurant.html?id=')) {
  		event.respondWith(
  			caches.match('/restaurant.html')
  			.then(response => response || fetch(event.request))
  		);
  	}

	else {
		event.respondWith(
			caches.match(event.request)
		  	.then(response => {
		    	return response || fetch(event.request).then(function(response) {
        			return caches.open(currentCacheName).then(function(cache) {
          				cache.put(event.request, response.clone());
          				return response;
          			});
		  		});
			})
		);
	}
});

addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
        .then(cacheNames => {
            Promise.all(
            	cacheNames.filter(cacheName =>
                	cacheName.startsWith('v') && cacheName != currentCacheName
            	).map(cacheName => caches.delete(cacheName))
            )
        })
    );
});