(function () {
  var container = document.getElementById("heroGlobe3d");
  if (!container) return;
  if (typeof THREE === "undefined") return;

  var W = container.clientWidth || 420;
  var H = container.clientHeight || W;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, W / H, 1, 2000);
  camera.position.set(0, 70, 520);
  camera.lookAt(0, 0, 0);

  // ---- WebGL globe sphere -------------------------------------------------
  var webgl;
  try {
    webgl = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (e) {
    return;
  }
  webgl.setSize(W, H);
  webgl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  webgl.domElement.style.position = "absolute";
  webgl.domElement.style.inset = "0";
  webgl.domElement.style.zIndex = 1;
  webgl.domElement.style.pointerEvents = "auto";
  container.appendChild(webgl.domElement);

  // Lights
  var ambient = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambient);

  var keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
  keyLight.position.set(250, 350, 450);
  scene.add(keyLight);

  var fillLight = new THREE.DirectionalLight(0x60a5fa, 0.35);
  fillLight.position.set(-300, -120, -200);
  scene.add(fillLight);

  // Procedural globe texture (gradient + graticule + soft continents)
  var makeTexture = function () {
    var c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    var ctx = c.getContext("2d");

    var grad = ctx.createRadialGradient(360, 190, 40, 620, 256, 560);
    grad.addColorStop(0, "#12336b");
    grad.addColorStop(0.45, "#0f1f4a");
    grad.addColorStop(0.75, "#0b1838");
    grad.addColorStop(1, "#0a1429");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);

    // soft glowing patches (stylised continents)
    var patches = [
      [300, 150, 90], [500, 220, 130], [720, 120, 80], [880, 260, 110],
      [160, 320, 95], [430, 380, 120], [640, 330, 100], [830, 420, 85]
    ];
    patches.forEach(function (p) {
      var pgrad = ctx.createRadialGradient(p[0], p[1], 4, p[0], p[1], p[2]);
      pgrad.addColorStop(0, "rgba(34, 197, 166, 0.28)");
      pgrad.addColorStop(0.6, "rgba(37, 99, 235, 0.12)");
      pgrad.addColorStop(1, "rgba(37, 99, 235, 0)");
      ctx.fillStyle = pgrad;
      ctx.beginPath();
      ctx.arc(p[0], p[1], p[2], 0, Math.PI * 2);
      ctx.fill();
    });

    // graticule - meridians
    ctx.strokeStyle = "rgba(96, 165, 250, 0.28)";
    ctx.lineWidth = 1.2;
    for (var lon = 0; lon < 360; lon += 15) {
      ctx.beginPath();
      var x = (lon / 360) * c.width;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, c.height);
      ctx.stroke();
    }
    // graticule - parallels (ellipses to fake projection)
    for (var lat = -75; lat <= 75; lat += 15) {
      ctx.beginPath();
      ctx.ellipse(c.width / 2, c.height / 2, c.width * 0.48, Math.abs((lat / 90)) * c.height * 0.46, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  };

  // The rotating "globe" group (holds sphere + chips together)
  var globe = new THREE.Group();
  scene.add(globe);

  var GLOBE_RADIUS = 160;

  var sphereMat = new THREE.MeshPhongMaterial({
    map: makeTexture(),
    specular: 0x1e293b,
    shininess: 18
  });
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64), sphereMat);
  globe.add(sphere);

  // atmosphere rim glow
  var glowMat = new THREE.MeshBasicMaterial({
    color: 0x14b8a6,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide
  });
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 1.06, 48, 48), glowMat));

  // ---- CSS3D devicon chips (same scene / camera) --------------------------
  var cssr = new THREE.CSS3DRenderer();
  cssr.setSize(W, H);
  cssr.domElement.style.position = "absolute";
  cssr.domElement.style.inset = "0";
  cssr.domElement.style.zIndex = 2;
  cssr.domElement.style.pointerEvents = "none";
  container.appendChild(cssr.domElement);

  var skills = [
    { icon: "<i class='devicon-php-plain colored'></i>", lon: 0, lat: 0 },
    { icon: "<i class='devicon-laravel-original colored'></i>", lon: 45, lat: 0 },
    { icon: "<i class='devicon-nodejs-plain colored'></i>", lon: 90, lat: 0 },
    { icon: "<i class='devicon-javascript-plain colored'></i>", lon: 135, lat: 0 },
    { icon: "<i class='devicon-mysql-plain-wordmark'></i>", lon: 180, lat: 0 },
    { icon: "<i class='devicon-docker-plain'></i>", lon: 225, lat: 0 },
    { icon: "<i class='devicon-amazonwebservices-plain-wordmark colored'></i>", lon: 270, lat: 0 },
    { icon: "<i class='devicon-react-original colored'></i>", lon: 315, lat: 0 },

    { icon: "<i class='devicon-vuejs-plain colored'></i>", lon: 0, lat: 30 },
    { icon: "<i class='devicon-postgresql-plain colored'></i>", lon: 72, lat: 30 },
    { icon: "<i class='devicon-redis-plain colored'></i>", lon: 144, lat: 30 },
    { icon: "<i class='devicon-linux-plain'></i>", lon: 216, lat: 30 },
    { icon: "<i class='devicon-git-plain colored'></i>", lon: 288, lat: 30 },

    { icon: "<i class='devicon-html5-plain colored'></i>", lon: 36, lat: -30 },
    { icon: "<i class='devicon-css3-plain colored'></i>", lon: 108, lat: -30 },
    { icon: "<i class='devicon-nginx-original'></i>", lon: 180, lat: -30 },
    { icon: "<i class='devicon-mongodb-plain colored'></i>", lon: 252, lat: -30 },
    { icon: "<i class='devicon-bootstrap-plain colored'></i>", lon: 324, lat: -30 },

    { icon: "<i class='devicon-vscode-plain colored'></i>", lon: 90, lat: 60 },
    { icon: "<i class='devicon-firebase-plain colored'></i>", lon: 270, lat: 60 },

    { icon: "<i class='devicon-codeigniter-plain colored'></i>", lon: 0, lat: -60 },
    { icon: "<i class='devicon-jira-plain colored'></i>", lon: 180, lat: -60 }
  ];

  var CHIP_RADIUS = GLOBE_RADIUS + 6;
  var chips = [];

  skills.forEach(function (s) {
    var el = document.createElement("div");
    el.className = "globe3d-icon";
    el.innerHTML = s.icon;

    var obj = new THREE.CSS3DObject(el);
    var lon = (s.lon * Math.PI) / 180;
    var lat = (s.lat * Math.PI) / 180;

    obj.position.set(
      CHIP_RADIUS * Math.cos(lat) * Math.sin(lon),
      CHIP_RADIUS * Math.sin(lat),
      CHIP_RADIUS * Math.cos(lat) * Math.cos(lon)
    );

    var outward = obj.position.clone().multiplyScalar(2);
    obj.lookAt(outward);

    globe.add(obj);
    chips.push({ obj: obj, el: el });
  });

  // ---- Interaction: drag to spin with inertia --------------------------------
  var autoRotate = true;
  var dragging = false;
  var lastX = 0;
  var lastY = 0;
  var velY = 0;
  var velX = 0;
  var MAX_X = (Math.PI / 180) * 70;

  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var onDown = function (e) {
    dragging = true;
    autoRotate = false;
    lastX = e.clientX;
    lastY = e.clientY;
    velY = 0;
    velX = 0;
    webgl.domElement.style.cursor = "grabbing";
  };

  var onMove = function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    globe.rotation.y += dx * 0.005;
    globe.rotation.x = Math.max(-MAX_X, Math.min(MAX_X, globe.rotation.x + dy * 0.005));
    velY = dx * 0.005;
    velX = dy * 0.005;
  };

  var onUp = function () {
    dragging = false;
    webgl.domElement.style.cursor = "grab";
  };

  webgl.domElement.style.cursor = "grab";
  webgl.domElement.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  container.style.touchAction = "pan-y";

  // ---- Occlusion: fade chips that are behind the sphere ---------------------
  var camPos = new THREE.Vector3();
  var center = new THREE.Vector3();
  var viewDir = new THREE.Vector3();
  var tmpP = new THREE.Vector3();

  var updateOcclusion = function () {
    camera.getWorldPosition(camPos);
    globe.getWorldPosition(center);
    viewDir.subVectors(center, camPos).normalize();

    for (var i = 0; i < chips.length; i++) {
      chips[i].obj.getWorldPosition(tmpP);
      tmpP.sub(camPos);
      var t = tmpP.dot(viewDir); // signed distance along view axis, 0 at centre plane
      var vis = THREE.MathUtils.smoothstep(t, -18, 26);
      chips[i].el.style.opacity = vis.toFixed(3);
    }
  };

  // ---- Animation loop ---------------------------------------------------------
  globe.rotation.x = 0.18;
  globe.rotation.y = 0.65;

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);

    if (dragging) {
      // user controls rotation
    } else if (!reducedMotion) {
      if (autoRotate) {
        globe.rotation.y += 0.004;
      } else if (Math.abs(velY) > 0.0005 || Math.abs(velX) > 0.0005) {
        globe.rotation.y += velY;
        globe.rotation.x = Math.max(-MAX_X, Math.min(MAX_X, globe.rotation.x + velX));
        velY *= 0.96;
        velX *= 0.96;
        if (Math.abs(velY) < 0.002 && Math.abs(velX) < 0.002) autoRotate = true;
      } else {
        autoRotate = true;
      }
    }

    updateOcclusion();
    webgl.render(scene, camera);
    cssr.render(scene, camera);
  }

  animate();

  // ---- Resize ---------------------------------------------------------------
  function resize() {
    var w = container.clientWidth;
    var h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    webgl.setSize(w, h);
    cssr.setSize(w, h);
  }

  window.addEventListener("resize", resize);
  resize();
})();