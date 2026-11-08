import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 3-segment industrial robotic arm dimensions
const L1 = 1.24; // Shoulder axis to Elbow axis
const L2 = 1.06; // Elbow axis to Wrist axis
const L_CLAW = 0.325; // Wrist axis to exact Claw Finger Pocket Center
const MAX_WRIST_REACH = L1 + L2 - 0.04;
const MIN_WRIST_REACH = 0.32;

// Seated Pedestal Base coordinates at the bottom of the Hero section
const BASE_X = 0.28;
const BASE_Y = -1.25;
const SHOULDER_OFFSET_Y = 0.56;
const Z_PLANE = 0.32;

// Physics constants for the interactive squishy block
const FLOOR_Y = BASE_Y;
const BLOCK_HALF = 0.082; // 0.164m cube that fits cleanly inside the bright white claw pocket
const BLOCK_ORIGIN_X = -0.85;
const BLOCK_ORIGIN_Y = FLOOR_Y + BLOCK_HALF;
const GRAVITY = -9.2;

// Precompute 4x4x4 (64) voxel coordinates for the Pixelation Disappearance & Appearance animation
const VOXEL_GRID_DIM = 4;
const VOXEL_STEP = (BLOCK_HALF * 2) / VOXEL_GRID_DIM;
const VOXEL_SIZE = VOXEL_STEP * 0.92;
const PIXEL_VOXELS = [];
for (let ix = 0; ix < VOXEL_GRID_DIM; ix++) {
  for (let iy = 0; iy < VOXEL_GRID_DIM; iy++) {
    for (let iz = 0; iz < VOXEL_GRID_DIM; iz++) {
      const cx = (ix - (VOXEL_GRID_DIM - 1) / 2) * VOXEL_STEP;
      const cy = (iy - (VOXEL_GRID_DIM - 1) / 2) * VOXEL_STEP;
      const cz = (iz - (VOXEL_GRID_DIM - 1) / 2) * VOXEL_STEP;
      const hash =
        Math.sin((ix + 1) * 12.9898 + (iy + 1) * 78.233 + (iz + 1) * 37.719) *
        43758.5453;
      const rand = hash - Math.floor(hash);
      const isDarkAccent = (ix + iy + iz) % 3 === 0;
      PIXEL_VOXELS.push({
        baseX: cx,
        baseY: cy,
        baseZ: cz,
        jitterX: (rand - 0.5) * 0.26 + Math.sign(cx) * 0.08,
        jitterY: ((rand * 7) % 1 - 0.35) * 0.28 + Math.sign(cy) * 0.08,
        jitterZ: ((rand * 13) % 1 - 0.5) * 0.22,
        threshold: 0.08 + rand * 0.84,
        isDarkAccent,
      });
    }
  }
}

/**
 * Clean Non-Overlapping 3D Industrial Robotic Arm + Squishy Physics Block + Physical Red Reset Button
 * - High-contrast Ceramic White & Brushed Silver Claw (no dark/black interior)
 * - Claw physically reacts to & slides along the Base Pedestal without clipping
 * - Block aligns with the claw's 3D plane when gripped and collides solidly when free (zero clipping)
 * - Holding/touching the Red Button when the block is already in its default position does nothing
 */
function IndustrialArmAndBlock({
  mouseScreenRef,
  isMouseDownRef,
  gripToggleRef,
  resetBlockTriggerRef,
  scrollOpenRef,
  telemetryCallbackRef,
}) {
  const { viewport } = useThree();

  const pedestalRootRef = useRef();
  const waistTurretRef = useRef();
  const shoulderPivotRef = useRef();
  const elbowPivotRef = useRef();
  const wristPivotRef = useRef();
  const wristRollRef = useRef();
  const leftFingerRef = useRef();
  const rightFingerRef = useRef();

  // Interactive Squishy Block & Pixelation Voxel Grid refs
  const blockGroupRef = useRef();
  const blockInnerTiltRef = useRef();
  const blockMeshRef = useRef();
  const pixelGridGroupRef = useRef();
  const voxelMeshRefs = useRef([]);
  const blockShadowRef = useRef();

  // Physical Red Reset Button refs (underneath the right-side info box)
  const redButtonGroupRef = useRef();
  const redButtonPlungerRef = useRef();
  const redButtonGlowRingRef = useRef();

  const stateRef = useRef({
    tipX: -0.65,
    tipY: -0.25,
    prevTipX: -0.65,
    prevTipY: -0.25,
    turretAngle: Math.PI * 0.85,
    theta1: 1.35,
    theta2: -1.1,
    wristAngle: -1.1,
    jawSpread: 0.108,
    // Squishy block physics state
    blockX: BLOCK_ORIGIN_X,
    blockY: BLOCK_ORIGIN_Y,
    blockVx: 0,
    blockVy: 0,
    blockRotY: 0,
    blockRotZ: 0,
    blockAngularVel: 0,
    isGrippingBlock: false,
    supportSurfaceY: FLOOR_Y,
    squishX: 1,
    squishY: 1,
    squishZ: 1,
    // Red reset button state & Pixelation animation state
    buttonX: 1.48,
    buttonPress: 0,
    buttonCooldown: 0,
    resetAnimActive: false,
    resetAnimTimer: 0,
    resetDisappearX: BLOCK_ORIGIN_X,
    resetDisappearY: BLOCK_ORIGIN_Y,
  });

  const materials = useMemo(() => {
    return {
      ceramicWhite: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f4f4f6'),
        metalness: 0.18,
        roughness: 0.26,
      }),
      clawBrightInterior: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e4e4ec'),
        metalness: 0.25,
        roughness: 0.28,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.08,
      }),
      industrialGray: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4d4dc'),
        metalness: 0.38,
        roughness: 0.32,
      }),
      midSilver: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#a1a1aa'),
        metalness: 0.55,
        roughness: 0.26,
      }),
      darkJointDrum: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#18181c'),
        metalness: 0.65,
        roughness: 0.36,
      }),
      basePlinth: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#202027'),
        metalness: 0.72,
        roughness: 0.32,
      }),
      ledWhite: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ffffff'),
      }),
      squishBlockBody: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e4e4e7'),
        metalness: 0.15,
        roughness: 0.48,
      }),
      squishBlockCore: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#27272a'),
        metalness: 0.45,
        roughness: 0.35,
      }),
      redButtonHousing: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#18181c'),
        metalness: 0.65,
        roughness: 0.35,
      }),
      redButtonCap: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ef4444'),
        emissive: new THREE.Color('#dc2626'),
        emissiveIntensity: 0.42,
        metalness: 0.2,
        roughness: 0.28,
      }),
      redButtonCapActive: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ff5555'),
        emissive: new THREE.Color('#ef4444'),
        emissiveIntensity: 1.15,
        metalness: 0.15,
        roughness: 0.2,
      }),
    };
  }, []);

  // Check if the block is already resting at its default origin position
  const isBlockAtOrigin = (s) => {
    return (
      !s.isGrippingBlock &&
      Math.hypot(s.blockX - BLOCK_ORIGIN_X, s.blockY - BLOCK_ORIGIN_Y) < 0.04 &&
      Math.abs(s.blockVx) < 0.05 &&
      Math.abs(s.blockVy) < 0.05
    );
  };

  // Helper to start the Pixelation Disappearance & Appearance reset sequence
  const startPixelResetSequence = (s) => {
    // Requirement 2: If the box is already at default position, do nothing!
    if (s.resetAnimActive || isBlockAtOrigin(s)) return;
    s.resetAnimActive = true;
    s.resetAnimTimer = 0;
    s.resetDisappearX = s.blockX;
    s.resetDisappearY = s.blockY;
    s.isGrippingBlock = false;
    gripToggleRef.current = false;
    s.blockVx = 0;
    s.blockVy = 0;
    s.blockAngularVel = 0;
    s.buttonPress = 1;
    s.buttonCooldown = 1.05;
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.04);
    const s = stateRef.current;
    const openProgress = THREE.MathUtils.clamp(scrollOpenRef.current || 0, 0, 1);

    if (s.buttonCooldown > 0) {
      s.buttonCooldown = Math.max(0, s.buttonCooldown - dt);
    }

    // 1. Convert screen mouse to world coordinates on the working plane Z_PLANE
    const camZ = state.camera.position.z || 4.6;
    const depthScale = (camZ - Z_PLANE) / camZ;
    const halfW = (viewport.width / 2) * depthScale;
    const halfH = (viewport.height / 2) * depthScale;

    // Align the 3D Red Reset Button right underneath the bottom-right of the info box
    if (typeof document !== 'undefined') {
      const anchorEl = document.querySelector('[data-info-panel-anchor="true"]');
      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        if (rect.width > 0) {
          const boxRightWorld = ((rect.right / window.innerWidth) * 2 - 1) * halfW;
          s.buttonX = THREE.MathUtils.clamp(boxRightWorld - 0.2, 0.98, 1.95);
        }
      }
    }

    // Handle external reset trigger if invoked
    if (resetBlockTriggerRef?.current) {
      resetBlockTriggerRef.current = false;
      startPixelResetSequence(s);
    }

    const nx = (mouseScreenRef.current.x / window.innerWidth) * 2 - 1;
    const ny = -(mouseScreenRef.current.y / window.innerHeight) * 2 + 1;

    let cursorWorldX = nx * halfW;
    let cursorWorldY = ny * halfH;

    const shoulderX = BASE_X;
    const shoulderY = BASE_Y + SHOULDER_OFFSET_Y;

    cursorWorldX = THREE.MathUtils.clamp(cursorWorldX, -2.15, 2.25);
    cursorWorldY = THREE.MathUtils.clamp(cursorWorldY, FLOOR_Y + 0.1, 1.48);

    // Physical Claw-to-Base Pedestal Collision & Interaction
    // Prevents the claw from clipping into the base cabinet or turret collar
    const pedCabinetHalfW = 0.64;
    const pedCabinetTopY = FLOOR_Y + 0.34;
    const pedTurretHalfW = 0.38;
    const pedTurretTopY = FLOOR_Y + 0.44;
    let isTouchingBasePedestal = false;

    if (
      Math.abs(cursorWorldX - BASE_X) < pedTurretHalfW &&
      cursorWorldY < pedTurretTopY
    ) {
      cursorWorldY = pedTurretTopY;
      isTouchingBasePedestal = true;
    } else if (
      Math.abs(cursorWorldX - BASE_X) < pedCabinetHalfW &&
      cursorWorldY < pedCabinetTopY
    ) {
      if (Math.abs(s.tipY - pedCabinetTopY) < 0.18 || s.tipY >= pedCabinetTopY - 0.05) {
        cursorWorldY = pedCabinetTopY;
      } else {
        cursorWorldX =
          cursorWorldX < BASE_X
            ? BASE_X - pedCabinetHalfW
            : BASE_X + pedCabinetHalfW;
      }
      isTouchingBasePedestal = true;
    }

    // Also prevent the open claw from clipping down through the top of the free block on the floor
    const wantClose = isMouseDownRef.current || gripToggleRef.current;
    if (!s.isGrippingBlock && !s.resetAnimActive && !wantClose) {
      const horizDistToBlock = Math.abs(cursorWorldX - s.blockX);
      if (
        horizDistToBlock < BLOCK_HALF + 0.08 &&
        cursorWorldY < s.blockY + BLOCK_HALF + 0.07 &&
        s.tipY >= s.blockY
      ) {
        cursorWorldY = s.blockY + BLOCK_HALF + 0.07;
      }
    }

    s.prevTipX = s.tipX;
    s.prevTipY = s.tipY;
    s.tipX = THREE.MathUtils.damp(s.tipX, cursorWorldX, 18, dt);
    s.tipY = THREE.MathUtils.damp(s.tipY, cursorWorldY, 18, dt);

    const tipVelX = (s.tipX - s.prevTipX) / Math.max(dt, 0.001);
    const tipVelY = (s.tipY - s.prevTipY) / Math.max(dt, 0.001);

    // 2. Smooth 3D Base Turret Rotation (Joint 1)
    const dx = s.tipX - shoulderX;
    const dy = s.tipY - shoulderY;

    const targetTurretAngle = Math.atan2(Z_PLANE, dx);
    s.turretAngle = THREE.MathUtils.damp(s.turretAngle, targetTurretAngle, 14, dt);

    const radialTipDist = Math.sqrt(dx * dx + Z_PLANE * Z_PLANE);
    const localTipR = radialTipDist;
    const localTipY = dy;

    // 3. Claw Orientation Pitch Angle (Joint 4)
    const heightFactor = THREE.MathUtils.clamp((s.tipY - (FLOOR_Y + 0.25)) / 1.35, 0, 1);
    const downwardPitch = -Math.PI * 0.49;
    const highPitch = s.isGrippingBlock
      ? -Math.PI * 0.46
      : THREE.MathUtils.clamp(Math.atan2(localTipY, localTipR) * 0.5, -0.4, 0.35);
    const desiredClawPitch = THREE.MathUtils.lerp(downwardPitch, highPitch, heightFactor);

    // 4. Back-calculate the Wrist Joint position from the Claw Pocket Center
    let wristR = localTipR - L_CLAW * Math.cos(desiredClawPitch);
    let wristY = localTipY - L_CLAW * Math.sin(desiredClawPitch);

    const rawWristDist = Math.sqrt(wristR * wristR + wristY * wristY);
    const clampedWristDist = THREE.MathUtils.clamp(
      rawWristDist,
      MIN_WRIST_REACH,
      MAX_WRIST_REACH
    );
    if (rawWristDist > 0.0001 && rawWristDist !== clampedWristDist) {
      const scale = clampedWristDist / rawWristDist;
      wristR *= scale;
      wristY *= scale;
    }

    // 5. 2-Link Analytical Inverse Kinematics in the Turret's (r, y) Plane
    const wristAngleBase = Math.atan2(wristY, wristR);

    const cosBeta = THREE.MathUtils.clamp(
      (L1 * L1 + clampedWristDist * clampedWristDist - L2 * L2) /
        (2 * L1 * clampedWristDist),
      -1,
      1
    );
    const beta = Math.acos(cosBeta);

    const cosPhi = THREE.MathUtils.clamp(
      (L1 * L1 + L2 * L2 - clampedWristDist * clampedWristDist) / (2 * L1 * L2),
      -1,
      1
    );
    const phi = THREE.MathUtils.clamp(Math.acos(cosPhi), 0.26, 2.9);

    const ikTheta1 = THREE.MathUtils.clamp(wristAngleBase + beta, 0.06, Math.PI - 0.06);
    const ikTheta2 = -(Math.PI - phi);
    const ikWristAngle = desiredClawPitch - (ikTheta1 + ikTheta2);

    s.theta1 = THREE.MathUtils.damp(s.theta1, ikTheta1, 20, dt);
    s.theta2 = THREE.MathUtils.damp(s.theta2, ikTheta2, 20, dt);
    s.wristAngle = THREE.MathUtils.damp(s.wristAngle, ikWristAngle, 20, dt);

    const fkWristR =
      L1 * Math.cos(s.theta1) + L2 * Math.cos(s.theta1 + s.theta2);
    const fkWristY =
      L1 * Math.sin(s.theta1) + L2 * Math.sin(s.theta1 + s.theta2);
    const fkTotalAngle = s.theta1 + s.theta2 + s.wristAngle;
    const fkTipR = fkWristR + L_CLAW * Math.cos(fkTotalAngle);
    const fkTipY = fkWristY + L_CLAW * Math.sin(fkTotalAngle);

    const actualTipWorldX = shoulderX + fkTipR * Math.cos(s.turretAngle);
    const actualTipWorldY = shoulderY + fkTipY;
    const actualTipWorldZ = fkTipR * Math.sin(s.turretAngle);

    // 6. Check Red Reset Button Contact
    // Requirement 2: If the block is already in its default position, holding/touching the button does nothing!
    const buttonHalfW = 0.17;
    const buttonTopY = FLOOR_Y + 0.11;

    const clawTouchesButton =
      Math.abs(actualTipWorldX - s.buttonX) < buttonHalfW + 0.09 &&
      actualTipWorldY <= buttonTopY + 0.11;

    const blockTouchesButton =
      !s.resetAnimActive &&
      Math.abs(s.blockX - s.buttonX) < buttonHalfW + BLOCK_HALF * 0.85 &&
      s.blockY - BLOCK_HALF <= buttonTopY + 0.04;

    const alreadyAtDefault = isBlockAtOrigin(s);

    if (
      (clawTouchesButton || blockTouchesButton) &&
      !alreadyAtDefault &&
      s.buttonCooldown <= 0 &&
      !s.resetAnimActive
    ) {
      startPixelResetSequence(s);
    }

    // Only depress and light up the button if the block is not already at default (or during active reset)
    const targetButtonPress =
      (!alreadyAtDefault && (clawTouchesButton || blockTouchesButton)) ||
      s.resetAnimActive
        ? 1
        : 0;
    s.buttonPress = THREE.MathUtils.damp(s.buttonPress, targetButtonPress, 22, dt);

    if (redButtonGroupRef.current) {
      redButtonGroupRef.current.position.set(s.buttonX, FLOOR_Y, Z_PLANE);
    }
    if (redButtonPlungerRef.current) {
      redButtonPlungerRef.current.position.y = 0.068 - s.buttonPress * 0.026;
      redButtonPlungerRef.current.material =
        s.buttonPress > 0.35 ? materials.redButtonCapActive : materials.redButtonCap;
    }
    if (redButtonGlowRingRef.current) {
      const pulseScale = 1 + s.buttonPress * 0.18;
      redButtonGlowRingRef.current.scale.set(pulseScale, 1, pulseScale);
    }

    // 7. Interactive Squishy Block Physics OR Pixelation Reset Animation
    const distToBlock = Math.hypot(
      actualTipWorldX - s.blockX,
      actualTipWorldY - s.blockY
    );

    if (s.resetAnimActive) {
      // Two-Phase Pixelation Disappearance (0.0 -> 0.44s) & Appearance (0.44 -> 0.88s)
      const TOTAL_RESET_DUR = 0.88;
      const HALF_DUR = TOTAL_RESET_DUR * 0.5;
      s.resetAnimTimer += dt;

      if (s.resetAnimTimer < HALF_DUR) {
        const p = THREE.MathUtils.clamp(s.resetAnimTimer / HALF_DUR, 0, 1);
        const qp = Math.floor(p * 6) / 6;
        s.blockX = s.resetDisappearX;
        s.blockY = s.resetDisappearY;
        s.blockRotY = 0;
        s.blockRotZ = 0;

        if (blockMeshRef.current) blockMeshRef.current.visible = false;
        if (pixelGridGroupRef.current) {
          pixelGridGroupRef.current.visible = true;
          for (let i = 0; i < PIXEL_VOXELS.length; i++) {
            const v = PIXEL_VOXELS[i];
            const mesh = voxelMeshRefs.current[i];
            if (!mesh) continue;
            if (qp >= v.threshold) {
              mesh.visible = false;
            } else {
              mesh.visible = true;
              const localProgress = THREE.MathUtils.clamp(qp / v.threshold, 0, 1);
              const quantScale = Math.max(0.2, Math.ceil((1 - localProgress) * 4) / 4);
              const stepOffset = Math.floor(localProgress * 4) / 4;
              mesh.position.set(
                v.baseX + v.jitterX * stepOffset,
                v.baseY + v.jitterY * stepOffset,
                v.baseZ + v.jitterZ * stepOffset
              );
              mesh.scale.setScalar(quantScale);
            }
          }
        }
      } else if (s.resetAnimTimer < TOTAL_RESET_DUR) {
        const p = THREE.MathUtils.clamp(
          (s.resetAnimTimer - HALF_DUR) / HALF_DUR,
          0,
          1
        );
        const qp = Math.floor(p * 6) / 6;
        s.blockX = BLOCK_ORIGIN_X;
        s.blockY = BLOCK_ORIGIN_Y;
        s.blockRotY = 0;
        s.blockRotZ = 0;
        s.squishX = 1;
        s.squishY = 1;
        s.squishZ = 1;

        if (blockMeshRef.current) blockMeshRef.current.visible = false;
        if (pixelGridGroupRef.current) {
          pixelGridGroupRef.current.visible = true;
          for (let i = 0; i < PIXEL_VOXELS.length; i++) {
            const v = PIXEL_VOXELS[i];
            const mesh = voxelMeshRefs.current[i];
            if (!mesh) continue;
            const appearThreshold = 1 - v.threshold;
            if (qp < appearThreshold) {
              mesh.visible = false;
            } else {
              mesh.visible = true;
              const localProgress = THREE.MathUtils.clamp(
                (qp - appearThreshold) / Math.max(0.001, 1 - appearThreshold),
                0,
                1
              );
              const quantScale = Math.max(0.25, Math.ceil(localProgress * 4) / 4);
              const stepOffset = Math.floor((1 - localProgress) * 4) / 4;
              mesh.position.set(
                v.baseX + v.jitterX * stepOffset,
                v.baseY + v.jitterY * stepOffset,
                v.baseZ + v.jitterZ * stepOffset
              );
              mesh.scale.setScalar(quantScale);
            }
          }
        }
      } else {
        s.resetAnimActive = false;
        s.blockX = BLOCK_ORIGIN_X;
        s.blockY = BLOCK_ORIGIN_Y;
        s.blockVx = 0;
        s.blockVy = 0;
        s.blockRotY = 0;
        s.blockRotZ = 0;
        s.squishX = 1;
        s.squishY = 1;
        s.squishZ = 1;
        if (blockMeshRef.current) blockMeshRef.current.visible = true;
        if (pixelGridGroupRef.current) pixelGridGroupRef.current.visible = false;
      }
    } else {
      if (blockMeshRef.current) blockMeshRef.current.visible = true;
      if (pixelGridGroupRef.current) pixelGridGroupRef.current.visible = false;

      const GRAB_RADIUS = 0.32;
      if (wantClose && !s.isGrippingBlock && distToBlock < GRAB_RADIUS) {
        s.isGrippingBlock = true;
      } else if (!wantClose && s.isGrippingBlock) {
        s.isGrippingBlock = false;
        s.blockVx = THREE.MathUtils.clamp(tipVelX * 0.65, -4.5, 4.5);
        s.blockVy = THREE.MathUtils.clamp(tipVelY * 0.65, -3.5, 4.5);
        s.blockAngularVel = THREE.MathUtils.clamp(-s.blockVx * 1.8, -6, 6);
      }

      if (s.isGrippingBlock) {
        // Lock the block directly into the claw pocket with zero positional lag so it NEVER clips through the fingers!
        s.blockX = actualTipWorldX;
        s.blockY = actualTipWorldY;
        s.blockVx = tipVelX;
        s.blockVy = tipVelY;

        // Match the turret Y rotation and claw pitch angle so the cube faces sit parallel to the inner finger pads
        s.blockRotY = -s.turretAngle;
        s.blockRotZ = fkTotalAngle + Math.PI * 0.5;

        // Squish along the jaw clamp axis (squishX = 0.78 -> half-width 0.064, inside ±0.068 inner finger faces)
        s.squishX = THREE.MathUtils.damp(s.squishX, 0.78, 22, dt);
        s.squishY = THREE.MathUtils.damp(s.squishY, 1.12, 22, dt);
        s.squishZ = THREE.MathUtils.damp(s.squishZ, 0.92, 22, dt);
        s.supportSurfaceY = FLOOR_Y;
      } else {
        s.blockVy += GRAVITY * dt;
        s.blockX += s.blockVx * dt;
        s.blockY += s.blockVy * dt;
        s.blockRotY = THREE.MathUtils.damp(s.blockRotY, 0, 14, dt);
        s.blockRotZ += s.blockAngularVel * dt;
        s.supportSurfaceY = FLOOR_Y;

        // Solid Claw-to-Block Contact Resolution (prevents the box from clipping through the claw when free)
        const dxBlock = s.blockX - actualTipWorldX;
        const dyBlock = s.blockY - actualTipWorldY;
        const minSepX = BLOCK_HALF + 0.1;
        const minSepY = BLOCK_HALF + 0.09;

        if (Math.abs(dxBlock) < minSepX && Math.abs(dyBlock) < minSepY) {
          if (actualTipWorldY > s.blockY + BLOCK_HALF * 0.45) {
            // Claw pressing down on top of the block -> squish the block vertically
            s.squishY = THREE.MathUtils.damp(s.squishY, 0.82, 24, dt);
            s.squishX = THREE.MathUtils.damp(s.squishX, 1.14, 24, dt);
          } else {
            // Claw pushing against the left or right side of the block -> push block out of the claw's volume
            const pushSign = dxBlock >= 0 ? 1 : -1;
            s.blockX = actualTipWorldX + pushSign * minSepX;
            s.blockVx = Math.max(Math.abs(tipVelX) * 0.75, 0.65) * pushSign;
            s.squishX = THREE.MathUtils.damp(s.squishX, 0.86, 22, dt);
            s.squishY = THREE.MathUtils.damp(s.squishY, 1.08, 22, dt);
          }
        }

        // Floor collision & impact squish
        if (s.blockY <= FLOOR_Y + BLOCK_HALF) {
          s.blockY = FLOOR_Y + BLOCK_HALF;
          s.supportSurfaceY = FLOOR_Y;
          if (Math.abs(s.blockVy) > 0.45) {
            const impact = Math.min(Math.abs(s.blockVy) * 0.08, 0.32);
            s.squishY = 1 - impact;
            s.squishX = 1 + impact * 0.65;
            s.squishZ = 1 + impact * 0.65;
            s.blockVy = -s.blockVy * 0.42;
          } else {
            s.blockVy = 0;
          }
          s.blockVx *= Math.pow(0.08, dt);
          s.blockAngularVel *= Math.pow(0.05, dt);
          const nearestRightAngle =
            Math.round(s.blockRotZ / (Math.PI / 2)) * (Math.PI / 2);
          s.blockRotZ = THREE.MathUtils.damp(s.blockRotZ, nearestRightAngle, 10, dt);
        }

        // Horizontal workspace bounds
        if (s.blockX < -2.05) {
          s.blockX = -2.05;
          s.blockVx = Math.abs(s.blockVx) * 0.5;
        } else if (s.blockX > 2.15) {
          s.blockX = 2.15;
          s.blockVx = -Math.abs(s.blockVx) * 0.5;
        }

        // Pedestal cabinet collision for the block
        const pedLeft = BASE_X - 0.58 - BLOCK_HALF;
        const pedRight = BASE_X + 0.58 + BLOCK_HALF;
        const pedTop = FLOOR_Y + 0.26 + BLOCK_HALF;
        if (s.blockX > pedLeft && s.blockX < pedRight && s.blockY < pedTop) {
          if (s.blockY > FLOOR_Y + 0.22 && s.blockVy <= 0) {
            s.blockY = pedTop;
            s.supportSurfaceY = FLOOR_Y + 0.26;
            s.blockVy = 0;
            s.blockVx *= Math.pow(0.08, dt);
            const nearestRightAngle =
              Math.round(s.blockRotZ / (Math.PI / 2)) * (Math.PI / 2);
            s.blockRotZ = THREE.MathUtils.damp(s.blockRotZ, nearestRightAngle, 10, dt);
          } else {
            if (s.blockX < BASE_X) {
              s.blockX = pedLeft;
              s.blockVx = -Math.abs(s.blockVx) * 0.4;
            } else {
              s.blockX = pedRight;
              s.blockVx = Math.abs(s.blockVx) * 0.4;
            }
          }
        }

        // Elastic recovery back to [1, 1, 1] cube shape
        s.squishX = THREE.MathUtils.damp(s.squishX, 1, 12, dt);
        s.squishY = THREE.MathUtils.damp(s.squishY, 1, 12, dt);
        s.squishZ = THREE.MathUtils.damp(s.squishZ, 1, 12, dt);
      }
    }

    // Update Squishy Block transforms
    if (blockGroupRef.current && blockInnerTiltRef.current && blockMeshRef.current) {
      const blockZ = s.isGrippingBlock ? actualTipWorldZ : Z_PLANE;
      blockGroupRef.current.position.set(s.blockX, s.blockY, blockZ);
      blockGroupRef.current.rotation.set(0, s.blockRotY, 0);
      blockInnerTiltRef.current.rotation.set(0, 0, s.blockRotZ);
      blockMeshRef.current.scale.set(s.squishX, s.squishY, s.squishZ);
    }
    if (blockShadowRef.current) {
      const surfY = s.supportSurfaceY ?? FLOOR_Y;
      const heightAboveSurface = Math.max(0, s.blockY - (surfY + BLOCK_HALF));
      const shadowScale = s.resetAnimActive
        ? 0.4
        : THREE.MathUtils.clamp(1 - heightAboveSurface * 0.45, 0.25, 1.1);
      blockShadowRef.current.position.set(s.blockX, surfY + 0.005, Z_PLANE);
      blockShadowRef.current.scale.set(
        shadowScale * s.squishX,
        1,
        shadowScale * s.squishZ
      );
    }

    // 8. Claw Aperture & Finger Animation
    // When holding the block, jawSpread is 0.084 so the inner finger pads (±0.068) touch the squished block (±0.064) without clipping!
    const desiredSpread = s.isGrippingBlock
      ? 0.084
      : wantClose
      ? 0.024
      : isTouchingBasePedestal
      ? 0.075
      : THREE.MathUtils.lerp(0.112, 0.15, openProgress);
    s.jawSpread = THREE.MathUtils.damp(s.jawSpread, desiredSpread, 24, dt);

    if (pedestalRootRef.current) {
      pedestalRootRef.current.position.set(BASE_X, BASE_Y, 0);
    }
    if (waistTurretRef.current) {
      waistTurretRef.current.rotation.y = -s.turretAngle;
    }
    if (shoulderPivotRef.current) shoulderPivotRef.current.rotation.z = s.theta1;
    if (elbowPivotRef.current) elbowPivotRef.current.rotation.z = s.theta2;
    if (wristPivotRef.current) wristPivotRef.current.rotation.z = s.wristAngle;
    if (wristRollRef.current) {
      wristRollRef.current.rotation.x = 0;
    }

    if (leftFingerRef.current && rightFingerRef.current) {
      leftFingerRef.current.position.y = s.jawSpread;
      leftFingerRef.current.rotation.z = s.isGrippingBlock
        ? 0
        : wantClose
        ? -0.14
        : 0.08;
      rightFingerRef.current.position.y = -s.jawSpread;
      rightFingerRef.current.rotation.z = s.isGrippingBlock
        ? 0
        : wantClose
        ? 0.14
        : -0.08;
    }

    if (telemetryCallbackRef?.current) {
      telemetryCallbackRef.current({
        theta1: ((s.theta1 * 180) / Math.PI).toFixed(1),
        theta2: ((s.theta2 * 180) / Math.PI).toFixed(1),
        turretDeg: (((Math.PI - s.turretAngle) * 180) / Math.PI).toFixed(0),
        aperture: Math.round(
          THREE.MathUtils.clamp(((s.jawSpread - 0.024) / (0.112 - 0.024)) * 100, 0, 100)
        ),
        endX: actualTipWorldX.toFixed(2),
        endY: actualTipWorldY.toFixed(2),
        isClosed: wantClose,
        isHoldingBlock: s.isGrippingBlock,
        isResettingBlock: s.resetAnimActive,
      });
    }
  });

  const upperArmSpan = L1 - 0.32;
  const upperArmCenter = (0.17 + (L1 - 0.15)) / 2;

  const forearmSpan = L2 - 0.24;
  const forearmCenter = (0.14 + (L2 - 0.1)) / 2;

  return (
    <>
      {/* Interactive Squishy Physics Block + 64-Voxel Pixelation Matrix */}
      <group ref={blockGroupRef} position={[BLOCK_ORIGIN_X, BLOCK_ORIGIN_Y, Z_PLANE]}>
        <group ref={blockInnerTiltRef}>
          {/* Solid Squishy Block Mesh */}
          <group ref={blockMeshRef}>
            <mesh material={materials.squishBlockBody}>
              <boxGeometry args={[BLOCK_HALF * 2, BLOCK_HALF * 2, BLOCK_HALF * 2]} />
            </mesh>
            <mesh material={materials.squishBlockCore}>
              <boxGeometry args={[BLOCK_HALF * 2.02, BLOCK_HALF * 0.68, BLOCK_HALF * 1.35]} />
            </mesh>
            <mesh material={materials.squishBlockCore}>
              <boxGeometry args={[BLOCK_HALF * 1.35, BLOCK_HALF * 2.02, BLOCK_HALF * 0.68]} />
            </mesh>
            <mesh position={[0, 0, BLOCK_HALF * 1.02]} material={materials.ledWhite}>
              <boxGeometry args={[0.038, 0.038, 0.008]} />
            </mesh>
          </group>

          {/* 3D Pixelation Voxel Grid (Visible during Pixelation Disappearance & Appearance) */}
          <group ref={pixelGridGroupRef} visible={false}>
            {PIXEL_VOXELS.map((v, i) => (
              <mesh
                key={i}
                ref={(el) => {
                  voxelMeshRefs.current[i] = el;
                }}
                position={[v.baseX, v.baseY, v.baseZ]}
                material={
                  v.isDarkAccent ? materials.squishBlockCore : materials.ceramicWhite
                }
              >
                <boxGeometry args={[VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* Contact Shadow under the Block */}
      <mesh ref={blockShadowRef} position={[BLOCK_ORIGIN_X, FLOOR_Y + 0.005, Z_PLANE]}>
        <boxGeometry args={[BLOCK_HALF * 2.2, 0.008, BLOCK_HALF * 2.2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.55} />
      </mesh>

      {/* Physical 3D Red Reset Button right underneath the right-side info box */}
      <group
        ref={redButtonGroupRef}
        position={[1.48, FLOOR_Y, Z_PLANE]}
        onClick={(e) => {
          e.stopPropagation();
          startPixelResetSequence(stateRef.current);
        }}
      >
        {/* Dark Beveled Industrial Button Base Housing */}
        <mesh position={[0, 0.022, 0]} material={materials.redButtonHousing}>
          <boxGeometry args={[0.36, 0.044, 0.26]} />
        </mesh>
        <mesh position={[0, 0.045, 0]} material={materials.industrialGray}>
          <boxGeometry args={[0.3, 0.016, 0.21]} />
        </mesh>
        {/* Illuminated Red Plunger Cap */}
        <mesh
          ref={redButtonPlungerRef}
          position={[0, 0.068, 0]}
          material={materials.redButtonCap}
        >
          <boxGeometry args={[0.24, 0.042, 0.16]} />
        </mesh>
        {/* Subtle Red Floor Indicator Trim */}
        <mesh
          ref={redButtonGlowRingRef}
          position={[0, 0.006, 0]}
          material={materials.redButtonCap}
        >
          <boxGeometry args={[0.38, 0.006, 0.28]} />
        </mesh>
      </group>

      {/* Robotic Arm & Rotating Pedestal Turret */}
      <group ref={pedestalRootRef} position={[BASE_X, BASE_Y, 0]}>
        <mesh position={[0, 0.04, 0]} material={materials.basePlinth}>
          <boxGeometry args={[1.24, 0.08, 0.84]} />
        </mesh>
        <mesh position={[0, 0.16, 0]} material={materials.industrialGray}>
          <boxGeometry args={[1.04, 0.16, 0.72]} />
        </mesh>
        <mesh position={[0, 0.16, 0.365]} material={materials.darkJointDrum}>
          <boxGeometry args={[0.76, 0.08, 0.01]} />
        </mesh>
        <mesh position={[0, 0.27, 0]} material={materials.ceramicWhite}>
          <cylinderGeometry args={[0.32, 0.36, 0.06, 32]} />
        </mesh>

        {/* Rotating Waist Turret Module */}
        <group ref={waistTurretRef} position={[0, 0.3, 0]}>
          <mesh position={[0, 0.01, 0]} material={materials.darkJointDrum}>
            <cylinderGeometry args={[0.29, 0.29, 0.02, 32]} />
          </mesh>
          <mesh position={[0, 0.06, 0]} material={materials.industrialGray}>
            <cylinderGeometry args={[0.26, 0.29, 0.08, 32]} />
          </mesh>
          <mesh position={[0.26, 0.06, 0]} material={materials.ledWhite}>
            <boxGeometry args={[0.04, 0.025, 0.06]} />
          </mesh>

          <mesh position={[0, 0.18, -0.15]} material={materials.ceramicWhite}>
            <boxGeometry args={[0.32, 0.24, 0.12]} />
          </mesh>
          <mesh
            position={[0, 0.26, -0.15]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.ceramicWhite}
          >
            <cylinderGeometry args={[0.18, 0.18, 0.12, 32]} />
          </mesh>

          {/* Shoulder Pitch Pivot */}
          <group ref={shoulderPivotRef} position={[0, 0.26, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.ceramicWhite}>
              <cylinderGeometry args={[0.19, 0.19, 0.18, 32]} />
            </mesh>
            <mesh
              position={[0, 0, 0.095]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.darkJointDrum}
            >
              <cylinderGeometry args={[0.14, 0.14, 0.012, 32]} />
            </mesh>
            <mesh
              position={[0, 0, -0.095]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.darkJointDrum}
            >
              <cylinderGeometry args={[0.14, 0.14, 0.012, 32]} />
            </mesh>

            <group position={[upperArmCenter, 0, 0]}>
              <mesh material={materials.ceramicWhite}>
                <boxGeometry args={[upperArmSpan, 0.18, 0.15]} />
              </mesh>
              <mesh
                position={[0, 0.092, 0]}
                rotation={[0, 0, Math.PI / 2]}
                material={materials.industrialGray}
              >
                <cylinderGeometry args={[0.028, 0.028, upperArmSpan * 0.94, 16]} />
              </mesh>
              <mesh position={[0, 0, 0.078]} material={materials.darkJointDrum}>
                <boxGeometry args={[upperArmSpan * 0.78, 0.036, 0.008]} />
              </mesh>
              <mesh position={[0, 0, -0.078]} material={materials.darkJointDrum}>
                <boxGeometry args={[upperArmSpan * 0.78, 0.036, 0.008]} />
              </mesh>
            </group>

            {/* Elbow Pivot Joint */}
            <group ref={elbowPivotRef} position={[L1, 0, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.ceramicWhite}>
                <cylinderGeometry args={[0.155, 0.155, 0.16, 32]} />
              </mesh>
              <mesh
                position={[0, 0, 0.085]}
                rotation={[Math.PI / 2, 0, 0]}
                material={materials.darkJointDrum}
              >
                <cylinderGeometry args={[0.11, 0.11, 0.012, 32]} />
              </mesh>
              <mesh
                position={[0, 0, -0.085]}
                rotation={[Math.PI / 2, 0, 0]}
                material={materials.darkJointDrum}
              >
                <cylinderGeometry args={[0.11, 0.11, 0.012, 32]} />
              </mesh>

              <group position={[forearmCenter, 0, 0]}>
                <mesh material={materials.ceramicWhite}>
                  <boxGeometry args={[forearmSpan, 0.135, 0.13]} />
                </mesh>
                <mesh position={[0, 0, 0.068]} material={materials.industrialGray}>
                  <boxGeometry args={[forearmSpan * 0.8, 0.055, 0.008]} />
                </mesh>
                <mesh position={[0, 0, -0.068]} material={materials.industrialGray}>
                  <boxGeometry args={[forearmSpan * 0.8, 0.055, 0.008]} />
                </mesh>
                <mesh
                  position={[0, -0.075, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                  material={materials.midSilver}
                >
                  <cylinderGeometry args={[0.014, 0.014, forearmSpan * 0.88, 12]} />
                </mesh>
              </group>

              {/* Articulated Wrist & High-Contrast Ceramic White/Silver Mechanical Gripper Claw */}
              <group ref={wristPivotRef} position={[L2, 0, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.ceramicWhite}>
                  <cylinderGeometry args={[0.105, 0.105, 0.14, 24]} />
                </mesh>
                <mesh
                  position={[0, 0, 0.074]}
                  rotation={[Math.PI / 2, 0, 0]}
                  material={materials.darkJointDrum}
                >
                  <cylinderGeometry args={[0.075, 0.075, 0.01, 24]} />
                </mesh>
                <mesh
                  position={[0, 0, -0.074]}
                  rotation={[Math.PI / 2, 0, 0]}
                  material={materials.darkJointDrum}
                >
                  <cylinderGeometry args={[0.075, 0.075, 0.01, 24]} />
                </mesh>

                <group ref={wristRollRef} position={[0.1, 0, 0]}>
                  {/* Bright White Wrist Collar */}
                  <mesh rotation={[0, 0, Math.PI / 2]} material={materials.ceramicWhite}>
                    <cylinderGeometry args={[0.075, 0.085, 0.09, 24]} />
                  </mesh>
                  {/* High-Contrast Ceramic White & Silver Gripper Palm Crossbar (No black interior!) */}
                  <mesh position={[0.072, 0, 0]} material={materials.ceramicWhite}>
                    <boxGeometry args={[0.048, 0.25, 0.095]} />
                  </mesh>
                  <mesh position={[0.098, 0, 0]} material={materials.clawBrightInterior}>
                    <boxGeometry args={[0.012, 0.22, 0.088]} />
                  </mesh>
                  <mesh position={[0.072, 0, 0.05]} material={materials.ledWhite}>
                    <boxGeometry args={[0.018, 0.09, 0.006]} />
                  </mesh>
                  <mesh position={[0.072, 0, -0.05]} material={materials.ledWhite}>
                    <boxGeometry args={[0.018, 0.09, 0.006]} />
                  </mesh>

                  {/* Left High-Contrast White/Silver Gripper Finger */}
                  <group ref={leftFingerRef} position={[0.105, 0.088, 0]}>
                    {/* Proximal White Finger Beam */}
                    <mesh position={[0.085, 0, 0]} material={materials.ceramicWhite}>
                      <boxGeometry args={[0.17, 0.032, 0.072]} />
                    </mesh>
                    {/* Bright Silver Inner Grip Pad */}
                    <mesh position={[0.09, -0.014, 0]} material={materials.clawBrightInterior}>
                      <boxGeometry args={[0.14, 0.008, 0.068]} />
                    </mesh>
                    {/* Angled Distal Silver Claw Tip */}
                    <mesh
                      position={[0.19, -0.02, 0]}
                      rotation={[0, 0, -0.42]}
                      material={materials.industrialGray}
                    >
                      <boxGeometry args={[0.085, 0.028, 0.068]} />
                    </mesh>
                  </group>

                  {/* Right High-Contrast White/Silver Gripper Finger */}
                  <group ref={rightFingerRef} position={[0.105, -0.088, 0]}>
                    {/* Proximal White Finger Beam */}
                    <mesh position={[0.085, 0, 0]} material={materials.ceramicWhite}>
                      <boxGeometry args={[0.17, 0.032, 0.072]} />
                    </mesh>
                    {/* Bright Silver Inner Grip Pad */}
                    <mesh position={[0.09, 0.014, 0]} material={materials.clawBrightInterior}>
                      <boxGeometry args={[0.14, 0.008, 0.068]} />
                    </mesh>
                    {/* Angled Distal Silver Claw Tip */}
                    <mesh
                      position={[0.19, 0.02, 0]}
                      rotation={[0, 0, 0.42]}
                      material={materials.industrialGray}
                    >
                      <boxGeometry args={[0.085, 0.028, 0.068]} />
                    </mesh>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </>
  );
}

export default function RoboticArmCanvas({
  scrollOpenRef,
  telemetryCallbackRef,
  resetBlockTriggerRef,
}) {
  const mouseScreenRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.32 : 420,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.55 : 420,
  });
  const isMouseDownRef = useRef(false);
  const gripToggleRef = useRef(false);
  const downTimestampRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseScreenRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseDown = (e) => {
      if (e.target.closest('a, button, input, textarea')) return;
      isMouseDownRef.current = true;
      downTimestampRef.current = performance.now();
    };
    const handleMouseUp = (e) => {
      if (!isMouseDownRef.current) return;
      isMouseDownRef.current = false;
      const pressDuration = performance.now() - downTimestampRef.current;
      if (pressDuration < 220 && !e.target.closest('a, button, input, textarea')) {
        gripToggleRef.current = !gripToggleRef.current;
      } else {
        gripToggleRef.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[4, 7, 6]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-5, 3, 4]} intensity={1.15} color="#d4d4d8" />
        <pointLight position={[0, 2, 3]} intensity={1.2} color="#ffffff" distance={10} />

        <IndustrialArmAndBlock
          mouseScreenRef={mouseScreenRef}
          isMouseDownRef={isMouseDownRef}
          gripToggleRef={gripToggleRef}
          resetBlockTriggerRef={resetBlockTriggerRef}
          scrollOpenRef={scrollOpenRef}
          telemetryCallbackRef={telemetryCallbackRef}
        />
      </Canvas>
    </div>
  );
}
