// animation extracted and adapted from https://codepen.io/hellobrophy/pen/rKqYRo

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Waves = () => {
  const containerRef = useRef();

  useEffect(() => {
    let camera, scene, renderer;
    let particles, particle, count = 0;
    let AMOUNTX = 60;
    let AMOUNTY = 30;
    let SEPARATION = 50;

    

    function init() {
      
      camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000; 


      scene = new THREE.Scene();

      particles = new Array();

      var material = new THREE.SpriteMaterial();

      var i = 0;

      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++] = new THREE.Sprite(material);
          particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          scene.add(particle);
        }
      }

      renderer = new THREE.WebGLRenderer();
      // renderer.setSize(500, 500);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    

    function render() {
      let mouseX = 0
      let mouseY = 0
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      var i = 0;

      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++];
          particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
          particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2;
        }
      }

      renderer.render(scene, camera);

      count += 0.1;
    }

    init();
    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      // containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed bottom-0 left-0 w-1/2 h-1/2 translate-y-[-20%] z-[-1]"></div>;

};

export default Waves;
