// ERIC Medical Site - Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            this.ctx.fill();
        });
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 120)})`;
                    this.ctx.stroke();
                }
            });
        });
        requestAnimationFrame(() => this.animate());
    }
}

// DNA Helix Animation
class DNAHelix {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = 200;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const centerY = this.canvas.height / 2;
        const amplitude = 40;
        const frequency = 0.02;
        const speed = 0.05;

        for (let x = 0; x < this.canvas.width; x += 20) {
            const y1 = centerY + Math.sin((x * frequency) + this.time) * amplitude;
            const y2 = centerY + Math.sin((x * frequency) + this.time + Math.PI) * amplitude;

            // Draw strand 1
            this.ctx.beginPath();
            this.ctx.arc(x, y1, 8, 0, Math.PI * 2);
            const gradient1 = this.ctx.createRadialGradient(x, y1, 0, x, y1, 8);
            gradient1.addColorStop(0, '#60a5fa');
            gradient1.addColorStop(1, '#1e40af');
            this.ctx.fillStyle = gradient1;
            this.ctx.fill();

            // Draw strand 2
            this.ctx.beginPath();
            this.ctx.arc(x, y2, 8, 0, Math.PI * 2);
            const gradient2 = this.ctx.createRadialGradient(x, y2, 0, x, y2, 8);
            gradient2.addColorStop(0, '#f472b6');
            gradient2.addColorStop(1, '#be185d');
            this.ctx.fillStyle = gradient2;
            this.ctx.fill();

            // Draw connecting lines (base pairs)
            if (Math.abs(y1 - y2) < amplitude * 1.5) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y1);
                this.ctx.lineTo(x, y2);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }

        // Highlight abnormal regions (1q21 and TP53)
        const abnormalX = this.canvas.width * 0.3;
        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        this.ctx.fillRect(abnormalX - 30, 0, 60, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('1q21', abnormalX, 20);

        const abnormalX2 = this.canvas.width * 0.7;
        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        this.ctx.fillRect(abnormalX2 - 30, 0, 60, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('TP53', abnormalX2, 20);

        this.time += speed;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) new ParticleSystem(particlesCanvas);

    // DNA Helix
    const dnaCanvas = document.getElementById('dna-helix');
    if (dnaCanvas) new DNAHelix(dnaCanvas);
});
