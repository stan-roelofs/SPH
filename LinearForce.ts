class LinearForce extends Force {

    force: Vec2;

    constructor(particles: Particle[], force: Vec2) {
        super(particles);
        this.force = force;
    }

    apply(h: number) {
        for (const p of this.particles) {
            p.force = p.force.add(this.force.scale(p.density));
        }
    }

    draw() {

    }

}