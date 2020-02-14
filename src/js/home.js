//HAcemso el rotro de cargar kis nimbres de los usuarios de las perifulas

console.log('hola mundo!');
const noCambia = "Jose";

let cambia = "@JoseRoberto";

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}
//promesas en js
const getUser = new Promise((todoBien, todoMal)=>{
	//llamar a un API
	//setInterval
	setTimeout(()=>{
		//luego de 3 segundos
		//todoBien();
		todoBien('cargue exitoso');
	}, 3000);
});
const getUserAll = new Promise((todoBien, todoMal)=>{
	//llamar a un API
	//setInterval
	setTimeout(()=>{
		//luego de 3 segundos
		//todoBien();
		todoBien('se acabo el tiempo segunda');
	}, 5000);
});


// getUser
// 	.then(()=>{
// 		console.log("todo esta bien !!");
// 	}).catch((fail)=>{
// 		console.log(`todo MAL !! ${fail}`);
// 	});

Promise.all([
	getUser,
	getUserAll,
]).then((mensagge)=>{
	console.log(mensagge);
}).catch((mensagge)=>{
	console.log(mensagge);
});	
Promise.race([
	getUser,
	getUserAll,
]).then((mensagge)=>{
	console.log(mensagge);
}).catch((mensagge)=>{
	console.log(mensagge);
});	

$.ajax('https://randomuser.me/api/', {
	method: 'GET',
	success: function(data){
		console.log(data)
	}, 
	error: function(error){
		console.log(error)
	}
});

//Javascript
fetch('https://randomuser.me/api/')
	.then((response)=>{
		return response.json();
	})
	.then((user)=>{
		console.log({"user": user.results[0].name.first});
	}).catch(()=>{
		console.log("algo fallo");
	});

	//funciones asincronas
	//parentisis para que se auto-ejecute
(async function load(){
//esperar peticiones de API
	//await
	async function getData(url){
		const response = await fetch(url);
		const data = await response.json();
		if(data.data.movie_count > 0){
			return data;
		}
		throw new Error('No se encontro ningún resultado');
	}
	const $form = document.getElementById("form");
	const $home = document.getElementById("home");
	const $featuringContainer = document.getElementById("featuring");

	const setAttributes = ($element, attributes) =>{
		for(const attribute in attributes)
			$element.setAttribute(attribute, attributes[attribute]);
	}
	const BASE_API = 'https://yts.lt/api/v2/';
	const featuringTemplate = ({medium_cover_image, title}) =>{
		return (
			`<div class="featuring">
        <div class="featuring-image">
          <img src="${medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${title}</p>
        </div>
      </div>`
			);
	}
	$form.addEventListener('submit',async (event)=> {
		event.preventDefault();
		$home.classList.add('search-active');
		const $loader = document.createElement('img');
		setAttributes($loader, {
			src: 'src/images/loader.gif',
			height: 50,
			width: 50,
		});
		$featuringContainer.append($loader);
		const data = new FormData($form);
		try {
			const { data: {movies: pelicula} } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
			const HTMLString = featuringTemplate(pelicula[0]);
			$featuringContainer.innerHTML = HTMLString;
		} catch(error){
			$loader.remove();
			$home.classList.remove('search-active');
			alert(error);
		}
	});

	
	const videoItemTemplate = ({medium_cover_image, title, id}, category)=>{
		return(
			`<div class="primaryPlaylistItem" data-id="${id}" data-category="${category}">
                <div class="primaryPlaylistItem-image">
                  <img src="${medium_cover_image}">
                </div>

                <h4 class="primaryPlaylistItem-title">
                  ${title}
                </h4>
              </div>`
			);
	}
	const createTemplate = (HTMLString) => {
		const html = document.implementation.createHTMLDocument();
		html.body.innerHTML = HTMLString;
		return html.body.children[0];
	}
	const addEventClick = ($element) => {
		$element.addEventListener('click', ()=>{
			showModal($element);
		});
	}
	// console.log(videoItemTemplate({src: 'src/images/covers/bitcoi.jpg', title: 'bitcoin'}));
	const renderMovieList = (List, $container, category)=>{
		//quitar el item de carga
		$container.children[0].remove();
		List.forEach((movie)=>{
			const HTMLString = videoItemTemplate(movie, category);
			const movieElement = createTemplate(HTMLString);
			$container.append(movieElement);
			const image = movieElement.querySelector('img');
			image.addEventListener('load', (event)=>{
				event.srcElement.classList.add('fadeIn');
			});
			//image.removeEventListener('load');
			addEventClick(movieElement);
		});
	}

	async function cacheExist(category){
		const ListName = `${category}List`;
		const cacheList = window.localStorage.getItem(ListName);
		if(cacheList){
			return JSON.parse(cacheList);
		}
		const  { data: { movies: data}} = await getData(`${BASE_API}list_movies.json?genre=${category}`);
		window.localStorage.setItem(ListName, JSON.stringify(data));
		return data;
	}
	
	// const { data: { movies: actionList}} = await getData(`${BASE_API}list_movies.json?genre=action`);
	const actionList = await cacheExist('action');
	const $actionContainer = document.querySelector("#action");
	renderMovieList(actionList, $actionContainer, 'action');

	const dramaList = await cacheExist('drama');
	const $dramaContainer = document.getElementById("drama");
	renderMovieList(dramaList, $dramaContainer, 'drama');

	const animationList = await cacheExist('animation');
	const $animationContainer = document.getElementById("animation");
	renderMovieList(animationList, $animationContainer, 'animation');
	
    //jquery
	//const $home = $('.home');
	
	


	const $modal = document.getElementById('modal');
	const $overlay = document.getElementById('overlay');
	const $hideModal = document.getElementById('hide-modal');

	const $modalTitle = $modal.querySelector('h1');
	const $modalImg = $modal.querySelector('img');
	const $modalDescription = $modal.querySelector('p');

	function findById(list, id){
		return list.find( movie => movie.id === parseInt(id, 10)); 
	}
	const findMovie = (id, category) => {
		switch (category) {
			case 'action' : {
				return findById(actionList, id);
			}
			case 'drama': {
				return findById(dramaList, id);
			}
			default:{
				return findById(animationList, id);
			}
		}
	}
	function showModal($element){

		$overlay.classList.add('active');
		$modal.style.animation  = 'modalIn .8s forwards';
		const id = $element.dataset.id;
		const category = $element.dataset.category;
		const data = findMovie(id, category);
		$modalTitle.textContent = data.title; 
		$modalImg.setAttribute('src', data.medium_cover_image);
		$modalDescription.textContent = data.description_full;
	}
	$hideModal.addEventListener('click', hideModal);
	function hideModal(){
		$overlay.classList.remove('active');
		$modal.style.animation  = 'modalOut .8s forwards';
	}	
	
})();