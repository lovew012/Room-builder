
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { BufferGeometryUtils } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm//utils/BufferGeometryUtils.js';
import { DragControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/DragControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
//Script author: Love Wikby//



//Global variables and constants//
let l = 6; 
let w = 4; 
let h = 2.7;

let scene; 
let renderer; 
let loader; 

let orbitControls; 
let dragControls; 

let currentRoom = []; 
let roomColors = []; 
let roomFurniture = []; 
let dragObjects = [];
let roomLights = []; 

let keyboard;
//--------------------------------------------------------------------------------------------------------------------//

window.addEventListener("load", run);

function initScene() {

	let camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);

	scene = new THREE.Scene();
	loader = new GLTFLoader();

	const canvas = document.querySelector("canvas");

	renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });

	camera.position.setScalar(5);
	camera.position.set(5, 10, 0)
	camera.lookAt(scene.position);
	
	orbitControls = new OrbitControls(camera, renderer.domElement);

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.querySelector("#app").appendChild(renderer.domElement);

	dragControls = new DragControls(dragObjects, camera, renderer.domElement);
	dragControls.addEventListener('dragstart', function (event) {

		orbitControls.enabled = false;

		if (!Array.isArray(event.object.material)) event.object.material.opacity = 0.33;
		else {
		event.object.material.forEach(group => {
			group.opacity = 0.33;
		})}
		
		showFeedback(event.object);
	})

	dragControls.addEventListener('dragend', function (event) {

		orbitControls.enabled = true;
		console.log(event.object.position);

		if (!Array.isArray(event.object.material)) event.object.material.opacity = 1;
		else {
		event.object.material.forEach(group => {
			group.opacity = 1;
		})}
		
		removeFeedback(event.object);
	})

	renderer.setAnimationLoop(() => {
		dragObjects.forEach(o => {
			o.userData.update();
		})
		renderer.render(scene, camera);
	})
}

function redrawRoom() {

	let list = [document.querySelector("#field-length"), document.querySelector("#field-width"), document.querySelector("#field-height")];
	let dim = [l, w, h];

	for (let i = 0; i < list.length; i++) {
		list[i].value = list[i].value.replaceAll(",", ".");
		if (list[i].value < 1 || parseFloat(list[i].value) > 10 || isNaN(parseFloat(list[i].value))) {
			statusMessage("Ange ett värde mellan 1 och 10");

			list[i].value = dim[i].toLocaleString("pt-SE") + "m";

			list[i].focus();
    
 			list[i].setSelectionRange(0, list[i].value.length);

			

		}
		else list[i].value = parseFloat(list[i].value).toLocaleString("pt-SE") + "m";
	}

	l = parseFloat(document.querySelector("#field-length").value.replaceAll(",", "."));
	w = parseFloat(document.querySelector("#field-width").value.replaceAll(",", "."));
	h = parseFloat(document.querySelector("#field-height").value.replaceAll(",", "."));
	clearRoom();

	roomConstructor(l, w, h);
	recalculateObjects();
}

function roomConstructor(length, width, height) {

	document.querySelector("#field-length").value = length.toString().replaceAll(".", ',') + "m";
	document.querySelector("#field-width").value = width.toString().replaceAll(".", ',') + "m";
	document.querySelector("#field-height").value = height.toString().replaceAll(".", ',') + "m";
	

	let fbWallGeometry = new THREE.PlaneGeometry(width, height);
	let sideWallGeometry = new THREE.PlaneGeometry(length, height);
	const defaultColorWalls = new THREE.MeshBasicMaterial({ color: new THREE.Color(roomColors[0]) });

	let floorGeometry = new THREE.PlaneGeometry(width, length);
	const defaultColorFloor = new THREE.MeshBasicMaterial({ color: roomColors[1] });

	let roofGeometry = new THREE.PlaneGeometry(width, length);

	const defaultColorRoof = new THREE.MeshBasicMaterial({ color: roomColors[2] });

	let rearWall = new THREE.Mesh(fbWallGeometry, defaultColorWalls);
	let frontWall = new THREE.Mesh(fbWallGeometry, defaultColorWalls);
	let sideWallLeft = new THREE.Mesh(sideWallGeometry, defaultColorWalls);
	let sideWallRight = new THREE.Mesh(sideWallGeometry, defaultColorWalls);
	let floor = new THREE.Mesh(floorGeometry, defaultColorFloor);
	let roof = new THREE.Mesh(roofGeometry, defaultColorRoof);

	/*RADIONS TO DEGREES */

	let rotation90deg = 2 * Math.PI * (90 / 360);
	let rotation180deg = 2 * Math.PI * (180 / 360);
	/*-------------------------------------------------*/

	/* FLOOR */

	floor.position.set(0, 0, 0);
	floor.rotation.set(-rotation90deg, 0, 0);
	scene.add(floor);
	currentRoom.push(floor);
	/*-----------------------------------------------*/

	/* REAR WALL */
	rearWall.position.set(0, (height / 2), (length / 2));
	rearWall.rotation.set(0, rotation180deg, 0);
	scene.add(rearWall);
	currentRoom.push(rearWall);
	/*-----------------------------------------------*/

	/* FRONT WALL */
	frontWall.position.set(0, (height / 2), -(length / 2));
	frontWall.rotation.set(0, 0, 0);
	scene.add(frontWall);
	currentRoom.push(frontWall);
	/*-----------------------------------------------*/

	/* SIDE WALLS */

	sideWallLeft.position.set(-(width / 2), (height / 2), 0);
	sideWallLeft.rotation.set(0, rotation90deg, 0);
	scene.add(sideWallLeft);
	currentRoom.push(sideWallLeft);

	sideWallRight.position.set((width / 2), (height / 2), 0);
	sideWallRight.rotation.set(0, -rotation90deg, 0);
	scene.add(sideWallRight);
	currentRoom.push(sideWallRight);

	/*-----------------------------------------------*/

	/* ROOF */

	roof.position.set(0, height, 0);
	roof.rotation.set(rotation90deg, 0, 0);
	scene.add(roof);
	currentRoom.push(roof);
	/*-----------------------------------------------*/

	setupLights();

}

function clearRoom() {
	currentRoom.forEach(construct => {
		scene.remove(construct);
	});
}

function showFeedback(object) {

	if (object.parent.userData.isComplex) object = object.parent;

	const objId = object.userData.id;
	const index = roomFurniture.findIndex(furniture => furniture.userData.id == objId);
	const list = document.querySelectorAll("#room-config-objects-wrapper li");

	list[index].classList.add("dragActive");
	list[index].scrollIntoView({ behavior: "smooth" });
}

function removeFeedback(object) {

	if (object.parent.userData.isComplex) object = object.parent;

	const objId = object.userData.id;
	const index = roomFurniture.findIndex(furniture => furniture.userData.id == objId);
	const list = document.querySelectorAll("#room-config-objects-wrapper li");

	list[index].classList.remove("dragActive");
}

function show3Dfeedback() {

	let furniturelist = document.querySelectorAll('#room-config-objects-wrapper li');
	let arr = Array.from(furniturelist);
	let ix = arr.indexOf(this);
	let correspondingObj = roomFurniture[ix];

	if (!Array.isArray(correspondingObj.material)) correspondingObj.material.opacity = 0.33;
	else {
		correspondingObj.material.forEach(group => {
			group.opacity = 0.33;
		})
	}
	

	setTimeout(function () { correspondingObj.material.opacity = 1 }, 5000);
}


function remove3DFeedback() {
	let furniturelist = document.querySelectorAll('#room-config-objects-wrapper li');
	let arr = Array.from(furniturelist);
	let ix = arr.indexOf(this);

	let correspondingObj = roomFurniture[ix];

	if (!Array.isArray(correspondingObj.material)) correspondingObj.material.opacity = 1;

	else {
		correspondingObj.material.forEach(group => {
			group.opacity = 1;
		})
	}
	
}

function setupLights() {

	roomLights.forEach(light => {
		scene.remove(light);
	})
	const pntLight = new THREE.PointLight(0xffffff, 0.2);
	pntLight.position.set(0, h, 0)

	const ambLight = new THREE.AmbientLight(0xffffff, 0.8);


	roomLights.push(pntLight);
	roomLights.push(ambLight);

	scene.add(pntLight);
	scene.add(ambLight);

}

function shipProduct() {
	if (roomFurniture.length > 20) {
		statusMessage("Antalet möbler i rummet kan inte överstiga 20");
		return;
	}

	let artnr = this.getAttribute("data-artnr");
	const product = getProduct(artnr);

	create3D_object(product);
}


function create3D_object(product, rotation, position) {

	loader.load
		(
			product.modelpath,
			function (gltf) {
				let object = gltf.scene;
				initializeObject(object, product, rotation, position);
			},
			undefined,
			function (error) {
				console.error(error);
			});
}

function mergedGeometries(obj, product) {

	if (product.simple) return obj.children[0];

	var materials = [new THREE.MeshLambertMaterial({ color: new THREE.Color(product.colors[0]) })];

	product.colorconstants.forEach(value => {
		materials.push(new THREE.MeshLambertMaterial({ color: new THREE.Color(value)}))
	})	

	const meshes = obj.children;

	const geometries = [];

	meshes.forEach(mesh => {
	
		mesh.geometry.deleteAttribute('uv');
		geometries.push(mesh.geometry);
		
	})
	
	const combined = BufferGeometryUtils.mergeBufferGeometries(geometries, true); 
	
	combined.groupsNeedUpdate = true;
	return new THREE.Mesh(combined, materials);
}

function initializeObject(obj, product, rot, pos) {

	if (rot == null) rot = 180;

	let object = mergedGeometries(obj, product);

	object.geometry.computeBoundingBox();
	object.rotation.y = 2 * Math.PI * (rot / 360);
	object.userData.artnr = product.artnr;

	if (pos) {
		object.position.set(pos[0], pos[1], pos[2]); 
	}

	if (product.simple) object.userData.isComplex = false;
	else object.userData.isComplex = true;

	if (roomFurniture.length == 0) {
		object.userData.id = 0;
	}

	else {
		let lastIx = roomFurniture.length - 1;
		let id = (roomFurniture[lastIx].userData.id) + 1;

		object.userData.id = id;
	}

	if (product.simple) {
		object.material = new THREE.MeshLambertMaterial({ color: product.colors[0] });
	}

	
	object.userData.currentColor = product.colors[0];
	
	let scale = calculateReferenceScale(object, product.dimensions.height);
	object.geometry.scale(scale, scale, scale);


	let objBounds = new THREE.Box3().setFromObject(object);
	let offsetX = Math.abs(objBounds.max.x - objBounds.min.x) / 2;
	let offsetY = Math.abs(objBounds.max.y - objBounds.min.y) / 2;
	let offsetZ = Math.abs(objBounds.max.z - objBounds.min.z) / 2;

	objBounds = null;
	
	object.userData.offsetX = offsetX;
	object.userData.offsetY = offsetY;
	object.userData.offsetZ = offsetZ;

	object.userData.limit = {//Definiera X/Z koordinater för ytans dragbara gräns
		min: new THREE.Vector3(-(w / 2) + offsetX, (offsetY), -(l / 2) + offsetZ),
		max: new THREE.Vector3((w / 2) - offsetX, (offsetY), (l / 2) - offsetZ)
	};

	object.userData.update = function () {
		object.position.clamp(object.userData.limit.min, object.userData.limit.max); 
	}

	

	object.userData.deg = object.rotation.y * (rot / Math.PI);

	dragObjects.push(object);
	scene.add(object);
	roomFurniture.push(object);

	object.addEventListener("click", () => {
		console.log(object.position, object.rotation);
	})

	updateList();
}

function updateList() {

	const list = document.querySelector("#room-config-objects-wrapper ul");

	list.innerHTML = "";

	const p = document.createElement("h3");
	p.innerText = "Konfigurera möbler";

	list.appendChild(p);

	roomFurniture.forEach(furniture => {

		const artnr = furniture.userData.artnr;
		const product = getProduct(artnr);

		const wrapper = document.createElement("div");
		wrapper.classList.add("added-item-wrapper");

		const li = document.createElement("li");
		li.addEventListener("pointerdown", show3Dfeedback)
		li.addEventListener("pointerup", remove3DFeedback)

		const extraPanel = document.createElement("div");
		extraPanel.classList.add("extraPanel");

		const colorInputs = getColorInputs(product);
		const colorInputNodes = Array.from(colorInputs.childNodes);
		const colorIndex = colorInputNodes.findIndex(element => element.getAttribute("value") == furniture.userData.currentColor);

		colorInputNodes[colorIndex].classList.add("checked");

		const deleteButton = document.createElement("div");
		deleteButton.classList.add("product-delete-button");
		deleteButton.addEventListener("click", deleteObject);

		const hideButton = document.createElement("div");
		hideButton.classList.add("product-hide-button");
		hideButton.addEventListener("click", hideObject);

		const buttonWrapper = document.createElement("div");
		buttonWrapper.appendChild(hideButton);
		buttonWrapper.appendChild(deleteButton);


		extraPanel.appendChild(colorInputs);
		extraPanel.appendChild(buttonWrapper);



		const img = document.createElement("img");
		img.src = product.imgsource[0];
		img.alt = product.imgalt;

		const header = document.createElement("h3");
		header.innerText = "";

		const transformWrapper = document.createElement("div");

		const slider = document.createElement("input");
		slider.type = "range";
		slider.min = 0;
		slider.max = 360;
		slider.step = 1;

		slider.addEventListener("input", rotateObject);
		slider.value = furniture.userData.deg;

		const rotValueSpan = document.createElement("span");
		rotValueSpan.id = "span-rotate";
		rotValueSpan.innerText = slider.value + "°";

		transformWrapper.appendChild(slider);
		transformWrapper.appendChild(rotValueSpan);


		li.appendChild(img);
		li.appendChild(header);
		li.appendChild(transformWrapper);

		wrapper.appendChild(li);
		wrapper.appendChild(extraPanel);



		list.appendChild(wrapper);
	})

	list.lastChild.scrollIntoView({ behavior: "smooth" });
}

function deleteObject() {
	let furniturelist = document.querySelectorAll('#room-config-objects-wrapper li');
	let arr = Array.from(furniturelist);
	let ix = arr.indexOf(this.parentElement.parentElement.parentElement.firstChild);

	
	
	const objId = roomFurniture[ix].userData.id;
	let index = roomFurniture.findIndex(furniture => furniture.userData.id == objId);
	const list = document.querySelectorAll("#room-config-objects-wrapper li");
	list[index].parentElement.remove();
	scene.remove(roomFurniture[ix]);
	roomFurniture.splice(ix, 1);
	
	index = dragObjects.findIndex(furniture => furniture.userData.id == objId);
	dragObjects.splice(index, 1);
	
}

function hideObject() {
	let furniturelist = document.querySelectorAll('#room-config-objects-wrapper li');
	let arr = Array.from(furniturelist);
	let ix = arr.indexOf(this.parentElement.parentElement.parentElement.firstChild);

	if (this.classList.contains("hidden")) {
		this.classList.remove('hidden');
		roomFurniture[ix].visible = true;
		return;
	}

	roomFurniture[ix].visible = false;

	this.classList.add('hidden');
}

function getColorInputs(product) {

	const wrapper = document.createElement("div");

	product.colors.forEach(colorValue => {
		const input = document.createElement("div");
		input.setAttribute("value", colorValue);
		input.classList.add("product-color-input");
		input.addEventListener("click", setObjectColor);
		input.style.background = colorValue;

		wrapper.appendChild(input);
	})

	return wrapper;
}

function setObjectColor() {

	const furniturelist = document.querySelectorAll('#room-config-objects-wrapper li');
	const arr = Array.from(furniturelist);
	const ix = arr.indexOf(this.parentElement.parentElement.parentElement.firstChild);



	const img = this.parentElement.parentElement.parentElement.firstChild.firstChild;
	const imgsrc = img.src;
	const pattern = /_[0-9]+\.png/i;

	let substr = pattern.exec(imgsrc);
	const colorIx = Array.from(this.parentElement.childNodes).indexOf(this);

	const replaced = substr[0].replace(/[0-9]/, colorIx);
	const newImgSrc = imgsrc.replace(/_[0-9]+\.png/i, replaced);
	img.src = newImgSrc;	

	const correspondingObj = roomFurniture[ix];

	if (correspondingObj.userData.isComplex) correspondingObj.material[0].color.setHex(this.getAttribute("value").replace("#", "0x"));

	
	else correspondingObj.material.color.setHex(this.getAttribute("value").replace("#", "0x"));
	
	correspondingObj.userData.currentColor = this.getAttribute("value");

	const inputs = this.parentElement.childNodes;
	inputs.forEach(input => {
		input.classList.remove("checked");
	})

	this.classList.add("checked");

}

function rotateObject() {

	const furniturelist = document.querySelectorAll('#room-config-objects-wrapper li');
	const arr = Array.from(furniturelist);
	const ix = arr.indexOf(this.parentElement.parentElement);

	const correspondingObj = roomFurniture[ix];

	const deg = 2 * Math.PI * (this.value / 360);

	correspondingObj.rotation.y = -deg;

	updateClamping(correspondingObj);

	correspondingObj.userData.deg = this.value;

	this.parentElement.querySelector('span').innerText = this.parentElement.querySelector('input').value + "°";
}

function updateClamping(object) {

	let objBounds = new THREE.Box3().setFromObject(object);
	let offsetX = Math.abs(objBounds.max.x - objBounds.min.x) / 2;
	let offsetY = Math.abs(objBounds.max.y - objBounds.min.y) / 2;
	let offsetZ = Math.abs(objBounds.max.z - objBounds.min.z) / 2;

	objBounds = null;
	
	object.userData.offsetX = offsetX;
	object.userData.offsetY = offsetY;
	object.userData.offsetZ = offsetZ;

	object.userData.limit = {
		min: new THREE.Vector3(-(w / 2) + offsetX, (offsetY), -(l / 2) + offsetZ),
		max: new THREE.Vector3((w / 2) - offsetX, (offsetY), (l / 2) - offsetZ)
	};
}

function recalculateObjects() {
	roomFurniture.forEach(object => {
		updateClamping(object);
	})
}

function calculateReferenceScale(object, targetHeight) {

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

	let cube = new THREE.Mesh(geometry, material);
	let refBounds = new THREE.Box3().setFromObject(cube);
	let yBoundRef = Math.abs(refBounds.max.y - refBounds.min.y);

	let objBounds = new THREE.Box3().setFromObject(object);
	let yBoundObj = Math.abs(objBounds.max.y - objBounds.min.y);

	let target = yBoundRef * targetHeight;

	let ratio = (target / yBoundObj);

	return ratio;
}

function run() {

	initScene();
	let params = new URLSearchParams(document.location.search);

	let room = null;

	if (params.get('room')) {
		room = rooms[params.get('room')];

		l = room.room.length;
		w = room.room.width;
		h = room.room.height;

		room.objects.forEach(object => {
			const product = getProduct(object.artnr);
			create3D_object(product, object.rotation, object.position);

		})
	}

	products.forEach(product => {

		const card = new ProductCard(product);
		const node = card.toHTML();
		node.setAttribute("data-artnr", product.artnr);
		node.addEventListener("click", shipProduct);

		document.querySelector("#productlist").appendChild(node);
	});

	
	const incrSpinners = document.querySelectorAll(".spinner-up");
	const decrSpinners = document.querySelectorAll(".spinner-down");

	incrSpinners.forEach(spinner => {
		spinner.addEventListener("click", incrementField);
	})

	decrSpinners.forEach(spinner => {
		spinner.addEventListener("click", decrementField);
	})

	

	const dimInputs = document.querySelectorAll('.field-dim');

	dimInputs.forEach(input => {
		input.addEventListener("click", handleKeyboard);
	})

	keyboard = new Keyboard(dimInputs[0], redrawRoom);
	document.querySelector("body").appendChild(keyboard.outHTML());


	const roomColorInputs = document.querySelectorAll(".room-color-input");

	roomColorInputs.forEach(input => {
		input.style.background = input.getAttribute("value");
		input.addEventListener("click", setRoomColor);
	})

	const selections = document.querySelectorAll(".checked");

	roomColors = [
		selections[0].getAttribute("value"),
		selections[1].getAttribute("value"),
		selections[2].getAttribute("value")
	];

	document.querySelector("#button-expand").addEventListener("click", toggleAccordion);

	
	roomConstructor(l, w, h);

	

    if(params.get('display')) {

		const product = getProduct(params.get('display'));
		create3D_object(product);
	}

	


}

function setRoomColor() {

	const affectedField = this.parentElement.querySelectorAll("div");

	for (let i = 0; i < affectedField.length; i++) {
		affectedField[i].classList.remove("checked");
	}

	this.classList.add("checked");

	const selections = document.querySelectorAll(".checked");

	roomColors = [
		selections[0].getAttribute("value"),
		selections[1].getAttribute("value"),
		selections[2].getAttribute("value")
	];

	redrawRoom();
}

function getProduct(artnr) {

	let target;
	products.forEach(product => {
		if (product.artnr == artnr) target = product;
	});
	return target;
}

function incrementField() {
	let value = parseFloat(this.parentElement.querySelector("input").value);
	
	value++;


	if (value > 10) {
		this.parentElement.querySelector("input").value = 10 + "m";
		return;
	}
	else if (value < 1) {
		this.parentElement.querySelector("input").value = 1 + "m";
		return;
	}
	this.parentElement.querySelector("input").value = value + "m";;
	redrawRoom();
}

function decrementField() {
	let value = parseFloat(this.parentElement.querySelector("input").value);

	
	value--;

	if (value < 1) {
		this.parentElement.querySelector("input").value = 1 + "m";
		return;
	}
	else if (value > 10) {
		this.parentElement.querySelector("input").value = 10 + "m";
		return;
	}
	this.parentElement.querySelector("input").value = value;
	redrawRoom();
}

function toggleAccordion() {
	console.log(this.parentElement.lastChild)
	this.parentElement.querySelector(".room-colors").classList.toggle('visible');
}

function handleKeyboard() {

	const field = this;
	this.value = "";
	keyboard.updateField(this);
	
	document.querySelector("body .keyboard").classList.add("visible");

}


