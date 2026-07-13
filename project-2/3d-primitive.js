(function() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x03091d, 8, 25);

  const parent = document.getElementById('threejs-container-1');
  const parentW = Math.max(700, parent.clientWidth || 800);
  const parentH = Math.floor(parentW * 0.55);
  const camera = new THREE.PerspectiveCamera(62, parentW / parentH, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(parentW, parentH);
  renderer.setClearColor(0x03091d);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = 'auto';
  parent.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x00e5ff, 0.42));
  const cityLight = new THREE.DirectionalLight(0xfff700, 0.9);
  cityLight.position.set(6, 12, 8);
  scene.add(cityLight);

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

    building.position.set(x, 0, z);
    city.add(building);
    buildings.push(building);
  }

  buildingData.forEach(createBuilding);

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
    const pulse = (Math.sin(performance.now() * 0.002) + 1) * 0.5;
    city.rotation.y += 0.0025;
    buildings.forEach(function(building, index) {
      building.children.forEach(function(child) {
        if (child.material && child.material.isMeshBasicMaterial) {
          child.material.opacity = 0.72 + pulse * 0.28;
          child.material.transparent = true;
        }
      });
      building.position.y = Math.sin(performance.now() * 0.0007 + index) * 0.018;
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
