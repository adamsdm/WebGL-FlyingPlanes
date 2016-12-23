var stats, scene, renderer, composer;
var camera, cameraControls;


if (!init()) animate();

// init the scene
function init() {

	initScene();
	addLights();
	addObjects();
}


function addObjects(){
    
    const GROUND_DIM = 200;
    const GROUND_SQUARES = 100;

	var geometry = new THREE.PlaneGeometry( GROUND_DIM, GROUND_DIM, GROUND_SQUARES, GROUND_SQUARES );
	
        console.log(geometry.vertices.length);


	for(var i=0; i<geometry.vertices.length; i++) {
		geometry.vertices[i].z += Math.random() ;
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();


	var groundMaterial = new THREE.MeshPhongMaterial( {
		color: 0xffffcc, 
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
	} );

    groundMaterial.shininess = 0;

	planeMesh = new THREE.Mesh( geometry, groundMaterial );
	
	planeMesh.position.y = -1.9
	planeMesh.rotation.x = - Math.PI/2;

	scene.add( planeMesh );


}



function initScene(){ 
if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({
            antialias: true, // to get smoother output
            preserveDrawingBuffer: true // to allow screenshot
        });
        renderer.setClearColor(0xcce6ff);
    } else {
        renderer = new THREE.CanvasRenderer();
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);


    // create a scene
    scene = new THREE.Scene();

    // put a camera in the scene
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 7);
    scene.add(camera);

    // create a camera contol
    cameraControls = new THREE.TrackballControls(camera)

    // transparently support window resize
    THREEx.WindowResize.bind(renderer, camera);
    // allow 'p' to make screenshot
    THREEx.Screenshot.bindKey(renderer);
    // allow 'f' to go fullscreen where this feature is supported
    if (THREEx.FullScreen.available()) {
        THREEx.FullScreen.bindKey();
        document.getElementById('inlineDoc').innerHTML += "- <i>f</i> for fullscreen";
    }
}

function addLights(){
    // here you add your objects
    // - you will most likely replace this part by your own

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );
   
}



// animation loop
function animate() {

    // loop on request animation loop
    // - it has to be at the begining of the function
    // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    requestAnimationFrame(animate);

    // do the render
    render();

}

// render the scene
function render() {
    // variable which is increase by Math.PI every seconds - usefull for animation
    var PIseconds = Date.now() * Math.PI;

    // update camera controls
    cameraControls.update();

    // animate PointLights
    scene.traverse(function(object3d, idx) {
        if (object3d instanceof THREE.PointLight === false) return
        var angle = 0.0005 * PIseconds * (idx % 2 ? 1 : -1) + idx * Math.PI / 3;
        object3d.position.set(Math.cos(angle) * 3, Math.sin(angle * 3) * 2, Math.cos(angle * 2)).normalize().multiplyScalar(2);
    })

    // actually render the scene
    renderer.render(scene, camera);
}