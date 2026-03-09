/* ========================================
   CodAstra — Interactive 3D Cube Engine
   Floating cubes with hover interaction
   ======================================== */

class CubeEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.cubes = [];
        this.mouse = { x: null, y: null, radius: 250 };
        this.animId = null;
        this.time = 0;

        this.config = {
            cubeCount: 25,
            colors: [
                { r: 140, g: 114, b: 242 }, // Purple
                { r: 0, g: 230, b: 255 }, // Cyan
                { r: 77, g: 124, b: 255 }, // Blue
                { r: 167, g: 139, b: 250 }, // Light purple
                { r: 255, g: 107, b: 193 }, // Pink
            ],
            minSize: 20,
            maxSize: 60,
            mouseInfluenceRadius: 200,
            mouseScaleMultiplier: 1.5,
            rotationSpeedRange: 0.008,
            floatAmplitude: 15,
            floatSpeed: 0.02,
        };

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.W = this.canvas.width;
        this.H = this.canvas.height;
    }

    createCube() {
        const col = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
        const size = this.config.minSize + Math.random() * (this.config.maxSize - this.config.minSize);
        const depth = 0.3 + Math.random() * 0.7; // 0.3 to 1.0 — parallax depth

        return {
            x: Math.random() * this.W,
            y: Math.random() * this.H,
            baseX: 0,
            baseY: 0,
            size: size * depth,
            depth: depth,
            color: col,
            alpha: 0.08 + depth * 0.15,
            rotationX: Math.random() * Math.PI * 2,
            rotationY: Math.random() * Math.PI * 2,
            rotationZ: Math.random() * Math.PI * 2,
            rotSpeedX: (Math.random() - 0.5) * this.config.rotationSpeedRange,
            rotSpeedY: (Math.random() - 0.5) * this.config.rotationSpeedRange,
            rotSpeedZ: (Math.random() - 0.5) * this.config.rotationSpeedRange * 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            floatSpeed: this.config.floatSpeed * (0.5 + Math.random()),
            currentScale: 1,
            targetScale: 1,
            glowIntensity: 0,
            targetGlow: 0,
        };
    }

    init() {
        this.cubes = [];
        for (let i = 0; i < this.config.cubeCount; i++) {
            const cube = this.createCube();
            cube.baseX = cube.x;
            cube.baseY = cube.y;
            this.cubes.push(cube);
        }
        // Sort by depth so furthest cubes are drawn first
        this.cubes.sort((a, b) => a.depth - b.depth);
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            const oldW = this.W;
            const oldH = this.H;
            this.resize();
            // Scale cube positions
            for (const c of this.cubes) {
                c.baseX = (c.baseX / oldW) * this.W;
                c.baseY = (c.baseY / oldH) * this.H;
            }
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    projectPoint(x, y, z, cube) {
        // Simple 3D rotation then project to 2D
        const { rotationX, rotationY, rotationZ } = cube;

        // Rotate around X
        let y1 = y * Math.cos(rotationX) - z * Math.sin(rotationX);
        let z1 = y * Math.sin(rotationX) + z * Math.cos(rotationX);

        // Rotate around Y
        let x1 = x * Math.cos(rotationY) + z1 * Math.sin(rotationY);
        let z2 = -x * Math.sin(rotationY) + z1 * Math.cos(rotationY);

        // Rotate around Z
        let x2 = x1 * Math.cos(rotationZ) - y1 * Math.sin(rotationZ);
        let y2 = x1 * Math.sin(rotationZ) + y1 * Math.cos(rotationZ);

        return { x: x2, y: y2, z: z2 };
    }

    drawCube(cube) {
        const { ctx } = this;
        const s = (cube.size / 2) * cube.currentScale;
        const { r, g, b } = cube.color;

        // 8 vertices of a cube
        const verts = [
            { x: -s, y: -s, z: -s },
            { x: s, y: -s, z: -s },
            { x: s, y: s, z: -s },
            { x: -s, y: s, z: -s },
            { x: -s, y: -s, z: s },
            { x: s, y: -s, z: s },
            { x: s, y: s, z: s },
            { x: -s, y: s, z: s },
        ];

        // Project all vertices
        const projected = verts.map(v => {
            const p = this.projectPoint(v.x, v.y, v.z, cube);
            return {
                x: cube.x + p.x,
                y: cube.y + p.y,
                z: p.z
            };
        });

        // 6 faces (front, back, left, right, top, bottom)
        const faces = [
            { indices: [0, 1, 2, 3], normal: 'back' },
            { indices: [4, 5, 6, 7], normal: 'front' },
            { indices: [0, 1, 5, 4], normal: 'top' },
            { indices: [2, 3, 7, 6], normal: 'bottom' },
            { indices: [0, 3, 7, 4], normal: 'left' },
            { indices: [1, 2, 6, 5], normal: 'right' },
        ];

        // Calculate average z for each face for painter's algorithm
        const facesWithDepth = faces.map(f => {
            const avgZ = f.indices.reduce((sum, i) => sum + projected[i].z, 0) / 4;
            return { ...f, avgZ };
        });

        // Sort faces back-to-front
        facesWithDepth.sort((a, b) => a.avgZ - b.avgZ);

        const baseAlpha = cube.alpha;
        const glowAlpha = cube.glowIntensity;

        // Draw glow effect behind cube when hovering
        if (glowAlpha > 0.01) {
            ctx.save();
            ctx.beginPath();
            const glowGrad = ctx.createRadialGradient(cube.x, cube.y, 0, cube.x, cube.y, s * 3);
            glowGrad.addColorStop(0, `rgba(${r},${g},${b},${glowAlpha * 0.3})`);
            glowGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.fillStyle = glowGrad;
            ctx.arc(cube.x, cube.y, s * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Draw faces
        for (const face of facesWithDepth) {
            const pts = face.indices.map(i => projected[i]);

            // Determine brightness based on face normal
            const brightness = 0.3 + (face.avgZ / s + 1) * 0.35;
            const alpha = baseAlpha * brightness + glowAlpha * 0.2;

            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.closePath();

            // Fill face
            ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(alpha, 0.6)})`;
            ctx.fill();

            // Edge lines
            ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(alpha * 1.5 + glowAlpha * 0.4, 0.8)})`;
            ctx.lineWidth = 0.8 + glowAlpha * 0.5;
            ctx.stroke();
        }
    }

    updateCubes() {
        this.time += 1;

        for (const cube of this.cubes) {
            // Rotation
            cube.rotationX += cube.rotSpeedX;
            cube.rotationY += cube.rotSpeedY;
            cube.rotationZ += cube.rotSpeedZ;

            // Floating motion
            const floatY = Math.sin(this.time * cube.floatSpeed + cube.floatOffset) * this.config.floatAmplitude * cube.depth;
            const floatX = Math.cos(this.time * cube.floatSpeed * 0.7 + cube.floatOffset) * this.config.floatAmplitude * 0.5 * cube.depth;

            cube.x = cube.baseX + floatX;
            cube.y = cube.baseY + floatY;

            // Mouse interaction
            cube.targetScale = 1;
            cube.targetGlow = 0;

            if (this.mouse.x !== null) {
                const dist = Math.hypot(cube.x - this.mouse.x, cube.y - this.mouse.y);
                const influence = this.config.mouseInfluenceRadius * (1 + cube.depth * 0.5);

                if (dist < influence) {
                    const factor = 1 - (dist / influence);
                    cube.targetScale = 1 + factor * (this.config.mouseScaleMultiplier - 1);
                    cube.targetGlow = factor;

                    // Speed up rotation near mouse
                    cube.rotationX += cube.rotSpeedX * factor * 4;
                    cube.rotationY += cube.rotSpeedY * factor * 4;
                }
            }

            // Smooth easing
            cube.currentScale += (cube.targetScale - cube.currentScale) * 0.08;
            cube.glowIntensity += (cube.targetGlow - cube.glowIntensity) * 0.08;
        }
    }

    drawCrosshairs() {
        if (!this.mouse.x) return;
        const { ctx } = this;
        const mx = this.mouse.x;
        const my = this.mouse.y;

        ctx.save();
        // Horizontal scan line
        ctx.beginPath();
        const hGrad = ctx.createLinearGradient(mx - 150, my, mx + 150, my);
        hGrad.addColorStop(0, 'rgba(0, 230, 255, 0)');
        hGrad.addColorStop(0.5, 'rgba(0, 230, 255, 0.06)');
        hGrad.addColorStop(1, 'rgba(0, 230, 255, 0)');
        ctx.strokeStyle = hGrad;
        ctx.lineWidth = 1;
        ctx.moveTo(mx - 150, my);
        ctx.lineTo(mx + 150, my);
        ctx.stroke();

        // Vertical scan line
        ctx.beginPath();
        const vGrad = ctx.createLinearGradient(mx, my - 150, mx, my + 150);
        vGrad.addColorStop(0, 'rgba(0, 230, 255, 0)');
        vGrad.addColorStop(0.5, 'rgba(0, 230, 255, 0.06)');
        vGrad.addColorStop(1, 'rgba(0, 230, 255, 0)');
        ctx.strokeStyle = vGrad;
        ctx.moveTo(mx, my - 150);
        ctx.lineTo(mx, my + 150);
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 230, 255, 0.15)';
        ctx.fill();

        ctx.restore();
    }

    animate() {
        const { ctx, W, H } = this;
        ctx.clearRect(0, 0, W, H);

        this.updateCubes();
        this.drawCrosshairs();

        for (const cube of this.cubes) {
            this.drawCube(cube);
        }

        this.animId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animId) cancelAnimationFrame(this.animId);
    }
}

// Initialize when DOM ready
window.addEventListener('DOMContentLoaded', () => {
    window._cubeEngine = new CubeEngine('cube-canvas');
});
