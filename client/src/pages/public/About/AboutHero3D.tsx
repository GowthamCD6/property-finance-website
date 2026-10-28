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
  const vehiclesRef = useRef<VehicleData[]>([]);

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

    // 1. Scene setup with clean daylight atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf3f7fb);
    scene.fog = new THREE.FogExp2(0xf3f7fb, 0.02);

    // 2. Camera setup with isometric vantage
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

    // 4. Natural Daylight Lighting
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xf1f5f9, 1.8);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.8);
    sunLight.position.set(16, 28, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.1);
    fillLight.position.set(-18, 15, -12);
    scene.add(fillLight);

    // ─────────────────────────────────────────────────────────────
    // GROUND & ROADWAY NETWORK
    // ─────────────────────────────────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Clean light urban plaza base
      roughness: 0.6,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Realistic Procedural Window Textures
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

    // ─────────────────────────────────────────────────────────────
    // MODE 1: REALISTIC ARCHITECTURAL SKYLINE WITH ROADS & CARS
    // ─────────────────────────────────────────────────────────────
    const skylineGroup = skylineGroupRef.current;
    skylineGroup.clear();

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x27303f, // Realistic dark asphalt road surface
      roughness: 0.85,
      metalness: 0.1,
    });

    const roadMarkingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const yellowMarkingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
    });

    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0xdde4ec, // Concrete sidewalk paving
      roughness: 0.5,
      metalness: 0.1,
    });

    // Helper to create straight asphalt road segment
    const createRoad = (w: number, l: number, x: number, z: number, isVertical: boolean) => {
      const road = new THREE.Mesh(new THREE.PlaneGeometry(w, l), roadMat);
      road.rotation.x = -Math.PI / 2;
      if (!isVertical) road.rotation.z = Math.PI / 2;
      road.position.set(x, -1.97, z);
      road.receiveShadow = true;
      skylineGroup.add(road);

      // Dashed lane divider lines
      const dashCount = Math.floor(l / 1.6);
      const dashGeo = new THREE.PlaneGeometry(0.12, 0.7);
      for (let i = 0; i < dashCount; i++) {
        const dash = new THREE.Mesh(dashGeo, roadMarkingMat);
        dash.rotation.x = -Math.PI / 2;
        if (!isVertical) {
          dash.rotation.z = Math.PI / 2;
          dash.position.set(x - l / 2 + (i + 0.5) * 1.6, -1.96, z);
        } else {
          dash.position.set(x, -1.96, z - l / 2 + (i + 0.5) * 1.6);
        }
        skylineGroup.add(dash);
      }
    };

    // 1. Construct Road Grid
    // North Road (Horizontal)
    createRoad(2.4, 18, 0, -7.0, false);
    // South Road (Horizontal)
    createRoad(2.4, 18, 0, 7.0, false);
    // West Road (Vertical)
    createRoad(2.4, 16.4, -8.0, 0, true);
    // East Road (Vertical)
    createRoad(2.4, 16.4, 8.0, 0, true);
    // Central Connecting Avenue (Vertical)
    createRoad(2.0, 16.4, 0, 0, true);

    // Pedestrian Zebra Crossings at Intersections
    const createZebraCrossing = (x: number, z: number, isVertical: boolean) => {
      const barCount = 5;
      for (let i = 0; i < barCount; i++) {
        const bar = new THREE.Mesh(
          new THREE.PlaneGeometry(0.25, 1.4),
          roadMarkingMat
        );
        bar.rotation.x = -Math.PI / 2;
        if (isVertical) {
          bar.position.set(x - 0.7 + i * 0.35, -1.95, z);
        } else {
          bar.rotation.z = Math.PI / 2;
          bar.position.set(x, -1.95, z - 0.7 + i * 0.35);
        }
        skylineGroup.add(bar);
      }
    };

    createZebraCrossing(0, -5.6, true);
    createZebraCrossing(0, 5.6, true);
    createZebraCrossing(-6.6, 0, false);
    createZebraCrossing(6.6, 0, false);

    // Raised Sidewalks around City Blocks
    const createSidewalkBlock = (w: number, d: number, x: number, z: number) => {
      const sw = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, d), sidewalkMat);
      sw.position.set(x, -1.94, z);
      sw.receiveShadow = true;
      skylineGroup.add(sw);
    };

    // Left city block sidewalk
    createSidewalkBlock(6.2, 11.8, -4.0, 0);
    // Right city block sidewalk
    createSidewalkBlock(6.2, 11.8, 4.0, 0);

    // 2. Realistic Skyscrapers
    const whiteGraniteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.1,
    });
    const brushedChampagneMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.75,
    });
    const glassTowerMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.15,
      transmission: 0.45,
      transparent: true,
      opacity: 0.92,
      reflectivity: 0.9,
      clearcoat: 1.0,
    });

    // Centerpiece Prime Headquarters Tower (West Block Center)
    const centerTowerGroup = new THREE.Group();
    const podiumMesh = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 3.2), whiteGraniteMat);
    podiumMesh.position.y = -1.4;
    podiumMesh.castShadow = true;
    centerTowerGroup.add(podiumMesh);

    const centerShaft = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 8.2, 2.6),
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        map: windowTexTeal || undefined,
        roughness: 0.15,
        metalness: 0.3,
      })
    );
    centerShaft.position.y = 3.3;
    centerShaft.castShadow = true;
    centerTowerGroup.add(centerShaft);

    // Pilasters & Crown
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

    // Additional Architectural Buildings around the roads
    const buildings = [
      { x: 3.8, z: -1.8, w: 2.6, h: 7.8, d: 2.4, map: windowTexAzure, color: 0x0369a1 },
      { x: -3.8, z: 3.2, w: 2.2, h: 5.6, d: 2.2, map: windowTexBlue, color: 0x1d4ed8 },
      { x: 3.8, z: 3.2, w: 2.4, h: 5.8, d: 2.2, map: windowTexTeal, color: 0x0f766e },
    ];

    buildings.forEach((b) => {
      const bGroup = new THREE.Group();
      const bPodium = new THREE.Mesh(new THREE.BoxGeometry(b.w * 1.12, 0.8, b.d * 1.12), whiteGraniteMat);
      bPodium.position.y = -1.6;
      bPodium.castShadow = true;
      bGroup.add(bPodium);

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

    // Street Trees along Sidewalks
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

    // ─────────────────────────────────────────────────────────────
    // 3. MOVING VEHICLES SYSTEM (Active Street Traffic)
    // ─────────────────────────────────────────────────────────────
    const createVehicleMesh = (carType: 'sedan' | 'suv' | 'taxi' | 'van', bodyColor: number) => {
      const car = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: 0.2,
        metalness: 0.6,
      });

      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.1,
        metalness: 0.9,
      });

      const wheelMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.9,
      });

      const hubcapMat = new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        metalness: 0.9,
      });

      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

      // Lower chassis
      const length = carType === 'van' ? 1.4 : carType === 'suv' ? 1.3 : 1.15;
      const width = carType === 'suv' ? 0.62 : 0.55;
      const height = carType === 'suv' ? 0.28 : 0.22;

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), bodyMat);
      chassis.position.y = height / 2 + 0.08;
      chassis.castShadow = true;
      car.add(chassis);

      // Cabin / Greenhouse
      const cabinH = carType === 'van' ? 0.38 : carType === 'suv' ? 0.26 : 0.2;
      const cabinL = carType === 'van' ? 0.95 : carType === 'suv' ? 0.75 : 0.65;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(width * 0.88, cabinH, cabinL), glassMat);
      cabin.position.set(0, height + cabinH / 2 + 0.08, carType === 'van' ? 0.05 : -0.05);
      car.add(cabin);

      // Roof color cap
      const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 0.86, 0.04, cabinL * 0.95), bodyMat);
      roof.position.set(0, height + cabinH + 0.09, carType === 'van' ? 0.05 : -0.05);
      car.add(roof);

      // Taxi roof light
      if (carType === 'taxi') {
        const taxiSign = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.1), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        taxiSign.position.set(0, height + cabinH + 0.14, -0.05);
        car.add(taxiSign);
      }

      // Headlights (Front is positive Z)
      const hlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), headlightMat);
      hlLeft.position.set(-width / 2 + 0.08, height / 2 + 0.08, length / 2 + 0.02);
      car.add(hlLeft);

      const hlRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), headlightMat);
      hlRight.position.set(width / 2 - 0.08, height / 2 + 0.08, length / 2 + 0.02);
      car.add(hlRight);

      // Taillights (Rear is negative Z)
      const tlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), taillightMat);
      tlLeft.position.set(-width / 2 + 0.08, height / 2 + 0.08, -length / 2 - 0.02);
      car.add(tlLeft);

      const tlRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), taillightMat);
      tlRight.position.set(width / 2 - 0.08, height / 2 + 0.08, -length / 2 - 0.02);
      car.add(tlRight);

      // Wheels
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

    // Fleet of active vehicles on the road
    const vehicleConfigs: {
      type: 'sedan' | 'suv' | 'taxi' | 'van';
      color: number;
      path: 'outerClockwise' | 'outerCounter' | 'avenueCross';
      startProgress: number;
      speed: number;
    }[] = [
      { type: 'sedan', color: 0xffffff, path: 'outerClockwise', startProgress: 0.05, speed: 0.038 }, // White luxury sedan
      { type: 'suv', color: 0x0f172a, path: 'outerClockwise', startProgress: 0.38, speed: 0.035 },   // Obsidian black SUV
      { type: 'taxi', color: 0xeab308, path: 'outerClockwise', startProgress: 0.72, speed: 0.042 },  // Yellow city cab
      { type: 'sedan', color: 0x1d4ed8, path: 'outerCounter', startProgress: 0.15, speed: 0.036 },  // Royal blue sedan
      { type: 'sedan', color: 0xdc2626, path: 'outerCounter', startProgress: 0.65, speed: 0.044 },  // Crimson red car
      { type: 'van', color: 0x94a3b8, path: 'avenueCross', startProgress: 0.0, speed: 0.032 },      // Silver courier van
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
    // MODE 2: LENDER GRID
    // ─────────────────────────────────────────────────────────────
    const networkGroup = networkGroupRef.current;
    networkGroup.clear();
    networkGroup.visible = false;

    const goldHubMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });
    const platinumPartnerMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });

    const primeDeskMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 2), goldHubMat);
    primeDeskMesh.position.set(0, 1.4, 0);
    networkGroup.add(primeDeskMesh);

    const partnerNodeCount = 36;
    for (let i = 0; i < partnerNodeCount; i++) {
      const radius = 2.6 + Math.random() * 4.8;
      const angle = (i / partnerNodeCount) * Math.PI * 2;
      const heightOffset = -0.8 + Math.random() * 4.2;
      const pos = new THREE.Vector3(Math.cos(angle) * radius, heightOffset, Math.sin(angle) * radius);

      const isTier1 = i % 4 === 0;
      const pMesh = new THREE.Mesh(new THREE.SphereGeometry(isTier1 ? 0.32 : 0.2, 16, 16), isTier1 ? goldHubMat : platinumPartnerMat);
      pMesh.position.copy(pos);
      networkGroup.add(pMesh);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([primeDeskMesh.position, pos]);
      const lineMat = new THREE.LineBasicMaterial({ color: isTier1 ? 0xf59e0b : 0x0284c7, transparent: true, opacity: isTier1 ? 0.75 : 0.4 });
      networkGroup.add(new THREE.Line(lineGeo, lineMat));
    }
    scene.add(networkGroup);

    // ─────────────────────────────────────────────────────────────
    // MODE 3: COLLATERAL VAULT
    // ─────────────────────────────────────────────────────────────
    const vaultGroup = vaultGroupRef.current;
    vaultGroup.clear();
    vaultGroup.visible = false;

    const cageGeo = new THREE.IcosahedronGeometry(3.2, 0);
    const cageMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2, wireframe: true });
    vaultGroup.add(new THREE.Mesh(cageGeo, cageMat));

    const vaultCore = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0, 0), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.92, roughness: 0.12 }));
    vaultGroup.add(vaultCore);

    const emeraldCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.9 }));
    vaultGroup.add(emeraldCore);

    const ring1 = new THREE.Line(new THREE.RingGeometry(3.8, 3.84, 64), new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.6 }));
    ring1.rotation.x = Math.PI / 3;
    vaultGroup.add(ring1);

    const ring2 = new THREE.Line(new THREE.RingGeometry(4.3, 4.34, 64), new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.55 }));
    ring2.rotation.y = Math.PI / 4;
    vaultGroup.add(ring2);

    vaultGroup.position.set(0, 1.4, 0);
    scene.add(vaultGroup);

    // ─────────────────────────────────────────────────────────────
    // EVENT LISTENERS & DRAG CONTROLS
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
      // Rounded rectangular loop around the city block
      // Lane offset: +0.6 for outer lane, -0.6 for inner lane
      const minX = -7.4 + laneOffset;
      const maxX = 7.4 - laneOffset;
      const minZ = -6.4 + laneOffset;
      const maxZ = 6.4 - laneOffset;

      const segW = maxX - minX;
      const segH = maxZ - minZ;
      const perimeter = (segW + segH) * 2;

      let dist = (t % 1.0) * perimeter;
      if (dist < 0) dist += perimeter;

      // Segment 1: Bottom (South road, moving West to East)
      if (dist <= segW) {
        return new THREE.Vector3(minX + dist, -1.97, maxZ);
      }
      dist -= segW;

      // Segment 2: Right (East road, moving South to North)
      if (dist <= segH) {
        return new THREE.Vector3(maxX, -1.97, maxZ - dist);
      }
      dist -= segH;

      // Segment 3: Top (North road, moving East to West)
      if (dist <= segW) {
        return new THREE.Vector3(maxX - dist, -1.97, minZ);
      }
      dist -= segW;

      // Segment 4: Left (West road, moving North to South)
      return new THREE.Vector3(minX, -1.97, minZ + dist);
    };

    const sampleAvenueCross = (t: number) => {
      // Moves back and forth along the central avenue between skyscrapers
      const normalized = (t % 1.0);
      const isGoingSouth = normalized < 0.5;
      const subT = isGoingSouth ? normalized * 2 : (normalized - 0.5) * 2;
      const startZ = isGoingSouth ? -6.8 : 6.8;
      const endZ = isGoingSouth ? 6.8 : -6.8;
      const laneX = isGoingSouth ? 0.45 : -0.45;
      return new THREE.Vector3(laneX, -1.97, startZ + (endZ - startZ) * subT);
    };

    // ─────────────────────────────────────────────────────────────
    // ANIMATION LOOP (Traffic motion, camera lerp, lighting pulse)
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

      // Auto rotation
      if (autoRotate && !isDraggingRef.current) {
        skylineGroup.rotation.y += 0.0016;
        networkGroup.rotation.y += 0.0025;
        vaultGroup.rotation.y += 0.004;
      }

      // Aircraft red beacon pulse
      if (beaconLight) {
        const pulse = 0.5 + Math.sin(elapsedTime * 6.0) * 0.5;
        (beaconLight.material as THREE.MeshBasicMaterial).color.setRGB(1.0, 0.2 * pulse, 0.2 * pulse);
      }

      // Update Moving Vehicles on Roads!
      if (skylineGroup.visible && activeVehicles.length > 0) {
        activeVehicles.forEach((v) => {
          v.progress = (v.progress + v.speed * delta) % 1.0;

          let posNow: THREE.Vector3;
          let posNext: THREE.Vector3;

          if (v.pathType === 'outerClockwise') {
            posNow = sampleOuterLoop(v.progress, 0.55);
            posNext = sampleOuterLoop(v.progress + 0.005, 0.55);
          } else if (v.pathType === 'outerCounter') {
            // Opposite lane moving reverse
            posNow = sampleOuterLoop(1.0 - v.progress, -0.55);
            posNext = sampleOuterLoop(1.0 - (v.progress + 0.005), -0.55);
          } else {
            posNow = sampleAvenueCross(v.progress);
            posNext = sampleAvenueCross(v.progress + 0.005);
          }

          v.mesh.position.copy(posNow);

          // Steer towards target position
          const dx = posNext.x - posNow.x;
          const dz = posNext.z - posNow.z;
          v.mesh.rotation.y = Math.atan2(dx, dz);

          // Rotate wheels
          v.wheels.forEach((w) => {
            w.rotation.x += v.speed * 25.0;
          });
        });
      }

      // Vault rotation
      if (vaultGroup.visible) {
        ring1.rotation.z += 0.008;
        ring2.rotation.z -= 0.006;
        emeraldCore.rotation.y += 0.015;
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
      {/* Tab Bar ONLY (All other overlay boxes removed per user request) */}
      <div className="absolute top-4 right-4 z-20 flex items-center pointer-events-auto">
        <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md">
          <button
            type="button"
            onClick={() => handleModeSwitch('skyline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'skyline'
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
            title="Architectural Portfolio Matrix"
          >
            <Building className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Skyline</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('network')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'network'
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
            title="40+ Bank Syndicate Grid"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lender Grid</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('vault')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'vault'
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
            title="Secured Collateral Diligence Vault"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Collateral Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
