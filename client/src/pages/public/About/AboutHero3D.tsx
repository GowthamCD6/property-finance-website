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
  
  // Vault mechanical animation references
  const vaultDoorGroupRef = useRef<THREE.Group | null>(null);
  const vaultWheelRef = useRef<THREE.Mesh | null>(null);
  const vaultBoltsRef = useRef<THREE.Mesh[]>([]);
  const vaultScannerBeamRef = useRef<THREE.Mesh | null>(null);
  const scannerRef = useRef<THREE.Mesh | null>(null);
  const vaultHoloRingRef = useRef<THREE.Mesh | null>(null);
  const bannerRingRef = useRef<THREE.Mesh | null>(null);

  // Mouse & interaction states
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const currentModeRef = useRef<SceneMode>('skyline');

  const handleModeSwitch = (mode: SceneMode) => {
    setActiveMode(mode);
    currentModeRef.current = mode;
    if (onModeChange) onModeChange(mode);

    if (skylineGroupRef.current) skylineGroupRef.current.visible = mode === 'skyline';
    if (networkGroupRef.current) networkGroupRef.current.visible = mode === 'network';
    if (vaultGroupRef.current) {
      vaultGroupRef.current.visible = mode === 'vault';
      if (mode === 'vault') {
        vaultGroupRef.current.rotation.y = 0; // Instantly align to front face
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Soft daylight aerial fog
    scene.fog = new THREE.FogExp2(0xcde3f7, 0.008);

    // 2. Camera setup with isometric vantage
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 10.5, 23);
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
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
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
        gradient.addColorStop(0.0, '#0284c7'); // Deep azure blue at sky zenith
        gradient.addColorStop(0.35, '#38bdf8'); // Radiant summer blue
        gradient.addColorStop(0.7, '#93c5fd');  // Soft light sky blue
        gradient.addColorStop(0.92, '#cde3f7'); // Radiant daylight horizon glow
        gradient.addColorStop(1.0, '#dbeafe');  // Horizon blend
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
      opacity: 0.9,
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
      createCloudCluster(-30, 20, -38, 2.8),
      createCloudCluster(18, 24, -45, 3.4),
      createCloudCluster(35, 21, -30, 2.9),
      createCloudCluster(-12, 26, -52, 3.6),
      createCloudCluster(5, 18, 26, 2.5),
      createCloudCluster(-38, 22, 12, 3.0),
    ];
    clouds.forEach((c) => cloudsGroup.add(c));
    scene.add(cloudsGroup);

    // 6. Natural Daylight Lighting
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0xf1f5f9, 1.9);
    hemiLight.position.set(0, 40, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.9);
    sunLight.position.set(18, 34, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.2);
    fillLight.position.set(-20, 18, -15);
    scene.add(fillLight);

    // Ground Expanse
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
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

    // Procedural Window Texture Generator for Real Glass Facades
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

    const windowTexBlue = createWindowTexture(12, 8, '#1d4ed8');
    const windowTexTeal = createWindowTexture(14, 8, '#0d9488');
    const windowTexAzure = createWindowTexture(10, 6, '#0284c7');

    // Procedural Clean Signboard Canvas Texture
    const createSignTexture = (bankName: string, rate: string, primaryColor: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 640, 180);

      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, 0, 640, 14);

      ctx.fillStyle = '#ffffff';
      const titleFont = bankName.length > 20 ? 'bold 30px sans-serif' : 'bold 38px sans-serif';
      ctx.font = titleFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bankName, 320, 70);

      ctx.fillStyle = '#38bdf8';
      const subFont = rate.length > 26 ? 'bold 22px sans-serif' : 'bold 28px sans-serif';
      ctx.font = subFont;
      ctx.fillText(rate, 320, 126);

      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 5;
      ctx.strokeRect(3, 3, 634, 174);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Reusable Architectural Materials
    const whiteGraniteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
    const brushedChampagneMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.75 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1, metalness: 0.95 });
    const darkRoofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });

    // ─────────────────────────────────────────────────────────────
    // MODE 1: REALISTIC ARCHITECTURAL SKYLINE & MOVING VEHICLES
    // ─────────────────────────────────────────────────────────────
    const skylineGroup = skylineGroupRef.current;
    skylineGroup.clear();

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x27303f, roughness: 0.85, metalness: 0.1 });
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

    const createSidewalkBlock = (w: number, d: number, x: number, z: number) => {
      const sw = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, d), sidewalkMat);
      sw.position.set(x, -1.9, z);
      sw.receiveShadow = true;
      skylineGroup.add(sw);
    };
    createSidewalkBlock(6.2, 11.8, -4.0, 0);
    createSidewalkBlock(6.2, 11.8, 4.0, 0);

    // Centerpiece Prime Tower
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

    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.4, 2.0),
      new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.08, transmission: 0.5, transparent: true, opacity: 0.9 })
    );
    crown.position.y = 8.1;
    centerTowerGroup.add(crown);

    const helipad = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.15, 32), darkRoofMat);
    helipad.position.y = 8.85;
    centerTowerGroup.add(helipad);

    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.1, 2.0, 16), chromeMat);
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

      const bRoof = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.75, 0.7, b.d * 0.75), darkRoofMat);
      bRoof.position.y = -2 + b.h + 0.35;
      bGroup.add(bRoof);

      bGroup.position.set(b.x, 0, b.z);
      skylineGroup.add(bGroup);
    });

    // Street Trees
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    [[-1.5, -4.2], [1.5, -4.2], [-1.5, 4.2], [1.5, 4.2], [-6.5, -4.2], [6.5, -4.2], [-6.5, 4.2], [6.5, 4.2]].forEach(([tx, tz]) => {
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

    // Moving Street Vehicles
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

      // Lights
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
      [
        [-width / 2 - 0.02, wheelRadius, length * 0.3],
        [width / 2 + 0.02, wheelRadius, length * 0.3],
        [-width / 2 - 0.02, wheelRadius, -length * 0.3],
        [width / 2 + 0.02, wheelRadius, -length * 0.3],
      ].forEach(([wx, wy, wz]) => {
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
    // MODE 2: HIGH-END INSTITUTIONAL LENDER CAMPUS (Realistic Bank Towers)
    // ─────────────────────────────────────────────────────────────
    const networkGroup = networkGroupRef.current;
    networkGroup.clear();
    networkGroup.visible = false;

    // Architectural Campus Plaza Floor (Concentric Granite & Inlaid Marble Paving)
    const campusPlaza = new THREE.Mesh(
      new THREE.CylinderGeometry(11.5, 11.5, 0.22, 64),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.1 })
    );
    campusPlaza.position.y = -1.9;
    campusPlaza.receiveShadow = true;
    networkGroup.add(campusPlaza);

    // Concentric Inlaid Marble Bands
    [4.6, 7.8, 10.5].forEach((r) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r, r + 0.18, 64),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, metalness: 0.8, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.78;
      networkGroup.add(ring);
    });

    // Central Monumental Prime Syndication Rotunda
    const centralDeskGroup = new THREE.Group();

    // Rotunda Tiered Marble Steps
    const step1 = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.2, 0.25, 36), whiteGraniteMat);
    step1.position.y = -1.7;
    centralDeskGroup.add(step1);

    const step2 = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.8, 0.3, 36), whiteGraniteMat);
    step2.position.y = -1.45;
    centralDeskGroup.add(step2);

    // Inner Glass Boardroom Cylinder
    const rotundaGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(1.9, 1.9, 2.4, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.05,
        transmission: 0.7,
        transparent: true,
        opacity: 0.85,
        clearcoat: 1.0,
      })
    );
    rotundaGlass.position.y = -0.1;
    centralDeskGroup.add(rotundaGlass);

    // 10 Fluted Marble & Gold Columns
    for (let c = 0; c < 10; c++) {
      const cAngle = (c / 10) * Math.PI * 2;
      const colGroup = new THREE.Group();
      const colShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 2.4, 16),
        whiteGraniteMat
      );
      const colCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.09, 0.15, 16),
        brushedChampagneMat
      );
      colCap.position.y = 1.2;
      colGroup.add(colShaft);
      colGroup.add(colCap);
      colGroup.position.set(Math.cos(cAngle) * 2.1, -0.1, Math.sin(cAngle) * 2.1);
      centralDeskGroup.add(colGroup);
    }

    // Sculpted Entablature Ring
    const entablature = new THREE.Mesh(
      new THREE.CylinderGeometry(2.35, 2.3, 0.35, 36),
      whiteGraniteMat
    );
    entablature.position.y = 1.25;
    centralDeskGroup.add(entablature);

    // Classical Ribbed Bronze Dome
    const rotundaDome = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.85 })
    );
    rotundaDome.position.y = 1.4;
    centralDeskGroup.add(rotundaDome);

    // Dome Lantern & Golden Finial
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.7, 16), whiteGraniteMat);
    lantern.position.y = 3.7;
    centralDeskGroup.add(lantern);

    const finialSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 1.4, 16), brushedChampagneMat);
    finialSpire.position.y = 4.6;
    centralDeskGroup.add(finialSpire);

    // Rotating 360° Illuminated Ticker Ribbon
    const tickerCanvas = document.createElement('canvas');
    tickerCanvas.width = 1024;
    tickerCanvas.height = 128;
    const tCtx = tickerCanvas.getContext('2d');
    if (tCtx) {
      tCtx.fillStyle = '#0f172a';
      tCtx.fillRect(0, 0, 1024, 128);
      tCtx.fillStyle = '#14b8a6';
      tCtx.fillRect(0, 0, 1024, 8);
      tCtx.fillRect(0, 120, 1024, 8);
      tCtx.fillStyle = '#f8fafc';
      tCtx.font = 'bold 36px sans-serif';
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      tCtx.fillText('★ PRIME ASSOCIATES ★ CENTRAL LENDING DESK ★ 40+ BANK PARTNERS ★', 512, 64);
    }
    const tickerTex = new THREE.CanvasTexture(tickerCanvas);
    tickerTex.wrapS = THREE.RepeatWrapping;
    tickerTex.wrapT = THREE.RepeatWrapping;

    const tickerRing = new THREE.Mesh(
      new THREE.CylinderGeometry(2.45, 2.45, 0.5, 48, 1, true),
      new THREE.MeshBasicMaterial({ map: tickerTex, side: THREE.DoubleSide })
    );
    tickerRing.position.y = 2.4;
    bannerRingRef.current = tickerRing;
    centralDeskGroup.add(tickerRing);

    networkGroup.add(centralDeskGroup);

    // 6 Realistic Banking Headquarters Towers
    const partnerBanks = [
      { name: 'SBI BANK', rate: 'Rate 7.25%*', color: '#1e40af', bColor: 0x1d4ed8, angle: 0 },
      { name: 'HDFC BANK', rate: 'Rate 7.25%*', color: '#0369a1', bColor: 0x0284c7, angle: Math.PI / 3 },
      { name: 'ICICI BANK', rate: 'LAP 8.50%*', color: '#c2410c', bColor: 0xd97706, angle: (2 * Math.PI) / 3 },
      { name: 'AXIS BANK', rate: 'LRD 8.90%*', color: '#9f1239', bColor: 0x881337, angle: Math.PI },
      { name: 'KOTAK BANK', rate: '24h Approval', color: '#b91c1c', bColor: 0xdc2626, angle: (4 * Math.PI) / 3 },
      { name: 'LIC HOUSING', rate: 'PMAY Subsidy', color: '#047857', bColor: 0x059669, angle: (5 * Math.PI) / 3 },
    ];

    const dataPackets: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }[] = [];

    partnerBanks.forEach((bank) => {
      const bankDist = 7.8;
      const bx = Math.cos(bank.angle) * bankDist;
      const bz = Math.sin(bank.angle) * bankDist;

      const bankPavilion = new THREE.Group();

      // Bank Base Podium
      const bBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 2.6), whiteGraniteMat);
      bBase.position.y = -1.6;
      bBase.castShadow = true;
      bankPavilion.add(bBase);

      // Bank Main Glass High-Rise Tower Shaft
      const bTower = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 4.4, 2.2),
        new THREE.MeshStandardMaterial({
          color: bank.bColor,
          map: windowTexAzure || undefined,
          roughness: 0.15,
          metalness: 0.35,
        })
      );
      bTower.position.y = 0.9;
      bTower.castShadow = true;
      bankPavilion.add(bTower);

      // Corner Metal Trims
      const trimGeo = new THREE.BoxGeometry(0.12, 4.5, 0.12);
      [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]].forEach(([cx, cz]) => {
        const trim = new THREE.Mesh(trimGeo, brushedChampagneMat);
        trim.position.set(cx, 0.9, cz);
        bankPavilion.add(trim);
      });

      // Ground Floor Entrance Lobby Portico
      const lobbyCanopy = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.12, 0.7),
        brushedChampagneMat
      );
      lobbyCanopy.position.set(0, -0.6, 1.25);
      bankPavilion.add(lobbyCanopy);

      // Rooftop Architectural Parapet
      const bParapet = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.35, 2.35), darkRoofMat);
      bParapet.position.y = 3.25;
      bankPavilion.add(bParapet);

      // 4-Sided Illuminated 3D Rooftop Marquee Box
      const signTex = createSignTexture(bank.name, bank.rate, bank.color);
      if (signTex) {
        const signBoxMat = new THREE.MeshBasicMaterial({ map: signTex });
        const signMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.75, 2.2), signBoxMat);
        signMesh.position.y = 3.8;
        bankPavilion.add(signMesh);
      }

      bankPavilion.position.set(bx, 0, bz);
      bankPavilion.rotation.y = -bank.angle + Math.PI / 2;
      networkGroup.add(bankPavilion);

      // Futuristic Illuminated Glass Skyway Bridge
      const bridgeLen = bankDist - 3.2;
      const bridgeCenter = (2.2 + bankDist) / 2;
      const bridgeGroup = new THREE.Group();

      const bridgeTube = new THREE.Mesh(
        new THREE.BoxGeometry(bridgeLen, 0.35, 0.7),
        new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          roughness: 0.1,
          transmission: 0.7,
          transparent: true,
          opacity: 0.85,
        })
      );
      bridgeGroup.add(bridgeTube);

      const railGeo = new THREE.CylinderGeometry(0.04, 0.04, bridgeLen, 8);
      const rail1 = new THREE.Mesh(railGeo, chromeMat);
      rail1.rotation.z = Math.PI / 2;
      rail1.position.set(0, 0.22, 0.32);
      bridgeGroup.add(rail1);

      const rail2 = new THREE.Mesh(railGeo, chromeMat);
      rail2.rotation.z = Math.PI / 2;
      rail2.position.set(0, 0.22, -0.32);
      bridgeGroup.add(rail2);

      bridgeGroup.position.set(Math.cos(bank.angle) * bridgeCenter, -0.65, Math.sin(bank.angle) * bridgeCenter);
      bridgeGroup.rotation.y = -bank.angle;
      networkGroup.add(bridgeGroup);

      // Glowing Data Packets
      const packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
      );
      networkGroup.add(packet);

      dataPackets.push({
        mesh: packet,
        start: new THREE.Vector3(Math.cos(bank.angle) * 2.3, -0.6, Math.sin(bank.angle) * 2.3),
        end: new THREE.Vector3(bx, -0.6, bz),
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.2,
      });
    });

    dataPacketsRef.current = dataPackets;
    scene.add(networkGroup);

    // ─────────────────────────────────────────────────────────────
    // MODE 3: HIGH-SECURITY INSTITUTIONAL COLLATERAL VAULT & AUDIT
    // ─────────────────────────────────────────────────────────────
    const vaultGroup = vaultGroupRef.current;
    vaultGroup.clear();
    vaultGroup.visible = false;
    vaultGroup.scale.set(0.72, 0.72, 0.72); // Reduced animation size so it fits properly and elegantly

    // Dedicated Vault Atmospheric Lights (Daylight Corporate Treasury Ambience)
    const vaultSpot = new THREE.SpotLight(0xfffbeb, 3.2, 28, Math.PI / 3.5, 0.35, 1.0);
    vaultSpot.position.set(0, 9.0, 5.0);
    vaultSpot.target.position.set(0, 0, 0);
    vaultGroup.add(vaultSpot);
    vaultGroup.add(vaultSpot.target);

    const vaultFill = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    vaultFill.position.set(3, 8, 8);
    vaultGroup.add(vaultFill);

    const vaultGreenGlow = new THREE.PointLight(0x10b981, 2.4, 12);
    vaultGreenGlow.position.set(1.4, 0.6, 0.8);
    vaultGroup.add(vaultGreenGlow);

    const vaultGoldGlow = new THREE.PointLight(0xf59e0b, 2.2, 10);
    vaultGoldGlow.position.set(-0.2, 0.4, 0.5);
    vaultGroup.add(vaultGoldGlow);

    // 1. Architectural Chamber Floor Foundation (Prestige Carrara White Marble)
    const vaultFloorGeo = new THREE.BoxGeometry(16.5, 0.22, 13.0);
    const vaultFloorMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.18,
      metalness: 0.2,
    });
    const vaultFloor = new THREE.Mesh(vaultFloorGeo, vaultFloorMat);
    vaultFloor.position.set(0, -1.88, -0.2);
    vaultFloor.receiveShadow = true;
    vaultGroup.add(vaultFloor);

    // Champagne Gold Perimeter Curb Trim
    const vaultFloorTrim = new THREE.Mesh(
      new THREE.BoxGeometry(16.9, 0.08, 13.4),
      brushedChampagneMat
    );
    vaultFloorTrim.position.set(0, -1.82, -0.2);
    vaultGroup.add(vaultFloorTrim);

    // High-Security Floor Track Perimeter Inlays (Chrome & Emerald Inlay Bands)
    [3.4, 5.8].forEach((r, idx) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r, r + 0.12, 64),
        new THREE.MeshStandardMaterial({
          color: idx === 0 ? 0x10b981 : 0xd97706,
          roughness: 0.15,
          metalness: 0.92,
          side: THREE.DoubleSide,
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, -1.74, -0.2);
      vaultGroup.add(ring);
    });

    // 2. Heavy Architectural Vault Rear Wall (Low-Profile so Blue Sky is Visible)
    const vaultWallGroup = new THREE.Group();

    // Solid Armored Slate Titanium Back Wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(16.5, 4.6, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.28, metalness: 0.85 })
    );
    backWall.position.set(0, 0.5, -4.6);
    vaultWallGroup.add(backWall);

    // Top Architectural Lintel Beam
    const lintelBeam = new THREE.Mesh(
      new THREE.BoxGeometry(16.9, 0.5, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.9 })
    );
    lintelBeam.position.set(0, 2.9, -4.4);
    vaultWallGroup.add(lintelBeam);

    // Heavy Security Pilasters (Left & Right) with Emerald Status Light Strips
    [-8.0, 8.0].forEach((px) => {
      const pilaster = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 4.6, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.88 })
      );
      pilaster.position.set(px, 0.5, -4.45);
      vaultWallGroup.add(pilaster);

      // Embedded Vertical LED Safety Light Strip
      const lightStrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.2, 0.08),
        new THREE.MeshBasicMaterial({ color: 0x10b981 })
      );
      lightStrip.position.set(px > 0 ? px - 0.34 : px + 0.34, 0.5, -4.1);
      vaultWallGroup.add(lightStrip);
    });

    // 3. Integrated Precision Safety Deposit Locker Matrix (Built onto Back Wall)
    const lockerBank = new THREE.Group();
    const lockerFaceMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.92 });
    const lockerBrassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, metalness: 0.95 });
    const lockerChromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1, metalness: 0.98 });
    const lockerLedMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    const rows = 4;
    const cols = 7;
    const boxW = 0.82;
    const boxH = 0.56;
    const startX = 0.4;
    const startY = -0.7;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bx = startX + c * (boxW + 0.05);
        const by = startY + r * (boxH + 0.06);

        // Locker Door Face
        const box = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, 0.12), lockerFaceMat);
        box.position.set(bx, by, -4.34);
        lockerBank.add(box);

        // Dual Keyholes
        const k1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 12), lockerBrassMat);
        k1.rotation.x = Math.PI / 2;
        k1.position.set(bx - 0.22, by, -4.26);
        lockerBank.add(k1);

        const k2 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 12), lockerBrassMat);
        k2.rotation.x = Math.PI / 2;
        k2.position.set(bx - 0.1, by, -4.26);
        lockerBank.add(k2);

        // Chrome Pull Handle
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.04), lockerChromeMat);
        handle.position.set(bx + 0.24, by, -4.26);
        lockerBank.add(handle);

        // Serial Number Plate
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.02), lockerBrassMat);
        plate.position.set(bx, by + 0.18, -4.27);
        lockerBank.add(plate);

        // Status LED Indicator
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.02), lockerLedMat);
        led.position.set(bx + 0.32, by + 0.22, -4.27);
        lockerBank.add(led);
      }
    }
    vaultWallGroup.add(lockerBank);
    vaultGroup.add(vaultWallGroup);

    // 4. Massive 3D Bank Vault Doorway & Articulated Open Vault Door
    const doorwayGroup = new THREE.Group();
    doorwayGroup.position.set(-2.2, 0.8, -0.6);

    // Deep 3D Outer Portal Frame Collar (Solid 3D Steel Collar with Bevel)
    const portalCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(2.7, 2.7, 0.7, 48, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.25, metalness: 0.9 })
    );
    portalCollar.rotation.x = Math.PI / 2;
    doorwayGroup.add(portalCollar);

    // Chamfered Chrome Front Portal Ring
    const portalFrontRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.24, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.15, metalness: 0.95 })
    );
    portalFrontRing.position.z = 0.35;
    doorwayGroup.add(portalFrontRing);

    // Inner Bolt Locking Strike Sockets (Recessed into the doorway jamb)
    for (let s = 0; s < 16; s++) {
      const sAngle = (s / 16) * Math.PI * 2;
      const strikeSocket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.16, 16),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.9 })
      );
      strikeSocket.position.set(Math.cos(sAngle) * 2.66, Math.sin(sAngle) * 2.66, 0);
      strikeSocket.rotation.z = sAngle - Math.PI / 2;
      doorwayGroup.add(strikeSocket);
    }

    // Heavy Industrial Hinge Pivot (Mounted on the left side of the doorway)
    const hingePivot = new THREE.Group();
    hingePivot.position.set(-2.6, 0, 0.35); // Left edge of the door frame
    vaultDoorGroupRef.current = hingePivot;

    // Hinge Wall Brackets (Top & Bottom)
    [-1.2, 1.2].forEach((hy) => {
      const bracket = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.45, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.85 })
      );
      bracket.position.set(-0.35, hy, -0.2);
      hingePivot.add(bracket);
    });

    // Massive Chrome Vertical Hinge Pin
    const hingePin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 3.2, 24),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1, metalness: 0.98 })
    );
    hingePivot.add(hingePin);

    // Heavy Articulated Hinge Crane Arm
    const hingeArm = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.38, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.25, metalness: 0.9 })
    );
    hingeArm.position.set(1.3, 0, 0.15);
    hingePivot.add(hingeArm);

    // ── The Vault Door Assembly Group (Centered on the door face) ──
    const doorAssembly = new THREE.Group();
    doorAssembly.position.set(2.6, 0, 0.2); // Sits at the end of the hinge arm

    // Main Cylindrical Steel Door Body
    const doorDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(2.45, 2.45, 0.55, 64),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.18, metalness: 0.9 })
    );
    doorDisc.rotation.x = Math.PI / 2;
    doorAssembly.add(doorDisc);

    // Front Stepped Faceplate (Titanium & Champagne Gold)
    const doorFace = new THREE.Mesh(
      new THREE.CylinderGeometry(2.18, 2.18, 0.14, 64),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, metalness: 0.85 })
    );
    doorFace.rotation.x = Math.PI / 2;
    doorFace.position.z = 0.32;
    doorAssembly.add(doorFace);

    // Outer Chrome Bezel Trim
    const doorBezel = new THREE.Mesh(
      new THREE.TorusGeometry(2.45, 0.08, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1, metalness: 0.98 })
    );
    doorBezel.position.z = 0.27;
    doorAssembly.add(doorBezel);

    // 16 Radial Chrome Locking Bolts (Seated precisely in the door rim!)
    const bolts: THREE.Mesh[] = [];
    const boltBaseRadius = 2.38;
    for (let b = 0; b < 16; b++) {
      const bAngle = (b / 16) * Math.PI * 2;
      const boltMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16),
        chromeMat
      );
      boltMesh.position.set(Math.cos(bAngle) * boltBaseRadius, Math.sin(bAngle) * boltBaseRadius, 0);
      boltMesh.rotation.z = bAngle - Math.PI / 2; // Radially pointing outward from door rim!
      doorAssembly.add(boltMesh);
      bolts.push(boltMesh);
    }
    vaultBoltsRef.current = bolts;

    // Central Mechanical Gear Movement Housing
    const gearBox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 0.18, 36),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.9 })
    );
    gearBox.rotation.x = Math.PI / 2;
    gearBox.position.z = 0.42;
    doorAssembly.add(gearBox);

    // Exposed Interlocking Brass Planetary Gears
    for (let g = 0; g < 3; g++) {
      const gAngle = (g / 3) * Math.PI * 2;
      const gear = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.12, 16),
        brushedChampagneMat
      );
      gear.rotation.x = Math.PI / 2;
      gear.position.set(Math.cos(gAngle) * 0.52, Math.sin(gAngle) * 0.52, 0.5);
      doorAssembly.add(gear);
    }

    // Helmsman Combination Steering Wheel (Rotates dynamically!)
    const wheelGroup = new THREE.Group();
    wheelGroup.position.z = 0.58;

    const wheelHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.16, 24),
      chromeMat
    );
    wheelHub.rotation.x = Math.PI / 2;
    wheelGroup.add(wheelHub);

    const wheelRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.82, 0.05, 16, 36),
      chromeMat
    );
    wheelGroup.add(wheelRim);

    // 4 Chrome Spokes with Brass Grips
    for (let sp = 0; sp < 4; sp++) {
      const spokeAngle = (sp / 4) * Math.PI;
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 1.64, 12),
        chromeMat
      );
      spoke.rotation.z = spokeAngle;
      wheelGroup.add(spoke);

      const grip1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.16, 12), brushedChampagneMat);
      grip1.rotation.x = Math.PI / 2;
      grip1.position.set(Math.cos(spokeAngle) * 0.82, Math.sin(spokeAngle) * 0.82, 0.08);
      wheelGroup.add(grip1);

      const grip2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.16, 12), brushedChampagneMat);
      grip2.rotation.x = Math.PI / 2;
      grip2.position.set(-Math.cos(spokeAngle) * 0.82, -Math.sin(spokeAngle) * 0.82, 0.08);
      wheelGroup.add(grip2);
    }

    doorAssembly.add(wheelGroup);
    vaultWheelRef.current = wheelGroup as unknown as THREE.Mesh;

    // Dual High-Precision Key Dials
    [-1.15, 1.15].forEach((dx) => {
      const dialBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.26, 0.08, 24),
        chromeMat
      );
      dialBase.rotation.x = Math.PI / 2;
      dialBase.position.set(dx, 0.5, 0.44);
      doorAssembly.add(dialBase);

      const dialKnob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16),
        brushedChampagneMat
      );
      dialKnob.rotation.x = Math.PI / 2;
      dialKnob.position.set(dx, 0.5, 0.5);
      doorAssembly.add(dialKnob);
    });

    // Biometric Security Pad with Emerald Status Glow
    const bioPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.55, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
    );
    bioPad.position.set(-1.15, -0.6, 0.42);
    doorAssembly.add(bioPad);

    const bioGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.35, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    bioGlass.position.set(-1.15, -0.58, 0.47);
    doorAssembly.add(bioGlass);

    hingePivot.add(doorAssembly);
    hingePivot.rotation.y = -Math.PI / 3.4; // Initial open swing angle
    doorwayGroup.add(hingePivot);
    vaultGroup.add(doorwayGroup);

    // 5. Executive Collateral Scrutiny Desk (Due Diligence Lab)
    const inspectionTableGroup = new THREE.Group();
    inspectionTableGroup.position.set(1.4, -0.9, 0.6);

    // Luxury Modern Executive Desk Surface
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.16, 2.3),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.85 })
    );
    tableTop.position.y = 0;
    tableTop.castShadow = true;
    inspectionTableGroup.add(tableTop);

    // Polished Champagne Gold Perimeter Bezel
    const tableBezel = new THREE.Mesh(
      new THREE.BoxGeometry(4.28, 0.05, 2.38),
      brushedChampagneMat
    );
    tableBezel.position.y = -0.06;
    inspectionTableGroup.add(tableBezel);

    // 4 Modern Architectural Chrome Legs
    [
      [-1.9, -0.5, -0.95],
      [1.9, -0.5, -0.95],
      [-1.9, -0.5, 0.95],
      [1.9, -0.5, 0.95],
    ].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16),
        chromeMat
      );
      leg.position.set(lx, ly, lz);
      inspectionTableGroup.add(leg);

      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16),
        brushedChampagneMat
      );
      foot.position.set(lx, ly - 0.42, lz);
      inspectionTableGroup.add(foot);
    });

    // ── Asset 1: Pyramid Stack of 24K Gold Bullion Bars ──
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.98,
      roughness: 0.08,
    });
    const goldBarGeo = new THREE.BoxGeometry(0.62, 0.16, 1.05);

    for (let layer = 0; layer < 3; layer++) {
      const count = 3 - layer;
      for (let i = 0; i < count; i++) {
        const bar = new THREE.Mesh(goldBarGeo, goldMat);
        bar.position.set(-1.4 + i * 0.68 + layer * 0.34, 0.14 + layer * 0.16, -0.15);
        bar.castShadow = true;
        inspectionTableGroup.add(bar);
      }
    }

    // ── Asset 2: Authentic 30-Year Mother Deed Dossiers & Land Survey Blueprints ──
    const deedLeatherMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.35 });
    const deedPageMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.75 });
    const waxSealMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.2, metalness: 0.3 });

    for (let d = 0; d < 4; d++) {
      const deedGroup = new THREE.Group();
      const binder = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 1.5), deedLeatherMat);
      const pages = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.11, 1.45), deedPageMat);
      pages.position.x = 0.04;
      deedGroup.add(binder);
      deedGroup.add(pages);

      // Sovereign Notary Wax Seal
      const waxSeal = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 16), waxSealMat);
      waxSeal.position.set(0.2, 0.09, 0.3);
      deedGroup.add(waxSeal);

      // Gold Ribbon
      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 1.52), brushedChampagneMat);
      ribbon.position.set(0.2, 0.08, 0);
      deedGroup.add(ribbon);

      deedGroup.position.set(0.6, 0.12 + d * 0.16, -0.15);
      deedGroup.rotation.y = d * 0.1 - 0.15;
      inspectionTableGroup.add(deedGroup);
    }

    // Rolled Cadastral Blueprint Scroll
    const blueprint = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 1.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 })
    );
    blueprint.rotation.z = Math.PI / 2;
    blueprint.position.set(0.6, 0.8, 0.7);
    inspectionTableGroup.add(blueprint);

    const blueRibbon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105, 0.105, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2 })
    );
    blueRibbon.rotation.z = Math.PI / 2;
    blueRibbon.position.set(0.6, 0.8, 0.7);
    inspectionTableGroup.add(blueRibbon);

    // ── Asset 3: Laser Verification Scanner Posts & Emerald Sweep Beam ──
    [-0.3, 1.5].forEach((postX) => {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16),
        chromeMat
      );
      post.position.set(postX, 0.45, -0.15);
      inspectionTableGroup.add(post);

      const postHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x10b981 })
      );
      postHead.position.set(postX, 0.8, -0.15);
      inspectionTableGroup.add(postHead);
    });

    // Sweeping Emerald Laser Line Beam
    const scanBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.03, 0.03),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    scanBar.position.set(0.6, 0.82, -0.15);
    vaultScannerBeamRef.current = scanBar;
    inspectionTableGroup.add(scanBar);

    // Subtle Luminous Laser Sweep Fan Sheet
    const scannerFan = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 0.65),
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      })
    );
    scannerFan.rotation.x = Math.PI / 2;
    scannerFan.position.set(0.6, 0.5, -0.15);
    scannerRef.current = scannerFan;
    inspectionTableGroup.add(scannerFan);

    // ── Asset 4: Floating Holographic Security Verification Badge ──
    const holoBadgeGroup = new THREE.Group();
    holoBadgeGroup.position.set(0.6, 1.5, -0.15);

    const holoRing = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 0.78, 36),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    holoBadgeGroup.add(holoRing);

    const holoInnerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.48, 0.52, 24),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
    );
    holoBadgeGroup.add(holoInnerRing);

    vaultHoloRingRef.current = holoBadgeGroup as unknown as THREE.Mesh;
    inspectionTableGroup.add(holoBadgeGroup);

    // ── Asset 5: Official Desk Plaque ──
    const auditLabelTex = createSignTexture('30-YEAR TITLE DEED AUDIT', '100% ENCUMBRANCE-FREE COLLATERAL', '#059669');
    if (auditLabelTex) {
      const plaqueMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 0.75),
        new THREE.MeshBasicMaterial({ map: auditLabelTex, transparent: true })
      );
      plaqueMesh.position.set(0.6, -0.05, 1.05);
      plaqueMesh.rotation.x = -Math.PI / 10;
      inspectionTableGroup.add(plaqueMesh);
    }

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
        if (currentModeRef.current === 'vault') {
          vaultGroup.rotation.y = Math.max(-0.4, Math.min(0.4, vaultGroup.rotation.y + deltaX * 0.003));
        } else {
          vaultGroup.rotation.y += deltaX * 0.006;
        }
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

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousMousePosition.current.x;
        if (currentModeRef.current === 'skyline') {
          skylineGroup.rotation.y += deltaX * 0.007;
        } else if (currentModeRef.current === 'network') {
          networkGroup.rotation.y += deltaX * 0.007;
        } else if (currentModeRef.current === 'vault') {
          vaultGroup.rotation.y += deltaX * 0.005;
        }
        previousMousePosition.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      const isMobile = newWidth < 640;
      camera.fov = isMobile ? 46 : 38;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

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
    // ANIMATION LOOP (Traffic, Clouds, Dynamic Bank Pulses, Vault Sequence)
    // ─────────────────────────────────────────────────────────────
    let lastTime = performance.now();
    const startTime = performance.now();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      const elapsedTime = (currentTime - startTime) / 1000;
      lastTime = currentTime;

      // Dynamic camera vantage adapting smoothly to mode
      const isVault = currentModeRef.current === 'vault';
      const targetCamZ = isVault ? 19.5 : 23.0; // Reduced animation size: comfortably framed without cutoff
      const targetCamBaseY = isVault ? 5.8 : 10.5;
      const targetLookY = isVault ? 0.3 : 0.8;
      const targetLookZ = isVault ? -0.2 : 0.0;

      // Camera smooth damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const desiredCamX = mouseRef.current.x * (isVault ? 1.4 : 2.8);
      const desiredCamY = targetCamBaseY + mouseRef.current.y * (isVault ? 1.0 : 1.8);

      camera.position.x += (desiredCamX - camera.position.x) * 0.05;
      camera.position.y += (desiredCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      camera.lookAt(0, targetLookY, targetLookZ);

      // Auto rotation when not dragging
      if (autoRotate && !isDraggingRef.current) {
        skylineGroup.rotation.y += 0.0016;
        networkGroup.rotation.y += 0.0022;
        // vaultGroup does NOT spin 360 degrees, stays front-facing
      }

      // Drift Clouds across the vibrant blue sky
      if (cloudsGroup) {
        cloudsGroup.rotation.y += 0.0006;
      }

      // Aircraft red beacon pulse
      if (beaconLight) {
        const pulse = 0.5 + Math.sin(elapsedTime * 6.0) * 0.5;
        (beaconLight.material as THREE.MeshBasicMaterial).color.setRGB(1.0, 0.2 * pulse, 0.2 * pulse);
      }

      // ── MODE 1: Vehicles motion ──
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

      // ── MODE 2: Banking Ticker & Pulses ──
      if (networkGroup.visible) {
        if (bannerRingRef.current) {
          bannerRingRef.current.rotation.y += 0.005;
        }

        if (dataPacketsRef.current.length > 0) {
          dataPacketsRef.current.forEach((dp) => {
            dp.progress = (dp.progress + dp.speed * delta) % 1.0;
            dp.mesh.position.lerpVectors(dp.start, dp.end, dp.progress);
            const pScale = 0.8 + Math.sin(dp.progress * Math.PI) * 0.6;
            dp.mesh.scale.set(pScale, pScale, pScale);
          });
        }
      }

      // ── MODE 3: HIGH-SECURITY VAULT ANIMATION SEQUENCE ──
      if (vaultGroup.visible) {
        // Subtle organic breathing sway (stays front-facing, never turns to show back wall)
        if (!isDraggingRef.current) {
          vaultGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.035;
        }

        // 1. Vault Door Dynamic Breathing / Swing Cycle
        if (vaultDoorGroupRef.current) {
          const doorAngle = -Math.PI / 3.4 + Math.sin(elapsedTime * 0.8) * 0.08;
          vaultDoorGroupRef.current.rotation.y = doorAngle;
        }

        // 2. Combination Steering Wheel Rotation
        if (vaultWheelRef.current) {
          vaultWheelRef.current.rotation.z = Math.sin(elapsedTime * 1.5) * 1.8;
        }

        // 3. Radial Locking Bolts Sliding In and Out of Door Rim
        if (vaultBoltsRef.current.length > 0) {
          const boltSlide = (Math.sin(elapsedTime * 1.5) + 1.0) * 0.06;
          vaultBoltsRef.current.forEach((bolt, idx) => {
            const bAngle = (idx / 16) * Math.PI * 2;
            const radius = 2.38 + boltSlide;
            bolt.position.set(Math.cos(bAngle) * radius, Math.sin(bAngle) * radius, 0);
          });
        }

        // 4. Emerald Laser Beam Scanning Back and Forth across Legal Deeds
        if (vaultScannerBeamRef.current) {
          const scanZ = -0.15 + Math.sin(elapsedTime * 2.2) * 0.65;
          vaultScannerBeamRef.current.position.z = scanZ;

          if (scannerRef.current) {
            scannerRef.current.position.z = scanZ;
            const scanPulse = (Math.sin(elapsedTime * 2.2) + 1.0) * 0.5;
            (scannerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.18 + scanPulse * 0.15;
          }
        }

        // 5. Floating Holographic Security HUD Rotating
        if (vaultHoloRingRef.current) {
          vaultHoloRingRef.current.rotation.z += 0.015;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

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
      className="relative w-full h-full min-h-[340px] xs:min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-pan-y overflow-hidden"
    >
      {/* Clean Mode Tab Bar ONLY (Responsive & touch-friendly) */}
      <div className="absolute top-2.5 xs:top-3 sm:top-4 right-2.5 xs:right-3 sm:right-4 z-20 flex items-center pointer-events-auto max-w-[calc(100%-1.25rem)]">
        <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleModeSwitch('skyline')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10.5px] xs:text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeMode === 'skyline'
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
            title="City Property Skyline & Roads"
          >
            <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>Skyline</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('network')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10.5px] xs:text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeMode === 'network'
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
            title="40+ Bank Syndication Desks & Rates"
          >
            <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>Lender Grid</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('vault')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10.5px] xs:text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeMode === 'vault'
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
            title="High-Security Title Diligence Vault"
          >
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
};