(function() {
  const scene = new THREE.Scene();
  const parent = document.getElementById('threejs-container-1');
  const parentW = Math.max(700, parent.clientWidth || 800);
  const parentH = Math.floor(parentW * 0.55);
  const camera = new THREE.PerspectiveCamera(75, parentW / parentH, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(parentW, parentH);
  renderer.setClearColor(0xf0f0f0);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = 'auto';

  parent.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  const gridHelper = new THREE.GridHelper(10, 20, 0x888888, 0x888888);
  scene.add(gridHelper);

  const group = new THREE.Group();
  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22, shininess: 80 });
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffc107, shininess: 80 });

  const boxWidth = 1.3;
  const boxHeight = 0.8;
  const boxDepth = 0.8;

  for (let i = 0; i < 5; i++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth), boxMaterial);
    box.position.set(-2 + i * 1.1, boxHeight / 2, 0);
    box.rotation.set(0.04 * i, 0.12 * i, 0.02 * i);
    group.add(box);

    const sphereRadius = 0.45 + i * 0.06;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(sphereRadius, 24, 24), sphereMaterial);
    sphere.position.set(box.position.x, box.position.y + boxHeight / 2 + sphereRadius, 0);
    group.add(sphere);
  }

  scene.add(group);

  camera.position.set(4, 4, 8);
  camera.lookAt(0, 0.8, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.screenSpacePanning = false;
  controls.minDistance = 3;
  controls.maxDistance = 20;
  controls.target.set(0.5, 0.8, 0);

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.005;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Responsive resize
  window.addEventListener('resize', function() {
    const w = Math.max(640, parent.clientWidth || 800);
    const h = Math.floor(w * 0.55);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
})();
