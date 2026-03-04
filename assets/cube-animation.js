/**
 * 3D Hero Cube and Particles JS
 * Sets up parallax and injects cube particles
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroParallax();
    initCubeParticles();
});

function initHeroParallax() {
    const heroCubeContainer = document.querySelector('.hero-cube-container');
    if (!heroCubeContainer) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Parallax: cube background moves at 0.5x scroll speed
        heroCubeContainer.style.transform = `translateY(${scrollY * 0.5}px)`;
    });
}

function initCubeParticles() {
    const particleContainer = document.querySelector('.hero-particles');
    if (!particleContainer) return;

    const numParticles = 10;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'wireframe-particle';

        // Randomize initial positions and properties
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = 20 + Math.random() * 40; // 20px to 60px
        const duration = 15 + Math.random() * 20; // 15s to 35s
        const delay = Math.random() * -20; // Random start in animation

        particle.style.cssText = `
      top: ${top}%;
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

        // Create 3D faces for the wireframe particle
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        faces.forEach(face => {
            const faceEl = document.createElement('div');
            faceEl.className = `wireframe-face face-${face}`;
            particle.appendChild(faceEl);
        });

        particleContainer.appendChild(particle);
    }
}
