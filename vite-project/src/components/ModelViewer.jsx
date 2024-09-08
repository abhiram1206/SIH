// ModelViewer.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ModelViewer = ({ modelPath }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, controls, model;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    // Camera setup
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, premultipliedAlpha: false, });
    renderer.setSize(800,500); 
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      function (gltf) {
        model = gltf.scene;
        scene.add(model);

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Adjust camera to fit model
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));
        camera.position.z = cameraZ;

        camera.updateProjectionMatrix();
      },
      undefined,
      function (error) {
        console.error('An error occurred while loading the model', error);
      }
    );

    // Handle window resizing
    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <div
      ref={mountRef}
      style={{width: '55vw', height: '80vh' }} // Full width and height to fit parent
    />
  );
};

export default ModelViewer;
