class ViscosityForce extends Force {

    viscosity: number;

    constructor(particles: Particle[], viscosity: number) {
        super(particles);
        this.viscosity = viscosity;
    }

    apply(h: number) {
        for (let i = 0; i < this.particles.length; i++) {
            let force = new Vec2(0, 0);

            for (let j = 0; j < this.particles.length; j++) {

                if (i == j) {
                    continue;
                }

                if (this.particles[i].rigid || this.particles[i].solid) {
                    continue;
                }

                let posDif = this.particles[i].pos.subtract(this.particles[j].pos);
                let Wd2 = Viscosity.Wd2(posDif, h);

                let tempVel = this.particles[j].vel.subtract(this.particles[i].vel);
                force = force.add(
                    tempVel.scale(1 / this.particles[j].density)
                        .scale(this.viscosity * this.particles[j].mass * Wd2));
            }

            this.particles[i].force = this.particles[i].force.add(force);
        }
    }

    draw() {
    }

}