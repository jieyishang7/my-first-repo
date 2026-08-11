(function() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03091d, 0.038);

  const parent = document.getElementById('threejs-container-1');
  const parentW = Math.max(700, parent.clientWidth || 800);
  const parentH = Math.floor(parentW * 0.55);
  const camera = new THREE.PerspectiveCamera(62, parentW / parentH, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(parentW, parentH);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x03091d);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = 'auto';
  parent.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x00e5ff, 0.36));
  scene.add(new THREE.HemisphereLight(0x7a35ff, 0x03091d, 0.65));
  const cityLight = new THREE.DirectionalLight(0xfff700, 0.9);
  cityLight.position.set(6, 12, 8);
  scene.add(cityLight);

  const magentaLight = new THREE.PointLight(0xff2bd6, 2.2, 18);
  magentaLight.position.set(0, 5, 1);
  scene.add(magentaLight);

  function createHeartGeometry() {
    const heart = new THREE.Shape();
    heart.moveTo(0, -0.62);
    heart.bezierCurveTo(-0.18, -0.34, -0.72, 0.02, -0.72, 0.48);
    heart.bezierCurveTo(-0.72, 0.92, -0.18, 1.02, 0, 0.64);
    heart.bezierCurveTo(0.18, 1.02, 0.72, 0.92, 0.72, 0.48);
    heart.bezierCurveTo(0.72, 0.02, 0.18, -0.34, 0, -0.62);
    const geometry = new THREE.ExtrudeGeometry(heart, {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06
    });
    geometry.center();
    return geometry;
  }

  function createTextTexture(text, accent) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(3, 9, 29, .9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 8;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 24;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.fillStyle = accent;
    ctx.font = '700 64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4);
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  }

  const starPositions = [];
  for (let i = 0; i < 420; i++) {
    starPositions.push(
      (Math.random() - 0.5) * 46,
      Math.random() * 20 + 1,
      (Math.random() - 0.5) * 42
    );
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0x9df8ff, size: 0.075, transparent: true, opacity: 0.78 })
  );
  scene.add(stars);

  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(4.4, 64),
    new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
  );
  moon.position.set(-7, 9, -15);
  scene.add(moon);

  const city = new THREE.Group();
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 14),
    new THREE.MeshPhongMaterial({ color: 0x061126, emissive: 0x00101d, shininess: 55 })
  );
  ground.rotation.x = -Math.PI / 2;
  city.add(ground);

  const cityGrid = new THREE.GridHelper(18, 36, 0x00e5ff, 0x063b8f);
  cityGrid.position.y = 0.02;
  city.add(cityGrid);

  const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x02050e, emissive: 0x000713, shininess: 80 });
  const roadHorizontal = new THREE.Mesh(new THREE.PlaneGeometry(18, 2.4), roadMaterial);
  roadHorizontal.rotation.x = -Math.PI / 2;
  roadHorizontal.position.y = 0.012;
  city.add(roadHorizontal);

  const roadVertical = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 14), roadMaterial);
  roadVertical.rotation.x = -Math.PI / 2;
  roadVertical.position.y = 0.014;
  city.add(roadVertical);

  const cyanLine = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
  const yellowLine = new THREE.MeshBasicMaterial({ color: 0xfff700 });

  function addRoadLine(x, z, width, depth, material) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material);
    line.rotation.x = -Math.PI / 2;
    line.position.set(x, 0.025, z);
    city.add(line);
  }

  for (let x = -8; x <= 8; x += 1.25) {
    if (Math.abs(x) > 1.3) addRoadLine(x, 0, 0.68, 0.055, yellowLine);
  }
  for (let z = -6; z <= 6; z += 1.15) {
    if (Math.abs(z) > 1.3) addRoadLine(0, z, 0.055, 0.62, cyanLine);
  }

  const buildings = [];
  const buildingData = [
    [-6.4, -4.5, 2.3, 2.1, 4.6, 0x063b8f, 0x00e5ff],
    [-3.5, -4.7, 2.0, 1.8, 2.9, 0x11105b, 0xff2bd6],
    [3.5, -4.5, 2.1, 2.0, 4.0, 0x071b3d, 0xfff700],
    [6.4, -4.2, 2.2, 2.4, 5.3, 0x24105b, 0x00e5ff],
    [-6.2, 3.9, 2.5, 2.3, 3.5, 0x061a38, 0xfff700],
    [-3.4, 4.3, 1.9, 2.0, 5.6, 0x26104d, 0xff2bd6],
    [3.5, 4.2, 2.0, 2.2, 3.2, 0x063b8f, 0x00e5ff],
    [6.3, 4.0, 2.4, 2.4, 4.7, 0x15105a, 0xfff700]
  ];

  function createBuilding(data, index) {
    const x = data[0];
    const z = data[1];
    const width = data[2];
    const depth = data[3];
    const height = data[4];
    const color = data[5];
    const glow = data[6];
    const building = new THREE.Group();
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.18, shininess: 95 })
    );
    tower.position.y = height / 2;
    building.add(tower);

    const towerOutline = new THREE.LineSegments(
      new THREE.EdgesGeometry(tower.geometry),
      new THREE.LineBasicMaterial({ color: glow, transparent: true, opacity: 0.46 })
    );
    towerOutline.position.copy(tower.position);
    building.add(towerOutline);

    const windowMaterial = new THREE.MeshBasicMaterial({ color: glow });
    const rows = Math.max(3, Math.floor(height / 0.65));
    for (let row = 0; row < rows; row++) {
      for (let column = -1; column <= 1; column++) {
        if ((row + column + index) % 4 === 0) continue;
        const windowPane = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.2), windowMaterial);
        windowPane.position.set(column * width * 0.27, 0.48 + row * 0.57, depth / 2 + 0.006);
        building.add(windowPane);
      }
    }

    const roofGlow = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.08, 0.07, depth + 0.08),
      new THREE.MeshBasicMaterial({ color: glow })
    );
    roofGlow.position.y = height + 0.04;
    building.add(roofGlow);

    if (index % 2 === 0) {
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.2, 8), windowMaterial);
      antenna.position.y = height + 0.62;
      building.add(antenna);
    }

    if (index % 2 === 1) {
      const signWords = ['NOVA', 'LOVE', 'CDW', 'NIGHT'];
      const signColor = glow === 0xff2bd6 ? '#ff2bd6' : glow === 0xfff700 ? '#fff700' : '#00e5ff';
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(width * 0.78, width * 0.28),
        new THREE.MeshBasicMaterial({ map: createTextTexture(signWords[index % signWords.length], signColor), transparent: true })
      );
      sign.position.set(0, Math.min(height - 0.55, height * 0.68), depth / 2 + 0.014);
      building.add(sign);
    }

    building.position.set(x, 0, z);
    city.add(building);
    buildings.push(building);
  }

  buildingData.forEach(createBuilding);

  const heartGeometry = createHeartGeometry();
  const heartMaterial = new THREE.MeshPhongMaterial({
    color: 0xff4fcf,
    emissive: 0xff087f,
    emissiveIntensity: 1.4,
    shininess: 120
  });
  const cityHearts = [];
  [[0, 3.4, 0, 1.15], [-6.1, 6.2, -4.4, .45], [6.2, 6.5, 4.0, .52]].forEach(function(data, index) {
    const heart = new THREE.Mesh(heartGeometry, heartMaterial.clone());
    heart.position.set(data[0], data[1], data[2]);
    heart.scale.setScalar(data[3]);
    heart.userData.baseY = data[1];
    heart.userData.phase = index * 1.8;
    heart.userData.baseScale = data[3];
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(heartGeometry),
      new THREE.LineBasicMaterial({ color: 0xffb6ef, transparent: true, opacity: .82 })
    );
    heart.add(outline);
    city.add(heart);
    cityHearts.push(heart);
  });

  const trafficLights = [];
  for (let i = 0; i < 10; i++) {
    const vertical = i % 2 === 0;
    const light = new THREE.Mesh(
      new THREE.BoxGeometry(vertical ? 0.06 : 0.62, 0.035, vertical ? 0.62 : 0.06),
      new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xff2bd6 : 0x00e5ff })
    );
    light.position.set(vertical ? 0.55 : -8 + i * 1.45, 0.07, vertical ? -6 + i * 1.2 : -0.55);
    light.userData.vertical = vertical;
    light.userData.speed = 0.018 + (i % 4) * 0.005;
    city.add(light);
    trafficLights.push(light);
  }

  const lampMaterial = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
  [[-1.55,-1.55],[1.55,-1.55],[-1.55,1.55],[1.55,1.55]].forEach(function(position) {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.1, 10), lampMaterial);
    lamp.position.set(position[0], 0.55, position[1]);
    city.add(lamp);
  });

  scene.add(city);
  camera.position.set(10, 9, 12);
  camera.lookAt(0, 1.7, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.minDistance = 7;
  controls.maxDistance = 28;
  controls.target.set(0, 1.7, 0);

  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    const pulse = (Math.sin(time * 2) + 1) * 0.5;
    city.rotation.y += 0.0025;
    stars.rotation.y -= 0.00022;
    moon.lookAt(camera.position);
    magentaLight.intensity = 1.6 + pulse * 1.4;
    buildings.forEach(function(building, index) {
      building.children.forEach(function(child) {
        if (child.material && child.material.isMeshBasicMaterial) {
          child.material.opacity = 0.72 + pulse * 0.28;
          child.material.transparent = true;
        }
      });
      building.position.y = Math.sin(time * 0.7 + index) * 0.018;
    });
    cityHearts.forEach(function(heart) {
      heart.position.y = heart.userData.baseY + Math.sin(time * 1.3 + heart.userData.phase) * 0.18;
      const scale = heart.userData.baseScale * (0.94 + pulse * 0.12);
      heart.scale.setScalar(scale);
      heart.lookAt(camera.position);
    });
    trafficLights.forEach(function(light) {
      if (light.userData.vertical) {
        light.position.z += light.userData.speed;
        if (light.position.z > 6) light.position.z = -6;
      } else {
        light.position.x += light.userData.speed;
        if (light.position.x > 8) light.position.x = -8;
      }
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
