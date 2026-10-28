import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Building, Cpu, Shield } from 'lucide-react';

export type SceneMode = 'skyline' | 'network' | 'vault';

interface AboutHero3DProps {
  onModeChange?: (mode: SceneMode) => void;
}

interface VehicleData {
  mesh: THREE.Group;
  wheels: THREE.Mesh[];
  progress: number;
  speed: number;
  pathType: 'outerClockwise' | 'outerCounter' | 'avenueCross';
}

export const AboutHero3D: React.FC<AboutHero3DProps> = ({ onModeChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<SceneMode>('skyline');
  const [autoRotate, setAutoRotate] = useState(true);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Group references
  const skylineGroupRef = useRef<THREE.Group>(new THREE.Group());
  const networkGroupRef = useRef<THREE.Group>(new THREE.Group());
  const vaultGroupRef = useRef<THREE.Group>(new THREE.Group());
  const cloudsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const vehiclesRef = useRef<VehicleData[]>([]);
  const dataPacketsRef = useRef<{ mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }[]>([]);
  const scannerRef = useRef<THREE.Mesh | null>(null);

  // Mouse & interaction states
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  const handleModeSwitch = (mode: SceneMode) => {
    setActiveMode(mode);
    if (onModeChange) onModeChange(mode);

    if (skylineGroupRef.current) skylineGroupRef.current.visible = mode === 'skyline';
    if (networkGroupRef.current) networkGroupRef.current.visible = mode === 'network';
    if (vaultGroupRef.current) vaultGroupRef.current.visible = mode === 'vault';
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup with Rich Daylight Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Atmospheric Fog softly blending into the sky horizon
    scene.fog = new THREE.FogExp2(0xcde3f7, 0.009);

    // 2. Camera setup with isometric architectural vantage
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 9.5, 22);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Vibrant Realistic Blue Sky Dome
    const createSkyDome = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0.0, '#0284c7'); // Deep azure blue at top of sky
        gradient.addColorStop(0.3, '#38bdf8'); // Clear radiant summer blue
        gradient.addColorStop(0.65, '#93c5fd'); // Soft light sky blue
        gradient.addColorStop(0.9, '#cde3f7'); // Warm horizon glow
        gradient.addColorStop(1.0, '#dbeafe'); // Ground horizon blend
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const skyGeo = new THREE.SphereGeometry(180, 32, 24);
      const skyMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        fog: false,
      });
      return new THREE.Mesh(skyGeo, skyMat);
    };
    scene.add(createSkyDome());

    // 5. Drifting 3D White Clouds
    const cloudsGroup = cloudsGroupRef.current;
    cloudsGroup.clear();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.88,
    });

    const createCloudCluster = (x: number, y: number, z: number, scale: number) => {
      const cluster = new THREE.Group();
      const puffGeo = new THREE.SphereGeometry(1.2, 8, 8);
      const offsets = [
        [0, 0, 0],
        [1.2, 0.2, 0.2],
        [-1.1, -0.1, 0.3],
        [0.4, 0.6, -0.2],
        [-0.5, 0.4, 0.1],
        [1.8, -0.2, -0.1],
        [-1.7, -0.2, -0.2],
      ];
      offsets.forEach(([ox, oy, oz]) => {
        const p = new THREE.Mesh(puffGeo, cloudMat);
        p.position.set(ox, oy, oz);
        cluster.add(p);
      });
      cluster.position.set(x, y, z);
      cluster.scale.set(scale, scale * 0.55, scale);
      return cluster;
    };

    const clouds = [
      createCloudCluster(-28, 18, -35, 2.6),
      createCloudCluster(15, 22, -45, 3.2),
      createCloudCluster(32, 19, -30, 2.8),
      createCloudCluster(-10, 24, -50, 3.5),
      createCloudCluster(4, 16, 25, 2.4),
      createCloudCluster(-35, 20, 10, 2.9),
    ];
    clouds.forEach((c) => cloudsGroup.add(c));
    scene.add(cloudsGroup);

    // 6. Natural Daylight Lighting
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0xf1f5f9, 1.85);
    hemiLight.position.set(0, 40, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.9);
    sunLight.position.set(18, 32, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.2);
    fillLight.position.set(-20, 18, -15);
    scene.add(fillLight);

    // Ground Expanse (Seamless Urban Landscape)
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd, // Soft distance landscape color blending with horizon
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.05;
    scene.add(ground);

    // City Center Plaza Base Plate
    const plazaGeo = new THREE.BoxGeometry(26, 0.1, 26);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.5,
      metalness: 0.1,
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.y = -2.0;
    plaza.receiveShadow = true;
    scene.add(plaza);

    // Procedural Window Texture Generator
    const createWindowTexture = (floorCount: number, columnCount: number, glassColor: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 512, 512);

      const cellW = 512 / columnCount;
      const cellH = 512 / floorCount;
      const padX = cellW * 0.16;
      const padY = cellH * 0.22;

      for (let r = 0; r < floorCount; r++) {
        for (let c = 0; c < columnCount; c++) {
          const x = c * cellW + padX;
          const y = r * cellH + padY;
          const w = cellW - padX * 2;
          const h = cellH - padY * 2;

          const isLit = Math.random() > 0.65;
          ctx.fillStyle = isLit ? '#fff3cc' : glassColor;
          ctx.fillRect(x, y, w, h);

          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillRect(x, y, w, h * 0.4);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const windowTexBlue = createWindowTexture(12, 8, '#2563eb');
    const windowTexTeal = createWindowTexture(14, 8, '#0d9488');
    const windowTexAzure = createWindowTexture(10, 6, '#0284c7');

    // Procedural Badge Text Canvas Texture Helper
    const createLabelTexture = (text: string, subtext: string, bgColor: string, textColor: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Card Background
      ctx.fillStyle = bgColor;
      ctx.roundRect ? ctx.roundRect(10, 10, 492, 140, 20) : ctx.rect(10, 10, 492, 140);
      ctx.fill();

      // Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Header Text
      ctx.fillStyle = textColor;
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 58);

      // Subtext Text
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(subtext, 256, 110);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // ─────────────────────────────────────────────────────────────
    // MODE 1: REALISTIC ARCHITECTURAL SKYLINE & MOVING VEHICLES
    // ─────────────────────────────────────────────────────────────
    const skylineGroup = skylineGroupRef.current;
    skylineGroup.clear();

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x27303f,
      roughness: 0.85,
      metalness: 0.1,
    });

    const roadMarkingMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xdde4ec, roughness: 0.5 });

    const createRoad = (w: number, l: number, x: number, z: number, isVertical: boolean) => {
      const road = new THREE.Mesh(new THREE.PlaneGeometry(w, l), roadMat);
      road.rotation.x = -Math.PI / 2;
      if (!isVertical) road.rotation.z = Math.PI / 2;
      road.position.set(x, -1.94, z);
      road.receiveShadow = true;
      skylineGroup.add(road);

      const dashCount = Math.floor(l / 1.6);
      const dashGeo = new THREE.PlaneGeometry(0.12, 0.7);
      for (let i = 0; i < dashCount; i++) {
        const dash = new THREE.Mesh(dashGeo, roadMarkingMat);
        dash.rotation.x = -Math.PI / 2;
        if (!isVertical) {
          dash.rotation.z = Math.PI / 2;
          dash.position.set(x - l / 2 + (i + 0.5) * 1.6, -1.93, z);
        } else {
          dash.position.set(x, -1.93, z - l / 2 + (i + 0.5) * 1.6);
        }
        skylineGroup.add(dash);
      }
    };

    createRoad(2.4, 18, 0, -7.0, false);
    createRoad(2.4, 18, 0, 7.0, false);
    createRoad(2.4, 16.4, -8.0, 0, true);
    createRoad(2.4, 16.4, 8.0, 0, true);
    createRoad(2.0, 16.4, 0, 0, true);

    // Pedestrian crossings
    const createZebraCrossing = (x: number, z: number, isVertical: boolean) => {
      for (let i = 0; i < 5; i++) {
        const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 1.4), roadMarkingMat);
        bar.rotation.x = -Math.PI / 2;
        if (isVertical) {
          bar.position.set(x - 0.7 + i * 0.35, -1.92, z);
        } else {
          bar.rotation.z = Math.PI / 2;
          bar.position.set(x, -1.92, z - 0.7 + i * 0.35);
        }
        skylineGroup.add(bar);
      }
    };
    createZebraCrossing(0, -5.6, true);
    createZebraCrossing(0, 5.6, true);

    const createSidewalkBlock = (w: number, d: number, x: number, z: number) => {
      const sw = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, d), sidewalkMat);
      sw.position.set(x, -1.9, z);
      sw.receiveShadow = true;
      skylineGroup.add(sw);
    };
    createSidewalkBlock(6.2, 11.8, -4.0, 0);
    createSidewalkBlock(6.2, 11.8, 4.0, 0);

    // Reusable Materials
    const whiteGraniteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
    const brushedChampagneMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.75 });
    const glassTowerMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.15,
      transmission: 0.45,
      transparent: true,
      opacity: 0.92,
      clearcoat: 1.0,
    });

    // Centerpiece Prime Headquarters Tower
    const centerTowerGroup = new THREE.Group();
    const podiumMesh = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 3.2), whiteGraniteMat);
    podiumMesh.position.y = -1.4;
    podiumMesh.castShadow = true;
    centerTowerGroup.add(podiumMesh);

    const centerShaft = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 8.2, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, map: windowTexTeal || undefined, roughness: 0.15, metalness: 0.3 })
    );
    centerShaft.position.y = 3.3;
    centerShaft.castShadow = true;
    centerTowerGroup.add(centerShaft);

    const pilasterGeo = new THREE.BoxGeometry(0.16, 8.4, 0.16);
    [[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]].forEach(([px, pz]) => {
      const pil = new THREE.Mesh(pilasterGeo, brushedChampagneMat);
      pil.position.set(px, 3.3, pz);
      centerTowerGroup.add(pil);
    });

    const crown = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 2.0), glassTowerMat);
    crown.position.y = 8.1;
    centerTowerGroup.add(crown);

    const helipad = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.15, 32), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    helipad.position.y = 8.85;
    centerTowerGroup.add(helipad);

    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.1, 2.0, 16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
    spire.position.y = 9.9;
    centerTowerGroup.add(spire);

    const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    beaconLight.position.y = 10.9;
    centerTowerGroup.add(beaconLight);

    centerTowerGroup.position.set(-3.8, 0, -1.5);
    skylineGroup.add(centerTowerGroup);

    // Surrounding Skyscrapers
    const buildings = [
      { x: 3.8, z: -1.8, w: 2.6, h: 7.8, d: 2.4, map: windowTexAzure, color: 0x0369a1 },
      { x: -3.8, z: 3.2, w: 2.2, h: 5.6, d: 2.2, map: windowTexBlue, color: 0x1d4ed8 },
      { x: 3.8, z: 3.2, w: 2.4, h: 5.8, d: 2.2, map: windowTexTeal, color: 0x0f766e },
    ];

    buildings.forEach((b) => {
      const bGroup = new THREE.Group();
      const bPod = new THREE.Mesh(new THREE.BoxGeometry(b.w * 1.12, 0.8, b.d * 1.12), whiteGraniteMat);
      bPod.position.y = -1.6;
      bPod.castShadow = true;
      bGroup.add(bPod);

      const bShaft = new THREE.Mesh(
        new THREE.BoxGeometry(b.w, b.h, b.d),
        new THREE.MeshStandardMaterial({ color: b.color, map: b.map || undefined, roughness: 0.2, metalness: 0.3 })
      );
      bShaft.position.y = -2 + b.h / 2;
      bShaft.castShadow = true;
      bGroup.add(bShaft);

      const bRoof = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.75, 0.7, b.d * 0.75), new THREE.MeshStandardMaterial({ color: 0x334155 }));
      bRoof.position.y = -2 + b.h + 0.35;
      bGroup.add(bRoof);

      bGroup.position.set(b.x, 0, b.z);
      skylineGroup.add(bGroup);
    });

    // Plaza Trees
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    [
      [-1.5, -4.2], [1.5, -4.2], [-1.5, 4.2], [1.5, 4.2],
      [-6.5, -4.2], [6.5, -4.2], [-6.5, 4.2], [6.5, 4.2]
    ].forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      const trk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 8), trunkMat);
      trk.position.y = -1.65;
      tree.add(trk);
      const fol = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), treeMat);
      fol.position.y = -1.2;
      tree.add(fol);
      tree.position.set(tx, 0, tz);
      skylineGroup.add(tree);
    });

    // Moving Vehicles on Roads
    const createVehicleMesh = (carType: 'sedan' | 'suv' | 'taxi' | 'van', bodyColor: number) => {
      const car = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.2, metalness: 0.6 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
      const hubcapMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9 });
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

      const length = carType === 'van' ? 1.4 : carType === 'suv' ? 1.3 : 1.15;
      const width = carType === 'suv' ? 0.62 : 0.55;
      const height = carType === 'suv' ? 0.28 : 0.22;

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), bodyMat);
      chassis.position.y = height / 2 + 0.08;
      chassis.castShadow = true;
      car.add(chassis);

      const cabinH = carType === 'van' ? 0.38 : carType === 'suv' ? 0.26 : 0.2;
      const cabinL = carType === 'van' ? 0.95 : carType === 'suv' ? 0.75 : 0.65;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(width * 0.88, cabinH, cabinL), glassMat);
      cabin.position.set(0, height + cabinH / 2 + 0.08, carType === 'van' ? 0.05 : -0.05);
      car.add(cabin);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 0.86, 0.04, cabinL * 0.95), bodyMat);
      roof.position.set(0, height + cabinH + 0.09, carType === 'van' ? 0.05 : -0.05);
      car.add(roof);

      if (carType === 'taxi') {
        const taxiSign = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.1), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        taxiSign.position.set(0, height + cabinH + 0.14, -0.05);
        car.add(taxiSign);
      }

      // Headlights & Taillights
      const hlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), headlightMat);
      hlLeft.position.set(-width / 2 + 0.08, height / 2 + 0.08, length / 2 + 0.02);
      car.add(hlLeft);

      const hlRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), headlightMat);
      hlRight.position.set(width / 2 - 0.08, height / 2 + 0.08, length / 2 + 0.02);
      car.add(hlRight);

      const tlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), taillightMat);
      tlLeft.position.set(-width / 2 + 0.08, height / 2 + 0.08, -length / 2 - 0.02);
      car.add(tlLeft);

      const tlRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), taillightMat);
      tlRight.position.set(width / 2 - 0.08, height / 2 + 0.08, -length / 2 - 0.02);
      car.add(tlRight);

      const wheels: THREE.Mesh[] = [];
      const wheelRadius = 0.14;
      const wheelWidth = 0.08;
      const wheelPositions = [
        [-width / 2 - 0.02, wheelRadius, length * 0.3],
        [width / 2 + 0.02, wheelRadius, length * 0.3],
        [-width / 2 - 0.02, wheelRadius, -length * 0.3],
        [width / 2 + 0.02, wheelRadius, -length * 0.3],
      ];

      wheelPositions.forEach(([wx, wy, wz]) => {
        const wMesh = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 16), wheelMat);
        wMesh.rotation.z = Math.PI / 2;
        wMesh.position.set(wx, wy, wz);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius * 0.5, wheelRadius * 0.5, wheelWidth * 1.05, 16), hubcapMat);
        wMesh.add(hub);
        car.add(wMesh);
        wheels.push(wMesh);
      });

      return { car, wheels };
    };

    const vehicleConfigs: {
      type: 'sedan' | 'suv' | 'taxi' | 'van';
      color: number;
      path: 'outerClockwise' | 'outerCounter' | 'avenueCross';
      startProgress: number;
      speed: number;
    }[] = [
      { type: 'sedan', color: 0xffffff, path: 'outerClockwise', startProgress: 0.05, speed: 0.038 },
      { type: 'suv', color: 0x0f172a, path: 'outerClockwise', startProgress: 0.38, speed: 0.035 },
      { type: 'taxi', color: 0xeab308, path: 'outerClockwise', startProgress: 0.72, speed: 0.042 },
      { type: 'sedan', color: 0x1d4ed8, path: 'outerCounter', startProgress: 0.15, speed: 0.036 },
      { type: 'sedan', color: 0xdc2626, path: 'outerCounter', startProgress: 0.65, speed: 0.044 },
      { type: 'van', color: 0x94a3b8, path: 'avenueCross', startProgress: 0.0, speed: 0.032 },
    ];

    const activeVehicles: VehicleData[] = [];
    vehicleConfigs.forEach((cfg) => {
      const { car, wheels } = createVehicleMesh(cfg.type, cfg.color);
      skylineGroup.add(car);
      activeVehicles.push({
        mesh: car,
        wheels,
        progress: cfg.startProgress,
        speed: cfg.speed,
        pathType: cfg.path,
      });
    });

    vehiclesRef.current = activeVehicles;
    scene.add(skylineGroup);

    // ─────────────────────────────────────────────────────────────
    // MODE 2: MEANINGFUL INSTITUTIONAL LENDER GRID (Banking Exchange Campus)
    // ─────────────────────────────────────────────────────────────
    const networkGroup = networkGroupRef.current;
    networkGroup.clear();
    networkGroup.visible = false;

    // Banking Campus Ground with Radial Inlaid Marble Rings
    const lenderCampusFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(11, 11, 0.2, 48),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4, metalness: 0.1 })
    );
    lenderCampusFloor.position.y = -1.9;
    lenderCampusFloor.receiveShadow = true;
    networkGroup.add(lenderCampusFloor);

    // Concentric Inlaid Gold Compass Rings
    [4.5, 7.8, 10.2].forEach((r) => {
      const ring = new THREE.Line(
        new THREE.RingGeometry(r, r + 0.06, 64),
        new THREE.LineBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.6 })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.78;
      networkGroup.add(ring);
    });

    // Central Monumental Prime Associates Syndication Rotunda
    const centralDeskGroup = new THREE.Group();

    // Rotunda Marble Base
    const rotundaBase = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.6, 1.0, 32),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.15 })
    );
    rotundaBase.position.y = -1.3;
    rotundaBase.castShadow = true;
    centralDeskGroup.add(rotundaBase);

    // Rotunda Glass Mezzanine
    const rotundaGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(2.0, 2.0, 2.4, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        transmission: 0.6,
        transparent: true,
        opacity: 0.85,
        clearcoat: 1.0,
      })
    );
    rotundaGlass.position.y = 0.4;
    centralDeskGroup.add(rotundaGlass);

    // Fluted Gold Columns around Rotunda
    for (let c = 0; c < 8; c++) {
      const cAngle = (c / 8) * Math.PI * 2;
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 2.4, 12),
        brushedChampagneMat
      );
      col.position.set(Math.cos(cAngle) * 2.1, 0.4, Math.sin(cAngle) * 2.1);
      col.castShadow = true;
      centralDeskGroup.add(col);
    }

    // Golden Rotunda Dome
    const rotundaDome = new THREE.Mesh(
      new THREE.SphereGeometry(2.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.9 })
    );
    rotundaDome.position.y = 1.6;
    rotundaDome.castShadow = true;
    centralDeskGroup.add(rotundaDome);

    // Crown Beacon
    const rotundaSpire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.15, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
    );
    rotundaSpire.position.y = 3.6;
    centralDeskGroup.add(rotundaSpire);

    // Central Label Ring Billboard
    const centralLabelTex = createLabelTexture('PRIME ASSOCIATES', 'CENTRAL LENDING DESK • 40+ PARTNERS', '#0f766e', '#5eead4');
    if (centralLabelTex) {
      const bannerMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(2.25, 2.25, 0.6, 32, 1, true),
        new THREE.MeshBasicMaterial({ map: centralLabelTex, side: THREE.DoubleSide })
      );
      bannerMesh.position.y = 2.4;
      centralDeskGroup.add(bannerMesh);
    }

    networkGroup.add(centralDeskGroup);

    // 6 Real Partner Bank Pavilions
    const partnerBanks = [
      { name: 'STATE BANK OF INDIA', rate: 'Home Loan 7.25%*', color: '#1e3a8a', bColor: 0x1d4ed8, accent: 0xf59e0b, angle: 0 },
      { name: 'HDFC BANK', rate: 'Lowest Rate 7.25%*', color: '#0369a1', bColor: 0x0284c7, accent: 0xef4444, angle: (Math.PI / 3) },
      { name: 'ICICI BANK', rate: 'Mortgage LAP 8.50%*', color: '#b45309', bColor: 0xd97706, accent: 0xfbbf24, angle: (2 * Math.PI / 3) },
      { name: 'AXIS BANK', rate: 'Commercial LRD 8.90%*', color: '#881337', bColor: 0x9f1239, accent: 0xf43f5e, angle: Math.PI },
      { name: 'KOTAK MAHINDRA', rate: 'Fast-Track 24h Approval', color: '#dc2626', bColor: 0xb91c1c, accent: 0xf87171, angle: (4 * Math.PI / 3) },
      { name: 'LIC HOUSING FINANCE', rate: 'Govt. Subsidy / PMAY', color: '#065f46', bColor: 0x047857, accent: 0x34d399, angle: (5 * Math.PI / 3) },
    ];

    const dataPackets: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }[] = [];

    partnerBanks.forEach((bank) => {
      const bankDist = 7.6;
      const bx = Math.cos(bank.angle) * bankDist;
      const bz = Math.sin(bank.angle) * bankDist;

      const bankPavilion = new THREE.Group();

      // Bank Base Podium
      const bBase = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.6, 2.4),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
      );
      bBase.position.y = -1.6;
      bBase.castShadow = true;
      bankPavilion.add(bBase);

      // Bank Architectural Tower
      const bTower = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 3.4, 2.0),
        new THREE.MeshStandardMaterial({ color: bank.bColor, roughness: 0.2, metalness: 0.4 })
      );
      bTower.position.y = 0.4;
      bTower.castShadow = true;
      bankPavilion.add(bTower);

      // Bank Roof Crown
      const bRoof = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.4, 2.2),
        new THREE.MeshStandardMaterial({ color: bank.accent, roughness: 0.3, metalness: 0.8 })
      );
      bRoof.position.y = 2.3;
      bankPavilion.add(bRoof);

      // Bank Billboard Plaque
      const labelTex = createLabelTexture(bank.name, bank.rate, bank.color, '#ffffff');
      if (labelTex) {
        const plaque = new THREE.Mesh(
          new THREE.PlaneGeometry(2.4, 0.8),
          new THREE.MeshBasicMaterial({ map: labelTex, transparent: true })
        );
        plaque.position.set(0, 3.1, 0);
        // Turn plaque toward center
        plaque.rotation.y = Math.PI - bank.angle;
        bankPavilion.add(plaque);
      }

      bankPavilion.position.set(bx, 0, bz);
      networkGroup.add(bankPavilion);

      // Glass Sky-Bridge connecting Central Desk to Bank Pavilion
      const bridgeDist = bankDist - 2.8;
      const bridgeCenter = (2.2 + bankDist) / 2;
      const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(bridgeDist, 0.25, 0.8),
        new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          roughness: 0.1,
          transmission: 0.6,
          transparent: true,
          opacity: 0.85,
        })
      );
      bridge.position.set(Math.cos(bank.angle) * bridgeCenter, -0.6, Math.sin(bank.angle) * bridgeCenter);
      bridge.rotation.y = -bank.angle;
      networkGroup.add(bridge);

      // Moving Data Packets (Financial sanctions & disbursements)
      const packetGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const pMesh = new THREE.Mesh(packetGeo, packetMat);
      networkGroup.add(pMesh);

      dataPackets.push({
        mesh: pMesh,
        start: new THREE.Vector3(Math.cos(bank.angle) * 2.2, -0.5, Math.sin(bank.angle) * 2.2),
        end: new THREE.Vector3(bx, -0.5, bz),
        progress: Math.random(),
        speed: 0.4 + Math.random() * 0.2,
      });
    });

    dataPacketsRef.current = dataPackets;
    scene.add(networkGroup);

    // ─────────────────────────────────────────────────────────────
    // MODE 3: MEANINGFUL COLLATERAL TITLE DILIGENCE VAULT
    // ─────────────────────────────────────────────────────────────
    const vaultGroup = vaultGroupRef.current;
    vaultGroup.clear();
    vaultGroup.visible = false;

    // Vault Treasury Chamber Base (Heavy Polished Steel Floor)
    const vaultFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(9.0, 9.0, 0.3, 48),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 })
    );
    vaultFloor.position.y = -1.9;
    vaultFloor.receiveShadow = true;
    vaultGroup.add(vaultFloor);

    // Rear Safety Deposit Locker Wall
    const lockerWall = new THREE.Group();
    const lockerCols = 7;
    const lockerRows = 5;
    const lockerMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Brushed stainless steel
      roughness: 0.25,
      metalness: 0.85,
    });
    const lockerHandleMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Polished brass keyholes
      roughness: 0.2,
      metalness: 0.9,
    });

    for (let r = 0; r < lockerRows; r++) {
      for (let c = 0; c < lockerCols; c++) {
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.3), lockerMat);
        box.position.set(-2.7 + c * 0.9, -0.8 + r * 0.72, -4.8);
        lockerWall.add(box);

        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.08), lockerHandleMat);
        handle.position.set(-2.7 + c * 0.9 + 0.25, -0.8 + r * 0.72, -4.62);
        lockerWall.add(handle);
      }
    }
    vaultGroup.add(lockerWall);

    // Massive Heavy Bank Vault Portal & Open Circular Vault Door
    const portalGroup = new THREE.Group();

    // Vault Outer Portal Frame
    const portalFrame = new THREE.Mesh(
      new THREE.RingGeometry(3.2, 4.4, 36),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3, metalness: 0.9, side: THREE.DoubleSide })
    );
    portalFrame.position.set(0, 1.2, 0);
    portalGroup.add(portalFrame);

    // Massive Circular Bank Vault Door (Open ajar at 45 degrees)
    const doorGroup = new THREE.Group();
    doorGroup.position.set(-3.2, 1.2, 0); // Hinge pivot point

    const vaultDoor = new THREE.Mesh(
      new THREE.CylinderGeometry(3.0, 3.0, 0.6, 48),
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8, // Polished armor plate steel
        roughness: 0.2,
        metalness: 0.85,
      })
    );
    vaultDoor.rotation.x = Math.PI / 2;
    vaultDoor.position.set(3.0, 0, 0);

    // Chrome Radial Locking Bolts around Door Rim
    for (let b = 0; b < 16; b++) {
      const bAngle = (b / 16) * Math.PI * 2;
      const bolt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.45, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 })
      );
      bolt.position.set(Math.cos(bAngle) * 3.1, Math.sin(bAngle) * 3.1, 0);
      bolt.rotation.z = bAngle;
      vaultDoor.add(bolt);
    }

    // Central Brass Steering / Combination Wheel
    const wheelHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.25, 32),
      brushedChampagneMat
    );
    wheelHub.position.z = 0.38;
    vaultDoor.add(wheelHub);

    // 3 Chrome Spokes
    for (let sp = 0; sp < 3; sp++) {
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.8, 12),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95 })
      );
      spoke.rotation.z = (sp / 3) * Math.PI;
      spoke.position.z = 0.42;
      vaultDoor.add(spoke);
    }

    doorGroup.add(vaultDoor);
    doorGroup.rotation.y = -Math.PI / 3.2; // Swung open to show inside
    portalGroup.add(doorGroup);
    vaultGroup.add(portalGroup);

    // Center Title Scrutiny Pedestal (Collateral Inspection Table)
    const inspectionTableGroup = new THREE.Group();

    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.4, 1.1, 32),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2 })
    );
    tableBase.position.y = -1.35;
    tableBase.castShadow = true;
    inspectionTableGroup.add(tableBase);

    // Stack of 24K Gold Bullion Reserves (Capital Liquidity)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.12,
    });
    const goldBarGeo = new THREE.BoxGeometry(0.65, 0.2, 1.1);

    // Pyramid Stack of Gold Bars
    for (let layer = 0; layer < 3; layer++) {
      const count = 3 - layer;
      for (let i = 0; i < count; i++) {
        const bar = new THREE.Mesh(goldBarGeo, goldMat);
        bar.position.set(-0.8 + i * 0.75 + layer * 0.35, -0.7 + layer * 0.22, -1.8);
        bar.castShadow = true;
        inspectionTableGroup.add(bar);
      }
    }

    // Physical Title Deeds & 30-Year Mother Deed Dossiers
    const deedLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e, // Deep emerald legal binder
      roughness: 0.4,
    });
    const deedPageMat = new THREE.MeshStandardMaterial({
      color: 0xfef9c3, // Parchment paper
      roughness: 0.8,
    });

    for (let d = 0; d < 4; d++) {
      const deedGroup = new THREE.Group();
      const binder = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 1.5), deedLeatherMat);
      const pages = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.14, 1.45), deedPageMat);
      pages.position.x = 0.04;
      deedGroup.add(binder);
      deedGroup.add(pages);

      // Red/Green Wax Seal on Deed
      const waxSeal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16),
        new THREE.MeshBasicMaterial({ color: 0x15803d })
      );
      waxSeal.position.set(0.2, 0.11, 0.3);
      deedGroup.add(waxSeal);

      deedGroup.position.set(0.6, -0.7 + d * 0.2, -1.8);
      deedGroup.rotation.y = (d * 0.12) - 0.2;
      inspectionTableGroup.add(deedGroup);
    }

    // Inspection Table Plaque
    const auditLabelTex = createLabelTexture('30-YR TITLE DEED AUDIT', '100% ENCUMBRANCE-FREE COLLATERAL', '#065f46', '#4ade80');
    if (auditLabelTex) {
      const plaqueMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 0.75),
        new THREE.MeshBasicMaterial({ map: auditLabelTex, transparent: true })
      );
      plaqueMesh.position.set(0, -0.65, -0.6);
      inspectionTableGroup.add(plaqueMesh);
    }

    // Holographic Emerald Title Scanner Fan
    const scannerGeo = new THREE.ConeGeometry(2.6, 3.2, 32, 1, true);
    const scannerMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const scannerMesh = new THREE.Mesh(scannerGeo, scannerMat);
    scannerMesh.position.set(0, 1.0, -1.8);
    scannerMesh.rotation.x = Math.PI;
    scannerRef.current = scannerMesh;
    inspectionTableGroup.add(scannerMesh);

    vaultGroup.add(inspectionTableGroup);
    scene.add(vaultGroup);

    // ─────────────────────────────────────────────────────────────
    // EVENT LISTENERS & RESIZE
    // ─────────────────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 1.2;
      mouseRef.current.targetY = y * 1.0;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        skylineGroup.rotation.y += deltaX * 0.006;
        networkGroup.rotation.y += deltaX * 0.006;
        vaultGroup.rotation.y += deltaX * 0.006;
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // ─────────────────────────────────────────────────────────────
    // TRAFFIC PATH EVALUATION HELPERS
    // ─────────────────────────────────────────────────────────────
    const sampleOuterLoop = (t: number, laneOffset: number) => {
      const minX = -7.4 + laneOffset;
      const maxX = 7.4 - laneOffset;
      const minZ = -6.4 + laneOffset;
      const maxZ = 6.4 - laneOffset;

      const segW = maxX - minX;
      const segH = maxZ - minZ;
      const perimeter = (segW + segH) * 2;

      let dist = (t % 1.0) * perimeter;
      if (dist < 0) dist += perimeter;

      if (dist <= segW) return new THREE.Vector3(minX + dist, -1.97, maxZ);
      dist -= segW;
      if (dist <= segH) return new THREE.Vector3(maxX, -1.97, maxZ - dist);
      dist -= segH;
      if (dist <= segW) return new THREE.Vector3(maxX - dist, -1.97, minZ);
      dist -= segW;
      return new THREE.Vector3(minX, -1.97, minZ + dist);
    };

    const sampleAvenueCross = (t: number) => {
      const normalized = (t % 1.0);
      const isGoingSouth = normalized < 0.5;
      const subT = isGoingSouth ? normalized * 2 : (normalized - 0.5) * 2;
      const startZ = isGoingSouth ? -6.8 : 6.8;
      const endZ = isGoingSouth ? 6.8 : -6.8;
      const laneX = isGoingSouth ? 0.45 : -0.45;
      return new THREE.Vector3(laneX, -1.97, startZ + (endZ - startZ) * subT);
    };

    // ─────────────────────────────────────────────────────────────
    // ANIMATION LOOP (Traffic, Clouds, Banking Pulses, Scanner)
    // ─────────────────────────────────────────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Camera smooth damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      camera.position.x = mouseRef.current.x * 2.8;
      camera.position.y = 9.5 + mouseRef.current.y * 1.8;
      camera.lookAt(0, 0.8, 0);

      // Auto rotation when not dragging
      if (autoRotate && !isDraggingRef.current) {
        skylineGroup.rotation.y += 0.0016;
        networkGroup.rotation.y += 0.0022;
        vaultGroup.rotation.y += 0.002;
      }

      // Drift Clouds gently across the blue sky
      if (cloudsGroup) {
        cloudsGroup.rotation.y += 0.0006;
      }

      // Aircraft red beacon pulse
      if (beaconLight) {
        const pulse = 0.5 + Math.sin(elapsedTime * 6.0) * 0.5;
        (beaconLight.material as THREE.MeshBasicMaterial).color.setRGB(1.0, 0.2 * pulse, 0.2 * pulse);
      }

      // Update Moving Vehicles in Skyline mode
      if (skylineGroup.visible && activeVehicles.length > 0) {
        activeVehicles.forEach((v) => {
          v.progress = (v.progress + v.speed * delta) % 1.0;

          let posNow: THREE.Vector3;
          let posNext: THREE.Vector3;

          if (v.pathType === 'outerClockwise') {
            posNow = sampleOuterLoop(v.progress, 0.55);
            posNext = sampleOuterLoop(v.progress + 0.005, 0.55);
          } else if (v.pathType === 'outerCounter') {
            posNow = sampleOuterLoop(1.0 - v.progress, -0.55);
            posNext = sampleOuterLoop(1.0 - (v.progress + 0.005), -0.55);
          } else {
            posNow = sampleAvenueCross(v.progress);
            posNext = sampleAvenueCross(v.progress + 0.005);
          }

          v.mesh.position.copy(posNow);
          const dx = posNext.x - posNow.x;
          const dz = posNext.z - posNow.z;
          v.mesh.rotation.y = Math.atan2(dx, dz);

          v.wheels.forEach((w) => {
            w.rotation.x += v.speed * 25.0;
          });
        });
      }

      // Update Active Banking Pulses in Lender Grid mode
      if (networkGroup.visible && dataPacketsRef.current.length > 0) {
        dataPacketsRef.current.forEach((dp) => {
          dp.progress = (dp.progress + dp.speed * delta) % 1.0;
          dp.mesh.position.lerpVectors(dp.start, dp.end, dp.progress);
          const pScale = 0.8 + Math.sin(dp.progress * Math.PI) * 0.6;
          dp.mesh.scale.set(pScale, pScale, pScale);
        });
      }

      // Update Holographic Scanner in Collateral Vault mode
      if (vaultGroup.visible && scannerRef.current) {
        const scanPulse = (Math.sin(elapsedTime * 2.5) + 1.0) * 0.5;
        scannerRef.current.scale.set(1.0 + scanPulse * 0.15, 1.0, 1.0 + scanPulse * 0.15);
        (scannerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + scanPulse * 0.18;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);

      scene.clear();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[520px] lg:min-h-[640px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    >
      {/* Clean Mode Tab Bar ONLY (No other boxes) */}
      <div className="absolute top-4 right-4 z-20 flex items-center pointer-events-auto">
        <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md">
          <button
            type="button"
            onClick={() => handleModeSwitch('skyline')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'skyline'
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
            title="City Property Skyline & Roads"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Skyline</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('network')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'network'
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
            title="40+ Bank Syndication Desks & Rates"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Lender Grid</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('vault')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'vault'
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
            title="High-Security Title Diligence Vault"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Collateral Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
