"use strict";

const canvas = document.getElementById("renderCanvas");
const statusText = document.getElementById("scene-status");
const resetButton = document.getElementById("reset-view");
const pulseButton = document.getElementById("pulse-button");
let engine;

function createScene() {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.06, 0.12, 0.15, 1);

  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 3.5, -10), scene);
  camera.setTarget(new BABYLON.Vector3(0, 1.4, 0));
  camera.attachControl(canvas, true);
  camera.speed = 0.25;

  const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
  hemiLight.intensity = 0.7;

  const pointLight = new BABYLON.PointLight("coreLight", new BABYLON.Vector3(0, 2, 0), scene);
  pointLight.intensity = 5;
  pointLight.diffuse = new BABYLON.Color3(0.9, 0.3, 0.15);

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 40, height: 40 }, scene);
  ground.material = new BABYLON.StandardMaterial("groundMat", scene);
  ground.material.diffuseColor = new BABYLON.Color3(0.12, 0.15, 0.12);
  ground.material.specularColor = new BABYLON.Color3(0.06, 0.06, 0.06);

  const fridgeGroup = new BABYLON.TransformNode("fridgeGroup");
  fridgeGroup.position.y = 0.2;

  const bodyMat = new BABYLON.StandardMaterial("bodyMat", scene);
  bodyMat.diffuseColor = new BABYLON.Color3(0.77, 0.82, 0.86);
  bodyMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  const body = BABYLON.MeshBuilder.CreateBox("fridgeBody", { width: 3.8, height: 5.4, depth: 2.4 }, scene);
  body.material = bodyMat;
  body.parent = fridgeGroup;

  const doorMat = new BABYLON.StandardMaterial("doorMat", scene);
  doorMat.diffuseColor = new BABYLON.Color3(0.36, 0.41, 0.48);

  const door = BABYLON.MeshBuilder.CreateBox("fridgeDoor", { width: 3.1, height: 4.9, depth: 0.22 }, scene);
  door.position.x = 0.2;
  door.position.z = 1.1;
  door.material = doorMat;
  door.parent = fridgeGroup;

  const handle = BABYLON.MeshBuilder.CreateCylinder("handle", { diameter: 0.14, height: 0.8, tessellation: 12 }, scene);
  handle.rotation.z = Math.PI / 2;
  handle.position = new BABYLON.Vector3(0.9, 0, 1.18);
  handle.parent = fridgeGroup;

  const rottenCore = BABYLON.MeshBuilder.CreateSphere("core", { diameter: 1.5, segments: 32 }, scene);
  rottenCore.position.y = 0.55;
  rottenCore.parent = fridgeGroup;

  const rottenMat = new BABYLON.StandardMaterial("rottenMat", scene);
  rottenMat.diffuseColor = new BABYLON.Color3(0.36, 0.68, 0.18);
  rottenMat.emissiveColor = new BABYLON.Color3(0.6, 0.9, 0.2);
  rottenMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  rottenCore.material = rottenMat;

  const aura = BABYLON.MeshBuilder.CreateSphere("aura", { diameter: 4.8, segments: 32 }, scene);
  aura.position.y = 0.6;
  aura.parent = fridgeGroup;
  const auraMat = new BABYLON.StandardMaterial("auraMat", scene);
  auraMat.diffuseColor = new BABYLON.Color3(0.75, 0.18, 0.12);
  auraMat.emissiveColor = new BABYLON.Color3(0.5, 0.1, 0.08);
  auraMat.alpha = 0.28;
  auraMat.backFaceCulling = false;
  aura.material = auraMat;

  const corruptionRing = BABYLON.MeshBuilder.CreateTorus("ring", { diameter: 5.8, thickness: 0.28, tessellation: 30 }, scene);
  corruptionRing.position.y = 0.5;
  corruptionRing.rotation.x = Math.PI / 2;
  corruptionRing.parent = fridgeGroup;
  const ringMat = new BABYLON.StandardMaterial("ringMat", scene);
  ringMat.diffuseColor = new BABYLON.Color3(0.45, 0.15, 0.1);
  ringMat.emissiveColor = new BABYLON.Color3(0.75, 0.22, 0.16);
  ringMat.alpha = 0.8;
  ringMat.backFaceCulling = false;
  corruptionRing.material = ringMat;

  const foodMaterials = [
    new BABYLON.StandardMaterial("food1", scene),
    new BABYLON.StandardMaterial("food2", scene),
    new BABYLON.StandardMaterial("food3", scene),
    new BABYLON.StandardMaterial("food4", scene),
    new BABYLON.StandardMaterial("food5", scene)
  ];

  foodMaterials.forEach((mat, index) => {
    mat.diffuseColor = new BABYLON.Color3(0.28 + index * 0.08, 0.22 + index * 0.06, 0.2 + index * 0.05);
    mat.emissiveColor = new BABYLON.Color3(0.23, 0.1, 0.06 + index * 0.08);
  });

  const foodPositions = [
    new BABYLON.Vector3(-1.1, 2.2, 0.6),
    new BABYLON.Vector3(0.4, 1.6, 0.7),
    new BABYLON.Vector3(1.2, 2.5, -0.5),
    new BABYLON.Vector3(-0.7, 0.7, 0.4),
    new BABYLON.Vector3(1.1, 0.8, -0.3)
  ];

  foodPositions.forEach((position, index) => {
    const food = BABYLON.MeshBuilder.CreateSphere(`food${index + 1}`, { diameter: 0.8, segments: 12 }, scene);
    food.position = position;
    food.parent = fridgeGroup;
    food.material = foodMaterials[index % foodMaterials.length];
  });

  const hammer = BABYLON.MeshBuilder.CreateBox("hammer", { width: 1.1, height: 0.24, depth: 0.32 }, scene);
  hammer.position = new BABYLON.Vector3(4.8, 2.2, 0);
  hammer.rotation.z = 0.5;
  hammer.material = new BABYLON.StandardMaterial("hammerMat", scene);
  hammer.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
  hammer.material.emissiveColor = new BABYLON.Color3(0.18, 0.18, 0.28);

  const hammerHead = BABYLON.MeshBuilder.CreateBox("hammerHead", { width: 0.7, height: 0.7, depth: 0.44 }, scene);
  hammerHead.position = new BABYLON.Vector3(5.3, 2.15, 0);
  hammerHead.material = new BABYLON.StandardMaterial("hammerHeadMat", scene);
  hammerHead.material.diffuseColor = new BABYLON.Color3(0.9, 0.74, 0.26);
  hammerHead.material.emissiveColor = new BABYLON.Color3(0.3, 0.22, 0.08);

  const cleaner = BABYLON.MeshBuilder.CreateSphere("cleaner", { diameter: 0.8, segments: 16 }, scene);
  cleaner.position = new BABYLON.Vector3(-4.2, 2.2, 0);
  cleaner.material = new BABYLON.StandardMaterial("cleanerMat", scene);
  cleaner.material.diffuseColor = new BABYLON.Color3(0.84, 0.96, 1);
  cleaner.material.emissiveColor = new BABYLON.Color3(0.3, 0.45, 0.6);

  let pulseStrength = 1;
  const pulseAnimation = () => {
    const t = performance.now() * 0.002;
    aura.scaling.x = 1 + Math.sin(t * 2) * 0.12 + pulseStrength;
    aura.scaling.y = 1 + Math.sin(t * 2 + 0.8) * 0.12 + pulseStrength;
    aura.scaling.z = 1 + Math.sin(t * 2 + 1.2) * 0.12 + pulseStrength;
    corruptionRing.rotation.z += 0.02;
    door.rotation.y = Math.sin(t * 1.5) * 0.12;
    fridgeGroup.rotation.y = Math.sin(t * 0.9) * 0.18;
  };

  const resetScene = () => {
    camera.position.set(0, 3.5, -10);
    camera.setTarget(new BABYLON.Vector3(0, 1.4, 0));
    pulseStrength = 1;
    aura.scaling.setAll(1);
    corruptionRing.rotation.x = Math.PI / 2;
    fridgeGroup.rotation.set(0, 0, 0);
    statusText.textContent = "Battle reset. The fridge is still pulsing, but the hero is ready.";
  };

  resetButton.addEventListener("click", resetScene);

  pulseButton.addEventListener("click", () => {
    pulseStrength = 1.8;
    statusText.textContent = "Mr. Clean's cleansing pulse hits the rotten core!";
  });

  engine.runRenderLoop(() => {
    pulseAnimation();
    if (pulseStrength > 1) {
      pulseStrength = Math.max(1, pulseStrength - 0.015);
    }
    scene.render();
  });

  return scene;
}

try {
  if (!window.BABYLON || !BABYLON.Engine.isSupported()) {
    throw new Error("The Babylon.js engine or WebGL is unavailable.");
  }

  engine = new BABYLON.Engine(canvas, true);
  const scene = createScene();
  window.addEventListener("resize", () => engine.resize());

  statusText.textContent = "Scene ready: the evil fridge is pulsing with rotten power.";
  resetButton.disabled = false;

  if (scene) {
    console.log("Fridge scene loaded successfully.");
  }
} catch (error) {
  if (engine) {
    engine.dispose();
  }
  canvas.hidden = true;
  statusText.textContent = "The 3D battle could not start. Please reload the page and keep the week4 folder together.";
  console.error("Scene startup:", error);
}
