(function() {
  const scene = new THREE.Scene();
  const parent = document.getElementById('threejs-container-3');
  const parentW = Math.max(700, parent.clientWidth || 800);
  const parentH = Math.floor(parentW * 0.55);
  const camera = new THREE.PerspectiveCamera(60, parentW / parentH, 0.1, 50);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(parentW, parentH);
  renderer.setClearColor(0xf7f3ea);
  renderer.shadowMap.enabled = true;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = 'auto';

  parent.appendChild(renderer.domElement);

  scene.fog = new THREE.Fog(0xf7f3ea, 4, 18);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfff6e6, 1.0);
  directionalLight.position.set(8, 12, 6);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);

  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f1e8, roughness: 0.95, metalness: 0.0 });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.05;
  plane.receiveShadow = true;
  scene.add(plane);

  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.3, metalness: 0.25 });
  const coneMaterialA = new THREE.MeshStandardMaterial({ color: 0xf4d35e, roughness: 0.45, metalness: 0.1 });
  const coneMaterialB = new THREE.MeshStandardMaterial({ color: 0x14213d, roughness: 0.25, metalness: 0.4 });

  const group = new THREE.Group();

  for (let i = 0; i < 3; i++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), boxMaterial);
    box.position.set(-3 + i * 3.0, 0.6, -1);
    box.castShadow = true;
    box.receiveShadow = true;
    box.rotation.set(0.05 * i, 0.25 * i, -0.07 * i);
    group.add(box);
  }

  for (let i = 0; i < 6; i++) {
    const radius = 0.35 + (i % 3) * 0.1;
    const height = 1.4 + (i % 2) * 0.4;
    const material = i % 2 === 0 ? coneMaterialA : coneMaterialB;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 32), material);
    const x = -4 + (i % 3) * 3.5;
    const z = i < 3 ? 2.5 : 5.5;
    cone.position.set(x, height / 2 + 0.1, z);
    cone.castShadow = true;
    cone.rotation.set(-0.12, 0.16 * i, 0);
    group.add(cone);
  }

  scene.add(group);

  camera.position.set(-10, 8, 14);
  camera.lookAt(0, 1.5, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = false;
  controls.minDistance = 6;
  controls.maxDistance = 40;
  controls.target.set(0, 1.5, 1.5);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function() {
    const w = Math.max(640, parent.clientWidth || 800);
    const h = Math.floor(w * 0.55);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
})();
