/// <reference path='./vendor/babylon.d.ts' />

//get our canvas
const canvas = document.getElementById("renderCanvas");

//create a BabylonJS engine
const engine = new BABYLON.Engine(canvas, true);

function createCamera(scene) {
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,
    0,
    15,
    BABYLON.Vector3.Zero(),
    scene
  );
  //let user move our camera
  camera.attachControl(canvas);

  //limit camera movement
  camera.lowerRadiusLimit = 6;
  camera.upperRadiusLimit = 20;
}

function createLight(scene) {
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.5;
  light.groundColor = new BABYLON.Color3(0, 0, 1);
}

function createSun(scene) {
  const sunMaterial = new BABYLON.StandardMaterial("sunMaterial", scene);
  sunMaterial.emissiveTexture = new BABYLON.Texture(
    "assets/images/sun.jpg",
    scene
  );
  sunMaterial.diffuseColor = BABYLON.Color3.Black();
  sunMaterial.specularColor = BABYLON.Color3.Black();
  const sun = BABYLON.MeshBuilder.CreateSphere(
    "sun",
    { segments: 16, diameter: 4 },
    scene
  );
  sun.material = sunMaterial;

  //create sun light
  const sunLight = new BABYLON.PointLight(
    "sunLinght",
    BABYLON.Vector3.Zero(),
    scene
  );
}

function createPlanet(scene) {
  const planetMaterial = new BABYLON.StandardMaterial("planetMaterial", scene);
  planetMaterial.diffuseTexture = new BABYLON.Texture(
    "assets/images/brown_rock.png",
    scene
  );
  planetMaterial.specularColor = BABYLON.Color3.Black();
  const speeds = [0.001, -0.001, 0.002];
  for (let i = 0; i < 3; i++) {
    const planet = BABYLON.MeshBuilder.CreateSphere(
      "planet",
      { segments: 16, diameter: 1 },
      scene
    );
    planet.position.x = 2 * i + 4;
    planet.position.y = 1 * i + 2;
    planet.position.Z = 3 * i - 3;
    planet.material = planetMaterial;

    planet.orbit = {
      radius: planet.position.x,
      speed: speeds[i],
      angle: 0,
    };
    scene.registerBeforeRender(() => {
      planet.position.x = planet.orbit.radius * Math.sin(planet.orbit.angle);
      planet.position.z = planet.orbit.radius * Math.cos(planet.orbit.angle);
      planet.orbit.angle += planet.orbit.speed;
    });
  }
}

function createSkybox(scene) {
  const skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
  skyboxMaterial.backFaceCulling = false;
  // remove reflection in skybox
  skyboxMaterial.specularColor = BABYLON.Color3.Black();
  skyboxMaterial.diffuseColor = BABYLON.Color3.Black();
  // texture the 6 sides of our box
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "assets/images/skybox/skybox",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;

  const skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
  //move the skybox with camera
  skybox.infiniteDistance = true;
  skybox.material = skyboxMaterial;
}

function createShip(scene) {
  BABYLON.SceneLoader.ImportMesh(
    "",
    "/assets/models/",
    "spaceCraft1.obj",
    scene,
    (meshes) => {
      meshes.forEach((mesh) => {
        mesh.position = new BABYLON.Vector3(0, -5, 10);
        mesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
      });
    }
  );
}

function createScene() {
  //create a 3D scene
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Black();

  //create a camera
  createCamera();

  //create a light
  createLight(scene);

  //create sun
  createSun(scene);

  //create the first planet
  createPlanet(scene);

  //create skybox
  createSkybox(scene);

  //create ship
  createShip(scene);

  return scene;
}

// create our scene
const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

//the canvas/window resize event handler
window.addEventListener("resize", function () {
  engine.resize();
});

//create a camera
//   //   const camera = new BABYLON.FreeCamera(
//   //     "camera",
//   //     new BABYLON.Vector3(0, 0, -5),
//   //     scene
//   //   );
//   //   const camera = new BABYLON.UniversalCamera(
//   //     "camera",
//   //     new BABYLON.Vector3(0, 0, -10),
//   //     scene
//   //   );
//   //   const camera = new BABYLON.FollowCamera(
//   //     "camera",
//   //     new BABYLON.Vector3(25, -25, -25),
//   //     scene
//   //   );
//   //   camera.radius = 30;
//   //   camera.attachControl(canvas, true);

//create a light
//   //   const light = new BABYLON.HemisphericLight(
//   //     "light",
//   //     new BABYLON.Vector3(0, 1, 0),
//   //     scene
//   //   );
//   //   const light = new BABYLON.DirectionalLight(
//   //     "light",
//   //     new BABYLON.Vector3(5, -1, 0),
//   //     scene
//   //   );

//   //create a box
//   const box = BABYLON.MeshBuilder.CreateBox(
//     "box",
//     {
//       size: 1,
//     },
//     scene
//   );
//   box.rotation.x = 2;
//   box.rotation.y = 3;

//   camera.lockedTarget = box;

//   //create a sphere
//   const sphere = new BABYLON.MeshBuilder.CreateSphere(
//     "sphere",
//     { segments: 32, diameter: 2 },
//     scene
//   );
//   sphere.position = new BABYLON.Vector3(3, 0, 0);
//   sphere.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

//   //create plane
//   const plane = new BABYLON.MeshBuilder.CreatePlane("plane", {}, scene);
//   plane.position = new BABYLON.Vector3(-3, 0, 0);

//   //create a line
//   const points = [
//     new BABYLON.Vector3(2, 0, 0),
//     new BABYLON.Vector3(2, 1, 1),
//     new BABYLON.Vector3(2, 1, 0),
//   ];
//   const lines = BABYLON.MeshBuilder.CreateLines(
//     "lines",
//     {
//       points,
//     },
//     scene
//   );

//   //create a material
//   const material = new BABYLON.StandardMaterial("material", scene);
//   material.diffuseColor = new BABYLON.Color3(1, 0, 0);
//   material.emissiveColor = new BABYLON.Color3(0, 1, 0);

//   box.material = material;

//   const material2 = new BABYLON.StandardMaterial("material2", scene);
//   material2.diffuseTexture = new BABYLON.Texture(
//     "assets/images/dark_rock.png",
//     scene
//   );

//   sphere.material = material2;
