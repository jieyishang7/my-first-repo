(function() {
  const scene = new THREE.Scene();
  const parent = document.getElementById('threejs-container-3');
  const parentW = Math.max(700, parent.clientWidth || 800);
  const parentH = Math.floor(parentW * 0.55);
  const camera = new THREE.PerspectiveCamera(60, parentW / parentH, 0.1, 50);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(parentW, parentH);
  renderer.setClearColor(0x03091d);
  renderer.shadowMap.enabled = true;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = 'auto';

  parent.appendChild(renderer.domElement);

  scene.fog = new THREE.Fog(0x03091d, 4, 18);

  const ambientLight = new THREE.AmbientLight(0x00e5ff, 0.36);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfff700, 1.15);
  directionalLight.position.set(8, 12, 6);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);

  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x071530, roughness: 0.88, metalness: 0.22 });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.05;
  plane.receiveShadow = true;
  scene.add(plane);

  const group = new THREE.Group();
  const logoPanels = [];

  function createLogoTexture(school) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const isUcla = school === 'UCLA';
    const primary = isUcla ? '#2d9cdb' : '#b9e5ff';
    const accent = isUcla ? '#ffe500' : '#00e5ff';

    ctx.fillStyle = 'rgba(3, 9, 29, 0.94)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 14;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 30;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    if (!isUcla) {
      ctx.beginPath();
      ctx.moveTo(430, 145);
      ctx.lineTo(455, 95);
      ctx.lineTo(490, 138);
      ctx.lineTo(525, 88);
      ctx.lineTo(560, 138);
      ctx.lineTo(595, 95);
      ctx.lineTo(620, 145);
      ctx.closePath();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 10;
      ctx.stroke();
    }

    ctx.fillStyle = primary;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 28;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = isUcla ? 'italic 900 210px Arial' : '700 145px Georgia';
    ctx.fillText(school, 512, isUcla ? 265 : 300);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  }

  const logoTextures = {
    UCLA: createLogoTexture('UCLA'),
    COLUMBIA: createLogoTexture('COLUMBIA')
  };

  const panelPositions = [
    [-2.8, 1.25, 0.0], [0, 1.55, -0.35], [2.8, 1.2, 0.1],
    [-2.65, 2.05, 1.65], [0.1, 2.35, 1.35], [2.7, 1.95, 1.8],
    [-2.75, 1.35, 3.25], [0, 1.7, 3.55], [2.75, 1.3, 3.2]
  ];

  panelPositions.forEach(function(position, index) {
    const school = index % 2 === 0 ? 'UCLA' : 'COLUMBIA';
    const panel = new THREE.Group();
    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(2.65, 1.34, 0.12),
      new THREE.MeshStandardMaterial({
        color: school === 'UCLA' ? 0x063b8f : 0x071530,
        emissive: school === 'UCLA' ? 0x001a38 : 0x002b33,
        metalness: 0.72,
        roughness: 0.22
      })
    );
    const logo = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 1.25),
      new THREE.MeshBasicMaterial({ map: logoTextures[school], transparent: true })
    );
    logo.position.z = 0.066;
    panel.add(backing, logo);
    panel.position.set(position[0], position[1], position[2]);
    panel.userData.baseY = position[1];
    panel.userData.phase = index * 0.7;
    group.add(panel);
    logoPanels.push(panel);
  });

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
    const time = performance.now() * 0.001;
    logoPanels.forEach(function(panel) {
      panel.position.y = panel.userData.baseY + Math.sin(time * 0.8 + panel.userData.phase) * 0.13;
      panel.lookAt(camera.position);
    });
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
