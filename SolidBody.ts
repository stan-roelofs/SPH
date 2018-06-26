class SolidBody {
    get particles(): Particle[] {
        return this._particles;
    }
    private _particles: Particle[];

    constructor(particles: Particle[]) {
        this._particles = [];

        for (const p of particles) {
            p.solid = true;
            p.density = 0.05;
            this._particles.push(p);
        }
    }
}