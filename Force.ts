abstract class Force {
    particles: Particle[];

    protected constructor(particles: Particle[]) {
        this.particles = [];

        for (const p of particles) {
            this.particles.push(p);
        }
    }

    abstract apply(h: number);
    abstract draw();
}