import { Engine, HemisphericLight, Scene, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';
import * as ZapparBabylon from '@zappar/zappar-babylonjs-es6';

import "./style.css";

// Setup BabylonJS in the usual way
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true
});

export const scene = new Scene(engine);
const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);

// Setup a Zappar camera instead of one of Babylon's cameras
export const camera = new ZapparBabylon.Camera('camera', scene);

// Request the necessary permission from the user
ZapparBabylon.permissionRequestUI().then((granted) => {
    if (granted) camera.start(true);
    else ZapparBabylon.permissionDeniedUI();
});

// Set up our image tracker transform node
const faceTracker = new ZapparBabylon.FaceTrackerLoader().load();
const trackerTransformNode = new ZapparBabylon.FaceTrackerTransformNode('tracker', camera, faceTracker, scene);

const material = new StandardMaterial('mat', scene);
material.diffuseTexture = new Texture(require("file-loader!./faceMeshTemplate.png").default, scene);

// Face mesh
const faceMesh = new ZapparBabylon.FaceMeshGeometry('mesh', scene);
faceMesh.parent = trackerTransformNode;
faceMesh.material = material;



window.addEventListener('resize', () => {
    engine.resize();
});

// Set up our render loop
engine.runRenderLoop(() => {
    faceMesh.updateFromFaceTracker(faceTracker);
    camera.updateFrame();
    scene.render();
});
