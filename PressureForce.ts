class PressureForce extends Force {

    constructor(particles: Particle[]) {
        super(particles);
    }

    apply(h: number) {
        for (let i = 0; i < this.particles.length; i++) {
            let force = new Vec2(0, 0);

            for (let j = 0; j < this.particles.length; j++) {

                if (i == j) {
                    continue;
                }

                if (this.particles[i].rigid && this.particles[j].rigid) {
                    continue;
                }

                let posDif = this.particles[i].pos.subtract(this.particles[j].pos);
                let W = Spiky.Wd(posDif, h);

                let toAdd = W.scale(this.particles[j].mass * ((this.particles[i].pressure + this.particles[j].pressure) /
                            (2 * this.particles[j].density)));

                if (this.particles[j].rigid) {
                    //toAdd = toAdd.scale(0.5); // TODO ?
                }

                force = force.add(toAdd);
            }

            this.particles[i].force = this.particles[i].force.add(force);
        }
    }

    draw() {
    }

}