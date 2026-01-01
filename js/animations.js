// ERIC Medical Site - Advanced Animations
// Interactive visualizations for medical education

// ===== PARTICLE SYSTEM =====
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
        const count = Math.floor((this.canvas.width * this.canvas.height) / 12000);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.1,
                color: Math.random() > 0.7 ? '#60a5fa' : '#f472b6'
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
            this.ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba').replace('#60a5fa', 'rgba(96, 165, 250').replace('#f472b6', 'rgba(244, 114, 182');
            this.ctx.fill();
        });

        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 100)})`;
                    this.ctx.stroke();
                }
            });
        });
        requestAnimationFrame(() => this.animate());
    }
}

// ===== DNA HELIX ANIMATION =====
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
        this.canvas.width = this.canvas.parentElement?.offsetWidth || 800;
        this.canvas.height = 200;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const centerY = this.canvas.height / 2;
        const amplitude = 35;
        const frequency = 0.025;
        const speed = 0.04;

        // Draw base pairs first (behind)
        for (let x = 0; x < this.canvas.width; x += 25) {
            const y1 = centerY + Math.sin((x * frequency) + this.time) * amplitude;
            const y2 = centerY + Math.sin((x * frequency) + this.time + Math.PI) * amplitude;

            // Only draw base pairs when strands are close enough
            if (Math.abs(y1 - y2) < amplitude * 1.8) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y1);
                this.ctx.lineTo(x, y2);
                const basePairColors = ['rgba(34, 197, 94, 0.4)', 'rgba(251, 191, 36, 0.4)', 'rgba(236, 72, 153, 0.4)', 'rgba(59, 130, 246, 0.4)'];
                this.ctx.strokeStyle = basePairColors[Math.floor(x / 25) % 4];
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }
        }

        // Draw strand 1 nodes
        for (let x = 0; x < this.canvas.width; x += 25) {
            const y1 = centerY + Math.sin((x * frequency) + this.time) * amplitude;

            this.ctx.beginPath();
            this.ctx.arc(x, y1, 9, 0, Math.PI * 2);
            const gradient1 = this.ctx.createRadialGradient(x, y1, 0, x, y1, 9);
            gradient1.addColorStop(0, '#93c5fd');
            gradient1.addColorStop(1, '#1e40af');
            this.ctx.fillStyle = gradient1;
            this.ctx.shadowColor = '#3b82f6';
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        // Draw strand 2 nodes
        for (let x = 0; x < this.canvas.width; x += 25) {
            const y2 = centerY + Math.sin((x * frequency) + this.time + Math.PI) * amplitude;

            this.ctx.beginPath();
            this.ctx.arc(x, y2, 9, 0, Math.PI * 2);
            const gradient2 = this.ctx.createRadialGradient(x, y2, 0, x, y2, 9);
            gradient2.addColorStop(0, '#fda4af');
            gradient2.addColorStop(1, '#be185d');
            this.ctx.fillStyle = gradient2;
            this.ctx.shadowColor = '#ec4899';
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        // Highlight abnormal regions
        const abnormalRegions = [
            { x: this.canvas.width * 0.25, label: '1q21 GAIN', color: 'rgba(239, 68, 68, 0.25)' },
            { x: this.canvas.width * 0.7, label: 'TP53 ABNORMAL', color: 'rgba(239, 68, 68, 0.25)' }
        ];

        abnormalRegions.forEach(region => {
            this.ctx.fillStyle = region.color;
            this.ctx.fillRect(region.x - 50, 0, 100, this.canvas.height);

            // Pulsing border
            const pulse = Math.sin(this.time * 2) * 0.5 + 0.5;
            this.ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + pulse * 0.4})`;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(region.x - 50, 0, 100, this.canvas.height);

            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 11px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(region.label, region.x, 15);
        });

        this.time += speed;
        requestAnimationFrame(() => this.animate());
    }
}

// ===== CHO CELL BIOREACTOR ANIMATION =====
class CHOCellAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cells = [];
        this.antibodies = [];
        this.time = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement?.offsetWidth || 600;
        this.canvas.height = 300;
    }

    init() {
        // Create CHO cells
        for (let i = 0; i < 15; i++) {
            this.cells.push({
                x: 80 + Math.random() * 150,
                y: 50 + Math.random() * 200,
                radius: 15 + Math.random() * 10,
                pulsePhase: Math.random() * Math.PI * 2,
                wobble: Math.random() * 0.02
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bioreactor tank
        this.ctx.fillStyle = 'rgba(30, 58, 138, 0.15)';
        this.ctx.strokeStyle = 'rgba(30, 58, 138, 0.6)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.roundRect(30, 20, 200, 260, 20);
        this.ctx.fill();
        this.ctx.stroke();

        // Tank label
        this.ctx.fillStyle = '#1e40af';
        this.ctx.font = 'bold 12px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CHO CELL BIOREACTOR', 130, 295);
        this.ctx.font = '10px Inter, sans-serif';
        this.ctx.fillStyle = '#6b7280';
        this.ctx.fillText('Chinese Hamster Ovary Cells', 130, 308);

        // Draw CHO cells (hamster cells!)
        this.cells.forEach((cell, i) => {
            const pulse = 1 + Math.sin(this.time * 2 + cell.pulsePhase) * 0.08;
            const wobbleX = Math.sin(this.time + i) * 3;
            const wobbleY = Math.cos(this.time * 0.8 + i) * 2;

            // Cell body
            this.ctx.beginPath();
            this.ctx.ellipse(cell.x + wobbleX, cell.y + wobbleY, cell.radius * pulse, cell.radius * pulse * 0.8, 0, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(cell.x + wobbleX - 5, cell.y + wobbleY - 5, 0, cell.x + wobbleX, cell.y + wobbleY, cell.radius * pulse);
            gradient.addColorStop(0, '#fcd34d');
            gradient.addColorStop(0.5, '#f59e0b');
            gradient.addColorStop(1, '#d97706');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Nucleus
            this.ctx.beginPath();
            this.ctx.arc(cell.x + wobbleX, cell.y + wobbleY, cell.radius * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#7c3aed';
            this.ctx.fill();

            // Produce antibody periodically
            if (Math.random() < 0.008) {
                this.antibodies.push({
                    x: cell.x + wobbleX,
                    y: cell.y + wobbleY,
                    vx: 2 + Math.random(),
                    vy: (Math.random() - 0.5) * 2,
                    life: 1
                });
            }
        });

        // Draw and update antibodies (Y-shaped)
        this.antibodies = this.antibodies.filter(ab => ab.life > 0);
        this.antibodies.forEach(ab => {
            ab.x += ab.vx;
            ab.y += ab.vy + Math.sin(this.time * 3 + ab.x * 0.1) * 0.5;
            ab.life -= 0.005;

            if (ab.x < this.canvas.width - 100) {
                // Draw Y-shaped antibody
                this.ctx.strokeStyle = `rgba(16, 185, 129, ${ab.life})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(ab.x, ab.y + 6);
                this.ctx.lineTo(ab.x, ab.y);
                this.ctx.lineTo(ab.x - 4, ab.y - 5);
                this.ctx.moveTo(ab.x, ab.y);
                this.ctx.lineTo(ab.x + 4, ab.y - 5);
                this.ctx.stroke();
            }
        });

        // Draw purification column
        this.ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
        this.ctx.beginPath();
        this.ctx.roundRect(280, 60, 60, 180, 10);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.fillStyle = '#7c3aed';
        this.ctx.font = 'bold 10px Inter, sans-serif';
        this.ctx.fillText('PROTEIN A', 310, 265);
        this.ctx.fillText('COLUMN', 310, 277);

        // Arrow
        this.ctx.strokeStyle = '#6b7280';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(240, 150);
        this.ctx.lineTo(270, 150);
        this.ctx.lineTo(265, 145);
        this.ctx.moveTo(270, 150);
        this.ctx.lineTo(265, 155);
        this.ctx.stroke();

        // Draw final product (Daratumumab)
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        this.ctx.beginPath();
        this.ctx.roundRect(400, 80, 150, 140, 15);
        this.ctx.fill();
        this.ctx.stroke();

        // Arrow to product
        this.ctx.strokeStyle = '#6b7280';
        this.ctx.beginPath();
        this.ctx.moveTo(350, 150);
        this.ctx.lineTo(390, 150);
        this.ctx.lineTo(385, 145);
        this.ctx.moveTo(390, 150);
        this.ctx.lineTo(385, 155);
        this.ctx.stroke();

        // Draw large antibody in product box
        const abX = 475, abY = 130;
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(abX, abY + 30);
        this.ctx.lineTo(abX, abY);
        this.ctx.lineTo(abX - 20, abY - 25);
        this.ctx.moveTo(abX, abY);
        this.ctx.lineTo(abX + 20, abY - 25);
        this.ctx.stroke();

        // Binding sites glow
        const glow = Math.sin(this.time * 3) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(239, 68, 68, ${glow})`;
        this.ctx.beginPath();
        this.ctx.arc(abX - 20, abY - 25, 6, 0, Math.PI * 2);
        this.ctx.arc(abX + 20, abY - 25, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#10b981';
        this.ctx.font = 'bold 14px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('DARATUMUMAB', 475, 185);
        this.ctx.font = '11px Inter, sans-serif';
        this.ctx.fillStyle = '#6b7280';
        this.ctx.fillText('Anti-CD38 Antibody', 475, 200);
        this.ctx.fillText('~10 g/L yield', 475, 215);

        this.time += 0.03;
        requestAnimationFrame(() => this.animate());
    }
}

// ===== DRUG MECHANISM ANIMATION =====
class DrugMechanismAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement?.offsetWidth || 800;
        this.canvas.height = 350;
    }

    drawMyelomaCell(x, y, radius, dying = false) {
        const pulse = 1 + Math.sin(this.time * 2) * 0.05;

        // Cell membrane
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(x - radius / 3, y - radius / 3, 0, x, y, radius);
        if (dying) {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
            gradient.addColorStop(1, 'rgba(127, 29, 29, 0.5)');
        } else {
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0.4)');
            gradient.addColorStop(1, 'rgba(88, 28, 135, 0.6)');
        }
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = dying ? '#ef4444' : '#7c3aed';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // CD38 receptors on surface
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.time * 0.5;
            const rx = x + Math.cos(angle) * (radius * pulse);
            const ry = y + Math.sin(angle) * (radius * pulse);

            this.ctx.beginPath();
            this.ctx.arc(rx, ry, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#f59e0b';
            this.ctx.fill();
        }

        // Nucleus
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = dying ? '#991b1b' : '#581c87';
        this.ctx.fill();

        // Label
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 10px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('MYELOMA', x, y - 5);
        this.ctx.fillText('CELL', x, y + 8);
    }

    drawAntibody(x, y, angle = 0, attacking = false) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);

        this.ctx.strokeStyle = attacking ? '#ef4444' : '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 15);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(-10, -12);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(10, -12);
        this.ctx.stroke();

        // Binding sites
        this.ctx.fillStyle = attacking ? '#ef4444' : '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(-10, -12, 4, 0, Math.PI * 2);
        this.ctx.arc(10, -12, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw myeloma cell (center)
        const dying = this.time > 5;
        this.drawMyelomaCell(centerX, centerY, 60, dying);

        // Draw attacking antibodies
        const numAntibodies = 6;
        for (let i = 0; i < numAntibodies; i++) {
            const baseAngle = (i / numAntibodies) * Math.PI * 2;
            const orbitRadius = 110 + Math.sin(this.time + i) * 10;
            const angle = baseAngle + this.time * 0.3;

            const ax = centerX + Math.cos(angle) * orbitRadius;
            const ay = centerY + Math.sin(angle) * orbitRadius;

            this.drawAntibody(ax, ay, angle + Math.PI / 2, dying);

            // Draw attack line when dying
            if (dying) {
                const targetX = centerX + Math.cos(angle) * 60;
                const targetY = centerY + Math.sin(angle) * 60;
                this.ctx.setLineDash([5, 5]);
                this.ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 + Math.sin(this.time * 5) * 0.3})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(ax, ay);
                this.ctx.lineTo(targetX, targetY);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        }

        // Labels
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = 'bold 14px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('DARATUMUMAB ATTACKING YOUR MYELOMA', centerX, 30);

        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillText('🟢 Antibodies binding to CD38 receptors', centerX, this.canvas.height - 30);

        if (dying) {
            this.ctx.fillStyle = '#ef4444';
            this.ctx.font = 'bold 16px Inter, sans-serif';
            this.ctx.fillText('⚡ CELL DEATH TRIGGERED ⚡', centerX, this.canvas.height - 50);
        }

        this.time += 0.02;
        if (this.time > 10) this.time = 0; // Reset animation

        requestAnimationFrame(() => this.animate());
    }
}

// ===== CHROMOSOME ANIMATION =====
class ChromosomeAnimation {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        const chromosomes = this.container.querySelectorAll('.chromosome-animated');
        chromosomes.forEach((chrom, i) => {
            chrom.style.animation = `chromosomeFloat 3s ease-in-out infinite ${i * 0.2}s`;

            const probe = chrom.querySelector('.probe-animated');
            if (probe) {
                probe.style.animation = `probePulse 1.5s ease-in-out infinite ${i * 0.1}s`;
            }
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Particle background
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) new ParticleSystem(particlesCanvas);

    // DNA Helix
    const dnaCanvas = document.getElementById('dna-helix');
    if (dnaCanvas) new DNAHelix(dnaCanvas);

    // CHO Cell Animation
    const choCanvas = document.getElementById('cho-cell-animation');
    if (choCanvas) new CHOCellAnimation(choCanvas);

    // Drug Mechanism Animation
    const drugCanvas = document.getElementById('drug-mechanism-animation');
    if (drugCanvas) new DrugMechanismAnimation(drugCanvas);

    // Chromosome animations
    const chromContainer = document.getElementById('chromosome-viz');
    if (chromContainer) new ChromosomeAnimation(chromContainer);

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
});

// Add required CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes chromosomeFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(2deg); }
    }
    @keyframes probePulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 10px currentColor; }
        50% { transform: translate(-50%, -50%) scale(1.3); box-shadow: 0 0 25px currentColor, 0 0 40px currentColor; }
    }
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal-on-scroll.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
