(function() {
  const scene = new THREE.Scene();
  const parent = document.getElementById('threejs-container-3');
  const parentW = Math.max(700, parent.clientWidth || 800);
  const parentH = Math.floor(parentW * 0.55);
  const camera = new THREE.PerspectiveCamera(60, parentW / parentH, 0.1, 50);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(parentW, parentH);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x03091d);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  renderer.shadowMap.enabled = true;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = 'auto';

  parent.appendChild(renderer.domElement);

  scene.fog = new THREE.FogExp2(0x03091d, 0.032);

  const ambientLight = new THREE.AmbientLight(0x00e5ff, 0.36);
  scene.add(ambientLight);
  scene.add(new THREE.HemisphereLight(0x7a35ff, 0x03091d, 0.42));

  const directionalLight = new THREE.DirectionalLight(0xfff700, 1.15);
  directionalLight.position.set(8, 12, 6);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);

  const coreLight = new THREE.PointLight(0xff2bd6, 2.5, 22);
  coreLight.position.set(0, 2.2, 1.8);
  scene.add(coreLight);

  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x020817,
    emissive: 0x001028,
    roughness: 0.7,
    metalness: 0.5
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.05;
  plane.receiveShadow = true;
  scene.add(plane);

  const floorGrid = new THREE.GridHelper(30, 60, 0x00e5ff, 0x25105b);
  floorGrid.position.y = 0.01;
  scene.add(floorGrid);

  function createHeartGeometry() {
    const heart = new THREE.Shape();
    heart.moveTo(0, -0.62);
    heart.bezierCurveTo(-0.18, -0.34, -0.72, 0.02, -0.72, 0.48);
    heart.bezierCurveTo(-0.72, 0.92, -0.18, 1.02, 0, 0.64);
    heart.bezierCurveTo(0.18, 1.02, 0.72, 0.92, 0.72, 0.48);
    heart.bezierCurveTo(0.72, 0.02, 0.18, -0.34, 0, -0.62);
    const geometry = new THREE.ExtrudeGeometry(heart, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    });
    geometry.center();
    return geometry;
  }

  const particlePositions = [];
  const particleColors = [];
  const cyan = new THREE.Color(0x00e5ff);
  const magenta = new THREE.Color(0xff2bd6);
  for (let i = 0; i < 520; i++) {
    particlePositions.push(
      (Math.random() - 0.5) * 30,
      Math.random() * 12 + 0.4,
      (Math.random() - 0.5) * 30
    );
    const color = i % 3 === 0 ? magenta : cyan;
    particleColors.push(color.r, color.g, color.b);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ size: 0.065, vertexColors: true, transparent: true, opacity: 0.72 })
  );
  scene.add(particles);

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

  const panelPositions = Array.from({ length: 9 }, function(_, index) {
    const angle = index / 9 * Math.PI * 2;
    const radius = 4.5 + (index % 2) * 0.45;
    return [Math.cos(angle) * radius, 1.45 + (index % 3) * 0.62, Math.sin(angle) * radius + 1.8, angle, radius];
  });

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

    const frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(backing.geometry),
      new THREE.LineBasicMaterial({ color: school === 'UCLA' ? 0xfff700 : 0x00e5ff, transparent: true, opacity: .72 })
    );
    panel.add(frame);
    panel.position.set(position[0], position[1], position[2]);
    panel.userData.baseY = position[1];
    panel.userData.phase = index * 0.7;
    panel.userData.baseAngle = position[3];
    panel.userData.radius = position[4];
    group.add(panel);
    logoPanels.push(panel);
  });

  scene.add(group);

  const energyCore = new THREE.Group();
  const coreSphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.08, 3),
    new THREE.MeshPhongMaterial({
      color: 0xff2bd6,
      emissive: 0xff087f,
      emissiveIntensity: 1.25,
      transparent: true,
      opacity: 0.82,
      shininess: 120
    })
  );
  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.3, 2),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: .68 })
  );
  energyCore.add(coreSphere, coreWire);
  energyCore.position.set(0, 2.2, 1.8);
  scene.add(energyCore);

  const orbitRings = [
    new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.035, 12, 96), new THREE.MeshBasicMaterial({ color: 0x00e5ff })),
    new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.026, 12, 96), new THREE.MeshBasicMaterial({ color: 0xff2bd6 })),
    new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.02, 12, 96), new THREE.MeshBasicMaterial({ color: 0xfff700 }))
  ];
  orbitRings[0].rotation.x = Math.PI / 2.7;
  orbitRings[1].rotation.y = Math.PI / 2.4;
  orbitRings[2].rotation.x = Math.PI / 2;
  orbitRings.forEach(function(ring) {
    ring.position.copy(energyCore.position);
    scene.add(ring);
  });

  const heartGeometry = createHeartGeometry();
  const floatingHearts = [];
  for (let index = 0; index < 8; index++) {
    const angle = index / 8 * Math.PI * 2;
    const radius = 5.8 + (index % 2) * 0.65;
    const color = index % 3 === 0 ? 0xfff700 : index % 2 === 0 ? 0x00e5ff : 0xff2bd6;
    const heart = new THREE.Mesh(
      heartGeometry,
      new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 1.15, shininess: 110 })
    );
    heart.scale.setScalar(index % 3 === 0 ? .45 : .32);
    heart.position.set(Math.cos(angle) * radius, 2.4 + Math.sin(index * 1.7) * 1.25, Math.sin(angle) * radius + 1.8);
    heart.userData.angle = angle;
    heart.userData.radius = radius;
    heart.userData.baseY = heart.position.y;
    heart.userData.phase = index * 0.9;
    heart.userData.baseScale = index % 3 === 0 ? .45 : .32;
    scene.add(heart);
    floatingHearts.push(heart);
  }

  camera.position.set(-8, 5.8, 10.5);
  camera.lookAt(0, 2, 1.8);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = false;
  controls.minDistance = 5;
  controls.maxDistance = 32;
  controls.target.set(0, 2, 1.8);

  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    const pulse = (Math.sin(time * 2.1) + 1) * 0.5;
    logoPanels.forEach(function(panel) {
      const angle = panel.userData.baseAngle + time * 0.055;
      panel.position.x = Math.cos(angle) * panel.userData.radius;
      panel.position.z = Math.sin(angle) * panel.userData.radius + 1.8;
      panel.position.y = panel.userData.baseY + Math.sin(time * 0.8 + panel.userData.phase) * 0.13;
      panel.lookAt(camera.position);
    });
    energyCore.rotation.x = time * 0.18;
    energyCore.rotation.y = time * 0.28;
    energyCore.scale.setScalar(0.92 + pulse * 0.14);
    coreLight.intensity = 1.7 + pulse * 1.8;
    orbitRings[0].rotation.z = time * 0.34;
    orbitRings[1].rotation.x = time * 0.26;
    orbitRings[2].rotation.z = -time * 0.2;
    floatingHearts.forEach(function(heart) {
      const angle = heart.userData.angle - time * 0.075;
      heart.position.x = Math.cos(angle) * heart.userData.radius;
      heart.position.z = Math.sin(angle) * heart.userData.radius + 1.8;
      heart.position.y = heart.userData.baseY + Math.sin(time * 1.15 + heart.userData.phase) * 0.28;
      const scale = heart.userData.baseScale * (0.92 + pulse * 0.16);
      heart.scale.setScalar(scale);
      heart.lookAt(camera.position);
    });
    particles.rotation.y += 0.00035;
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
