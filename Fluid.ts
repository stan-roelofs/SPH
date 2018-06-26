class Fluid {
    get mass(): number {
        return this._mass;
    }

    set mass(value: number) {
        this._mass = value;
    }
    get h(): number {
        return this._h;
    }
    set h(value: number) {
        this._h = value;
    }
    get rigids(): RigidBody[] {
        return this._rigids;
    }
    get particles(): Particle[] {
        return this._particles;
    }

    private _mass: number;
    private numParticles: number;
    private viscosity: number;
    private _h: number;
    private k: number;
    private restDensity: number;
    private gravityConst: number;
    private dt: number;
    private _particles: Particle[];
    private _forces: Force[];
    private _rigids: RigidBody[];
    private _solids: SolidBody[];

    constructor() {
        // Physical attrs
        this.numParticles = 250;
        this.viscosity = 500 * 5;
        this._mass = 500 * .13;
        this._h = 18;
        this.k = 400 * 5;
        this.restDensity = 998;
        this.gravityConst = 120000 * 9.82;
        this.dt = 0.0004;

        this.clear();
        this.initWater();
    }

    clear() {
        this._particles = [];
        this._forces = [];
        this._rigids = [];
        this._solids = [];
    }

    initWater() {
        this.clear();
        this.numParticles = 400;
        this.viscosity = 700*5;

        // Set starting positions
        let k = 0;
        let j = 0;

        for (let i = 0; i < this.numParticles; i++) {
            if (i % 20 === 0) {
                k++;
                j = 0;
            }
            j++;

            this._particles.push(new Particle(100 + j * this._h / 2, 300 + k * this._h / 2, this._mass));
        }

        let temp: Particle[] = [];
        for (k = 0; k < 100; k++) {
            let p = new Particle(10 + 5 * k, 10, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(10, 10 + 10 * k, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(500, 10 + 10 * k, this._mass);
            this._particles.push(p);
            temp.push(p);
        }

        this._solids.push(new SolidBody(temp));

        this._forces.push(new LinearForce(this._particles, new Vec2(0, -this.gravityConst)));
        this._forces.push(new PressureForce(this._particles));
        this._forces.push(new ViscosityForce(this._particles, this.viscosity));
        this._forces.push(new SurfaceForce(this._particles));
    }

    initFunnel() {
        this.clear();
        this.numParticles = 250;
        this.viscosity = 400*5;

        // Set starting positions
        let k = 0;
        let j = 0;

        for (let i = 0; i < this.numParticles; i++) {
            if (i % 20 === 0) {
                k++;
                j = 0;
            }
            j++;

            this._particles.push(new Particle(50 + 2*j * this._h / 2, 450 + 2 * k * this._h / 2, this._mass));
        }

        let temp: Particle[] = [];
        for (k = 0; k < 50; k++) {
            let p = new Particle(10 + 10 * k, 10, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(10, 10 + 10 * k, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(500, 10 + 10 * k, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        this._solids.push(new SolidBody(temp));

        temp = [];
        for (let i = 0; i < 46; i++) {
            let p = new Particle(5 * i, 500 - 5 * i, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        for (let i = 0; i < 46; i++) {
            let p = new Particle(512 - 5 * i, 500 - 5 * i, this._mass) ;
            this._particles.push(p);
            temp.push(p);
        }
        this._solids.push(new SolidBody(temp));

        temp = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (i == 0 || i == 4) {
                    let p = new Particle(100 + i * 4, 600 + j * 4, 5);
                    this._particles.push(p);
                    temp.push(p);
                } else if (j == 0 || j == 4) {
                    let p = new Particle(100 + i * 4, 600 + j * 4, 5);
                    this._particles.push(p);
                    temp.push(p);
                }
            }
        }
        this._rigids.push(new RigidBody(temp, new Vec2(8, 8)));

        this._forces.push(new LinearForce(this._particles, new Vec2(0, -this.gravityConst)));
        this._forces.push(new PressureForce(this._particles));
        this._forces.push(new ViscosityForce(this._particles, this.viscosity));
        this._forces.push(new SurfaceForce(this._particles));
    }

    initWaterRigid() {
        this.clear();
        this.numParticles = 250;
        this.viscosity = 200 * 5;

        // Set starting positions
        let k = 0;
        let j = 0;

        for (let i = 0; i < this.numParticles; i++) {
            if (i % 40 === 0) {
                k++;
                j = 0;
            }
            j++;

            this._particles.push(new Particle(100 + k * this._h / 1.3, 256 + j * this._h / 1.3, this._mass));
        }

        let temp: Particle[] = [];
        for (k = 0; k < 50; k++) {
            let p = new Particle(10 + 10 * k, 10, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(10, 10 + 10 * k, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(500, 10 + 10 * k, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        this._solids.push(new SolidBody(temp));

        temp = [];
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 5) { // Does this make any sense ? :-)
            let p = new Particle(300 + Math.cos(i) * 20, 400 + Math.sin(i) * 20, this._mass);
            this._particles.push(p);
            temp.push(p);
        }
        this._rigids.push(new RigidBody(temp, new Vec2(45, 45)));

        this._forces.push(new LinearForce(this._particles, new Vec2(0, -this.gravityConst)));
        this._forces.push(new PressureForce(this._particles));
        this._forces.push(new ViscosityForce(this._particles, this.viscosity));
        this._forces.push(new SurfaceForce(this._particles));
    }

    applyForces() {
        // Calculate density and pressure
        for (let i = 0; i < this._particles.length; i++) {

            let density = 0;

            for (let j = 0 ; j < this._particles.length; j++) {
                let diffVec = this._particles[i].pos.subtract(this._particles[j].pos);
                density += this.particles[j].mass * Poly6.W(diffVec, this._h);
            }

            if (!this._particles[i].rigid && !this._particles[i].solid) {
                this._particles[i].density = density;
            }
            this._particles[i].pressure = this.k * (density - this.restDensity);
            this._particles[i].force.x = 0;
            this._particles[i].force.y = 0;
        }

        for (let f of this._forces) {
            f.apply(this._h);
        }
    }

    applyRigid() {
        for (let r of this._rigids) {

            let forceSum = new Vec2(0, 0);
            let torque = new Vec2(0, 0);

            if (r.selected) {
                for (const p of r.particles) {
                    p.force = forceSum;
                    p.vel = forceSum;
                }
                continue;
            }

            for (let p of r.particles) {
                forceSum = forceSum.add(p.force);
            }

            forceSum = forceSum.scale(1 / r.particles.length);

            // Total force
            for (let p of r.particles) {
                p.force = forceSum;
            }
        }
    }

    step() {
        this.applyForces();
        this.applyRigid();
        LeapFrog.step(this._particles, this.dt);
    }
}
