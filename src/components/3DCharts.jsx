import { useEffect, useRef } from "react"; 
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Import OrbitControls
import { wordCount, sentenceCount, characterCount } from './WordCount'; // Import the count variables

export default function ThreeDChart() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Create a scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    mountRef.current.appendChild(renderer.domElement);

    // Create Axes
    const axesHelper = new THREE.AxesHelper(10); // Size of the axes
    scene.add(axesHelper);

    // Create Bars
    const barMaterials = [
      new THREE.MeshBasicMaterial({ color: 0x3498db }), // Word Count Bar
      new THREE.MeshBasicMaterial({ color: 0x2ecc71 }), // Sentence Count Bar
      new THREE.MeshBasicMaterial({ color: 0xe74c3c }), // Character Count Bar
    ];

    // Word Count Bar
    const wordBarGeometry = new THREE.BoxGeometry(1, wordCount / 10, 1);
    const wordBar = new THREE.Mesh(wordBarGeometry, barMaterials[0]);
    wordBar.position.set(-2, wordCount / 20, 0); // Adjust the Y position
    scene.add(wordBar);

    // Sentence Count Bar
    const sentenceBarGeometry = new THREE.BoxGeometry(1, sentenceCount / 10, 1);
    const sentenceBar = new THREE.Mesh(sentenceBarGeometry, barMaterials[1]);
    sentenceBar.position.set(0, sentenceCount / 20, 0); // Adjust the Y position
    scene.add(sentenceBar);

    // Character Count Bar
    const charBarGeometry = new THREE.BoxGeometry(1, characterCount / 10, 1);
    const charBar = new THREE.Mesh(charBarGeometry, barMaterials[2]);
    charBar.position.set(2, characterCount / 20, 0); // Adjust the Y position
    scene.add(charBar);

    // Create Labels for X-axis
    const createLabel = (text, position) => {
      const spriteMaterial = new THREE.SpriteMaterial({ color: 0xE8F0FE });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(3, 1.5, 1.5); // Adjust label size
      sprite.position.copy(position);
      scene.add(sprite);

      // Create text texture
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = 'bold 40px Arial'; // Make the font bold and larger
      context.fillStyle = 'white';
      context.fillText(text, 0, 40); // Adjust text position
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      sprite.material.map = texture;
      sprite.material.needsUpdate = true;
    };

    // Add X-axis labels
    createLabel('Words', new THREE.Vector3(-1.5, -1, 0));
    createLabel('Sentences', new THREE.Vector3(0.5, -1, 0));
    createLabel('Characters', new THREE.Vector3(3, -1, 0));

    // Add Z-axis values
    const maxCount = Math.ceil(Math.max(characterCount, sentenceCount, wordCount) / 10) * 10; // Adjusted to max of counts
    const step = 10; // Z-axis step for labeling
    for (let i = 0; i <= maxCount; i += step) {
      createLabel(i.toString(), new THREE.Vector3(-2.5, i / 10, 0));
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 10, 5);
    scene.add(pointLight);

    camera.position.z = 7;

    // Add OrbitControls for rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
      renderer.render(scene, camera);
    };

    animate();

    return () => {
        if (mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
          }
    };
  }, []);

  return <div ref={mountRef} />;
}
