import React from 'react'
import { useRef, useCallback, useState, useEffect } from 'react'
import * as THREE from '../../public/threejs/node_modules/three/build/three.module.js';
import MyVerticallyCenteredModal from './PopupWindow'
import Dataplot from './Plot'
import { OrbitControls } from '../../public/threejs/node_modules/three/examples/jsm/controls/OrbitControls.js';
const Testapp = (props) => {
    const mainVisRef = useRef(null);
    let ifblock = true;
    let ifhidecusor = false;
    const [traction, changetraction] = useState(null);
    const [aflow, changeaflow] = useState(null);
    const [modulenum, changemodulenum] = useState(null);
    const [time, changetime] = useState(null);
    const [feature, changefeature] = useState(['cell_pos_x', 'cell_pos_y', 'time']);
    if (window.localStorage.getItem('feature') === null){
        window.localStorage.setItem('feature', feature)
    }
    function changeInput (input_from_panel){
        //changefeature(old_array => input_from_panel)
    }

    useEffect( async  () => {
        let data = null
        let res = await fetch('/databasepost', 
            {   
                method:'POST', 
                headers:{'Accept':'application/json', 'Content-type':'application/json'},
                body: JSON.stringify({required: window.localStorage.getItem('feature').split(',')})
            })
        
        let res2 = await fetch('/databaseget')
        let back = await res2.json()
        data = back["result"]
        
        let spheresIndex = 0;
        let api_set = new Set();
        let curveid;
        var vec = new THREE.Vector3();
        var pos = new THREE.Vector3();
        let curveobjects;
        let clock, camera, scene, raycaster, renderer, parentTransform, sphereInter;
        let tempcurveobjects = new THREE.Object3D();
        let smallcurveobjects = new THREE.Object3D();
        let selectedcurve = false;
        const spheres = [];
        const mouse = new THREE.Vector2();
        const radius = 100;
        let theta = 0;
        let toggle = 0;
        let controls;
        const mainVis = mainVisRef.current;
        let camera_pivot = new THREE.Object3D();
        let angle = 0;
        let all_object = new THREE.Object3D();
        init();
        animate();




        function init() {


            const info = document.createElement( 'div' );
            info.style.position = 'absolute';
            info.style.top = '10px';
            info.style.width = '100%';
            info.style.textAlign = 'center';
            scene = new THREE.Scene();

            scene.add(all_object);
            all_object.add( camera_pivot );
            camera_pivot.position.set(0, 200, 0)
            camera = new THREE.PerspectiveCamera( 70, mainVis.clientWidth/mainVis.clientHeight, 1, 10000 );
            camera.position.set( 0, 200, 300);
            camera.lookAt( camera_pivot.position );
            
            clock = new THREE.Clock();
            scene.background = new THREE.Color( 0xFFFFFF );

            const geometry = new THREE.SphereGeometry( 2 );
            const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

            sphereInter = new THREE.Mesh( geometry, material );
            sphereInter.visible = false;
            all_object.add( sphereInter );

            const curves = [];
            curveobjects = new THREE.Object3D();
            for (let j = 0; j < 20; j++) {
                curves.push([])
                for ( let i = 0; i < data[0][0].length; i ++ ) {
                    const direction = new THREE.Vector3();
                    const point = new THREE.Vector3();
                    direction.x = data[j][0][i];
                    direction.z = data[j][1][i];
                    direction.y = data[j][2][i];
                    point.add(direction);
                    curves[j].push(point.x, point.y, point.z);
                }
                let lineGeometry = new THREE.BufferGeometry();
                lineGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( curves[j], 3 ) );
                let lineMaterial = new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff , opacity: 1, transparent: true} );
                const object = new THREE.Line( lineGeometry, lineMaterial );
                object.name = j
                curveobjects.add( object );
            }
            all_object.add(curveobjects)

            raycaster = new THREE.Raycaster();
            raycaster.params.Line.threshold = 3;
            
            const sphereGeometry = new THREE.SphereGeometry( 3, 32, 32 );
            const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff , sizeAttenuation: false} );

            for ( let i = 0; i < 40; i ++ ) {

                const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
                scene.add( sphere );
                spheres.push( sphere );

            }

            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( mainVis.clientWidth, mainVis.clientHeight );
            mainVis.appendChild( renderer.domElement );

            window.addEventListener( 'mousemove', onDocumentMouseMove );
            window.addEventListener( 'mousedown', onDocumentMouseDown );
            window.addEventListener( 'resize', onWindowResize );
            window.addEventListener( 'keydown', onDocumentKeyDown );
            /*
            controls = new OrbitControls( camera, renderer.domElement );
            controls.update();
            */
        }
        function onDocumentKeyDown(event) {
            let keyCode = event.which;
            if (keyCode == 37) {
                all_object.rotateY(0.02)
                //camera.position.x = 250 * Math.cos( angle )-250;  
                //camera.position.z = 250 * Math.sin( angle )+300;
                //angle += 0.005
                //camera.lookAt( camera_pivot.position );
            } else if (keyCode == 39) {
                all_object.rotateY(-0.02)
                //camera.position.x = 250 * Math.cos( angle )-250;  
                //camera.position.z = 250 * Math.sin( angle )+300;
                //angle -= 0.005
                //camera.lookAt( camera_pivot.position );
            }
            else if(event.which == 27){
                ifblock = !ifblock;
                ifhidecusor = !ifhidecusor;
                if(ifhidecusor){
                    document.body.style.cursor = "none";
                } else {
                    document.body.style.cursor = "default";
                }
            }
        }

        function onWindowResize() {

            camera.aspect = mainVis.clientWidth/mainVis.clientHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( mainVis.clientWidth, mainVis.clientHeight );

        }

        function processdata(inputdata){
            //console.log(inputdata['results'][0][0])
            for (let curvecount = 0; curvecount < inputdata['results'].length; curvecount++) {
                let startp = inputdata['results'][curvecount][0]
                let endp = inputdata['results'][curvecount][1]
                let tempcurves = []
                for (let i = startp+1; i <= endp; i++){
                    tempcurves.push([])
                    for (let j = 0; j < 2; j++){
                        const direction = new THREE.Vector3();
                        const point = new THREE.Vector3();
                        direction.x = data[curvecount][0][i-j];
                        direction.z = data[curvecount][1][i-j];
                        direction.y = data[curvecount][2][i-j];
                        point.add(direction);
                        tempcurves[i-1-startp].push(point.x, point.y, point.z);
                    }
                    let tlineGeometry = new THREE.BufferGeometry();
                    tlineGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( tempcurves[i-1-startp], 3 ) );
                    let tlineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 , opacity: 1, transparent: true} );
                    const tobject = new THREE.Line( tlineGeometry, tlineMaterial );
                    smallcurveobjects.add( tobject );
                }
            }
            all_object.add(smallcurveobjects);
        }

        function onDocumentMouseMove( event ) {

            event.preventDefault();

            mouse.x = ( event.clientX / mainVis.clientWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / mainVis.clientHeight ) * 2 + 1;
            

        }
        
        function onDocumentMouseDown( event ) {
            event.preventDefault();
            /*
            controls.enabled = false
            */
           if (!ifblock){
            mouse.set( ( event.clientX / mainVis.clientWidth ) * 2 - 1, - ( event.clientY / mainVis.clientHeight ) * 2 + 1 );

            raycaster.setFromCamera( mouse, camera );

            const intersects = raycaster.intersectObjects( curveobjects.children );
            const intersects2 = raycaster.intersectObjects( tempcurveobjects.children );
            if (selectedcurve == false){
                if ( intersects.length > 0 ) {
                    let num_of_datapoints = data[intersects[0].object.name][0].length;
                    for (let i = 0; i < 20; i++){
                        curveobjects.children[i].material.opacity = 0.22;
                    }
                    const intersect = intersects[ 0 ];
                    intersect.object.material.opacity = 1;
                    render();
                    let tempcurves = [];
                    for (let i = 1; i < num_of_datapoints; i++){
                        tempcurves.push([])
                        for (let j = 0; j < 2; j++){
                            const direction = new THREE.Vector3();
                            const point = new THREE.Vector3();
                            direction.x = data[intersect.object.name][0][i-j];
                            direction.z = data[intersect.object.name][1][i-j];
                            direction.y = data[intersect.object.name][2][i-j];
                            point.add(direction);
                            tempcurves[i-1].push(point.x, point.y, point.z);
                        }
                        let tlineGeometry = new THREE.BufferGeometry();
                        tlineGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( tempcurves[i-1], 3 ) );
                        let tlineMaterial = new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff , opacity: 1, transparent: true} );
                        const tobject = new THREE.Line( tlineGeometry, tlineMaterial );
                        tobject.name = String((i-1));
                        tempcurveobjects.add( tobject );
                    }
                    all_object.add(tempcurveobjects);
                    selectedcurve = true;
                    curveid = intersects[0].object.name
                    intersect.object.visible = false
                } else {
                    selectedcurve = false;
                    for (let i = 0; i < 20; i++){
                        curveobjects.children[i].material.opacity = 1;
                    }
                }
            } 
            else {
                if (intersects2.length > 0){
                    let num_of_datapoints = data[intersects[0].object.name][0].length;
                    for (let i = 0; i < num_of_datapoints-1; i++){
                        if (tempcurveobjects.children[i].material.opacity != 0.9314){
                            tempcurveobjects.children[i].material.opacity = 0.5;
                        }
                    }
                    const intersect = intersects2[0];
                    intersect.object.material.color.setHex(0xff0000);
                    intersect.object.material.opacity = 0.9314
                    api_set.add(intersect.object.name)
                    fetch('/api', 
                    {   
                        method:'POST', 
                        headers:{'Accept':'application/json', 'Content-type':'application/json'},
                        body: JSON.stringify({input: Array.from(api_set), curveid: curveid})
                    }).then((res) => {
                    fetch('/result').then((res) => res.json()).then((data) => {
                        console.log(data); 
                        all_object.remove(smallcurveobjects);
                        smallcurveobjects = new THREE.Object3D(); 
                        processdata(data)})
                    }).then(() => {
                        if (window.localStorage.getItem('ifsplit') === 'true'){
                            fetch('/resultplot').then((res) => res.json()).then((data) => {
                                console.log(data)
                                changetraction(data['traction'])
                                changeaflow(data['aflow'])
                                changemodulenum(data['module_num'])
                                changetime(data['time'])
                            })
                        }
                    })
                    
                }
            }
        }
        }

        function animate() {

            requestAnimationFrame( animate );
            /*
            controls.update();
            */
            render();

        }

        function render() {

            // find intersections
            //const rotateY = new THREE.Matrix4().makeRotationY( 0.005 );
            //camera.applyMatrix4( rotateY );
            raycaster.setFromCamera( mouse, camera );

            const intersects = raycaster.intersectObjects( curveobjects.children, true );

            if ( intersects.length > 0) {

                sphereInter.visible = false;
                sphereInter.position.copy( intersects[ 0 ].point );

            } else {

                sphereInter.visible = false;

            }

            renderer.render( scene, camera );
            
            var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject( camera );
            var dir = vector.sub( camera.position ).normalize();
            var distance =  - camera.position.z / dir.z;
            pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

            
            if ( toggle > 0.02) {

                spheres[ spheresIndex ].position.copy(pos);
                spheres[ spheresIndex ].scale.set( 1, 1, 1 );
                spheresIndex = ( spheresIndex + 1 ) % spheres.length;

                toggle = 0;

            }
            for ( let i = 0; i < spheres.length; i ++ ) {

                const sphere = spheres[ i ];
                sphere.scale.multiplyScalar( 0.97 );
                sphere.scale.clampScalar( 0.01, 10 );

            }
            
            toggle += clock.getDelta();
                
			}    
    }, []);

    const [modalShow, setshow] = useState(true)
    const escFunction = ((event) => {
        if(event.keyCode === 27) {
          setshow(modalShow => !modalShow)
        }
      });
    useEffect(() => {
        document.addEventListener("keydown", escFunction);
        return () => {
          document.removeEventListener("keydown", escFunction);
        };
    }, []);

    if(window.localStorage.getItem('ifsplit') === 'false'){
        return <>
        <div 
            className = 'mainvisualization' 
            style = {{height : '100%', width: window.localStorage.getItem('ifsplit') === 'true'? '50%':'100%', border: '10px solid rgba(0, 0, 0, 0.7)'}} 
            ref = {mainVisRef}
        />
        <MyVerticallyCenteredModal
            show={modalShow}
            backdrop = 'static'
            changeInput = {changeInput}
        />
        </>
    } else {
    return <>
        <div style = {{height: '100%', width: '100%' , display:'flex', flexDirection:'row'}}>
            <div 
                className = 'mainvisualization' 
                style = {{height : '100%', width: window.localStorage.getItem('ifsplit') === 'true'? '50%':'100%', border: '10px solid rgba(0, 0, 0, 0.7)'}} 
                ref = {mainVisRef}
            />
            <MyVerticallyCenteredModal
                show={modalShow}
                backdrop = 'static'
                changeInput = {changeInput}
            />
            <Dataplot
                traction = {traction}
                aflow = {aflow}
                modulenum = {modulenum}
                time = {time}
            />
        </div>
    </>
    }
}

export default Testapp


