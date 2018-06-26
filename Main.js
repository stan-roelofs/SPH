class Solver {
    static derivEval(particles) {
        const temp = [];
        for (const p of particles) {
            temp.push(p.vel);
            const massVec = new Vec2(p.density, p.density);
            temp.push(p.force.divide(massVec).scale(-1));
        }
        return temp;
    }
    static getState(particles) {
        const temp = [];
        for (const p of particles) {
            temp.push(p.pos);
            temp.push(p.vel);
        }
        return temp;
    }
    static setState(particles, src) {
        for (let i = 0; i < particles.length; i++) {
            particles[i].oldPos = particles[i].pos;
            particles[i].oldVel = particles[i].vel;
            particles[i].oldAcc = particles[i].force.divide(new Vec2(particles[i].density, particles[i].density)).scale(-1);
            particles[i].pos = src[2 * i];
            particles[i].vel = src[2 * i + 1];
        }
    }
    static clearForces(particles) {
        for (const p of particles) {
            p.force.x = 0;
            p.force.y = 0;
        }
    }
    static applyForces(particles, forces) {
        // Calculate densities and pressures
        for (const p of particles) {
            let density = 0;
            for (const p2 of particles) {
                density += p2.mass * Poly6.W(p.pos.subtract(p2.pos));
            }
            p.density = density;
            p.pressure = Constants.STIFFNESS * (density - Constants.REST_DENSITY);
        }
        for (const f of forces) {
            f.apply();
        }
    }
    static scaleList(list, factor) {
        let result = [];
        for (const entry of list) {
            result.push(entry.scale(factor));
        }
        return result;
    }
    static addLists(list1, list2) {
        let result = [];
        for (let i = 0; i < list1.length; i++) {
            result.push(new Vec2(list1[i].x + list2[i].x, list1[i].y + list2[i].y));
        }
        return result;
    }
}
///<reference path="Solver.ts"/>
class EulerSolver extends Solver {
    step(particles, forces, dt) {
        Solver.clearForces(particles);
        Solver.applyForces(particles, forces);
        const temp1 = Solver.derivEval(particles);
        const temp2 = EulerSolver.scaleList(temp1, dt);
        const temp3 = Solver.getState(particles);
        const temp4 = EulerSolver.addLists(temp2, temp3);
        EulerSolver.setState(particles, temp4);
        for (let p of particles) {
            if (p.pos.y > 512) {
                p.pos.y = 512;
                p.vel.y *= -0.7;
            }
            if (p.pos.x < 0) {
                p.pos.x = 0;
                p.vel.x *= -0.7;
            }
            if (p.pos.x > 512) {
                p.pos.x = 512;
                p.vel.x *= -0.7;
            }
        }
    }
}
class Fluid {
    constructor() {
        this._particles = [];
        this._forces = [];
        this._rigids = [];
        this._solids = [];
        // Physical attrs
        this.numParticles = 250;
        this.viscosity = 500 * 5;
        this.particleMass = 500 * .13;
        this.h = 18;
        this.k = 400 * 5;
        this.restDensity = 998;
        this.gravityConst = 120000 * 9.82;
        this.dt = 0.0004;
        this._particles = [];
        this.initWater();
    }
    get rigids() {
        return this._rigids;
    }
    get particles() {
        return this._particles;
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
        this.viscosity = 700 * 5;
        // Set starting positions
        let k = 0;
        let j = 0;
        for (let i = 0; i < this.numParticles; i++) {
            if (i % 20 === 0) {
                k++;
                j = 0;
            }
            j++;
            this._particles.push(new Particle(100 + j * this.h / 2, 300 + k * this.h / 2, this.particleMass));
        }
        let temp = [];
        for (k = 0; k < 100; k++) {
            let p = new Particle(10 + 5 * k, 10, this.particleMass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(10, 10 + 10 * k, this.particleMass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(500, 10 + 10 * k, this.particleMass);
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
        this.viscosity = 400 * 5;
        // Set starting positions
        let k = 0;
        let j = 0;
        for (let i = 0; i < this.numParticles; i++) {
            if (i % 20 === 0) {
                k++;
                j = 0;
            }
            j++;
            this._particles.push(new Particle(50 + 2 * j * this.h / 2, 450 + 2 * k * this.h / 2, this.particleMass));
        }
        let temp = [];
        for (k = 0; k < 50; k++) {
            let p = new Particle(10 + 10 * k, 10, this.particleMass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(10, 10 + 10 * k, this.particleMass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(500, 10 + 10 * k, this.particleMass);
            this._particles.push(p);
            temp.push(p);
        }
        this._solids.push(new SolidBody(temp));
        temp = [];
        for (let i = 0; i < 46; i++) {
            let p = new Particle(5 * i, 500 - 5 * i, this.particleMass);
            this._particles.push(p);
            temp.push(p);
        }
        for (let i = 0; i < 46; i++) {
            let p = new Particle(512 - 5 * i, 500 - 5 * i, this.particleMass);
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
                }
                else if (j == 0 || j == 4) {
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
            this._particles.push(new Particle(100 + k * this.h / 1.3, 256 + j * this.h / 1.3, this.particleMass));
        }
        let temp = [];
        for (k = 0; k < 50; k++) {
            let p = new Particle(10 + 10 * k, 10, this.particleMass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(10, 10 + 10 * k, this.particleMass);
            this._particles.push(p);
            temp.push(p);
        }
        for (k = 0; k < 50; k++) {
            let p = new Particle(500, 10 + 10 * k, this.particleMass);
            this._particles.push(p);
            temp.push(p);
        }
        this._solids.push(new SolidBody(temp));
        temp = [];
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 5) { // Does this make any sense ? :-)
            let p = new Particle(300 + Math.cos(i) * 20, 400 + Math.sin(i) * 20, this.particleMass);
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
            for (let j = 0; j < this._particles.length; j++) {
                let diffVec = this._particles[i].pos.subtract(this._particles[j].pos);
                density += this.particles[j].mass * Poly6.W(diffVec, this.h);
            }
            if (!this._particles[i].rigid && !this._particles[i].solid) {
                this._particles[i].density = density;
            }
            this._particles[i].pressure = this.k * (density - this.restDensity);
            this._particles[i].force.x = 0;
            this._particles[i].force.y = 0;
        }
        for (let f of this._forces) {
            f.apply(this.h);
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
    // Leapfrog
    step() {
        this.applyForces();
        this.applyRigid();
        LeapFrog.step(this._particles, this.dt);
    }
}
class Force {
    constructor(particles) {
        this.particles = [];
        for (const p of particles) {
            this.particles.push(p);
        }
    }
}
class Poly6 {
    static W(r, h) {
        if (0 <= r.norm() && r.norm() <= h) {
            return (this.constant / Math.pow(h, 9)) * Math.pow((Math.pow(h, 2) - Math.pow(r.norm(), 2)), 3);
        }
        return 0;
    }
}
Poly6.constant = 315 / (64 * Math.PI);
class Spiky {
    static Wd(r, h) {
        if (0 < r.norm() && r.norm() <= h) {
            const temp = (this.constant / Math.pow(h, 6)) * Math.pow(h - r.norm(), 3) / r.norm();
            return r.scale(temp);
        }
        return new Vec2(0, 0);
    }
}
Spiky.constant = -45 / Math.PI;
class Viscosity {
    static Wd2(r, h) {
        if (0 < r.norm() && r.norm() <= h) {
            return (this.constant / Math.pow(h, 6)) * (h - r.norm());
        }
        return 0;
    }
}
Viscosity.constant = 45 / Math.PI;
class LeapFrog {
    static step(particles, dt) {
        let result = [];
        for (let i = 0; i < particles.length; i++) {
            let newPos = particles[i].force.scale((dt * dt) / (2 * particles[i].density));
            newPos = newPos.add(particles[i].vel.scale(dt));
            newPos = newPos.add(particles[i].pos);
            let newVel = newPos.subtract(particles[i].pos);
            newVel = newVel.scale(1 / dt);
            if (!particles[i].solid) {
                particles[i].pos = newPos;
                particles[i].vel = newVel;
            }
            result.push(particles[i].pos);
        }
        return result;
    }
}
class LinearForce extends Force {
    constructor(particles, force) {
        super(particles);
        this.force = force;
    }
    apply(h) {
        for (const p of this.particles) {
            p.force = p.force.add(this.force.scale(p.density));
        }
    }
    draw() {
    }
}
class Particle {
    constructor(x, y, mass = 1, solid = false, rigid = false) {
        this.size = 8;
        this._pos = new Vec2(x, y);
        this._vel = new Vec2(0, 0);
        this._mass = mass;
        this._force = new Vec2(0, 0);
        this._pressure = 0;
        this._density = 0;
        this._solid = solid;
        this._rigid = rigid;
    }
    get rigid() {
        return this._rigid;
    }
    set rigid(value) {
        this._rigid = value;
    }
    set solid(value) {
        this._solid = value;
    }
    get solid() {
        return this._solid;
    }
    get density() {
        return this._density;
    }
    set density(value) {
        this._density = value;
    }
    get pressure() {
        return this._pressure;
    }
    set pressure(value) {
        this._pressure = value;
    }
    get force() {
        return this._force;
    }
    set force(value) {
        this._force = value;
    }
    get mass() {
        return this._mass;
    }
    set mass(value) {
        this._mass = value;
    }
    get vel() {
        return this._vel;
    }
    set vel(value) {
        this._vel = value;
    }
    get pos() {
        return this._pos;
    }
    set pos(value) {
        this._pos = value;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, " + Math.min(this.density * 3000, 255).toString() + ", 1)";
        if (this.solid) {
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
        }
        if (this.rigid) {
            ctx.fillStyle = "rgba(0," + Math.max(50, (255 - this._mass)).toString() + ", 0, 1)";
        }
        ctx.arc(this._pos.x, 512 - this._pos.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}
class PressureForce extends Force {
    constructor(particles) {
        super(particles);
    }
    apply(h) {
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
class RigidBody {
    get centerMass() {
        return this._centerMass;
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
    }
    get particles() {
        return this._particles;
    }
    constructor(particles, center) {
        this._particles = [];
        for (const p of particles) {
            this._selected = false;
            p.rigid = true;
            p.density = 0.01;
            this._particles.push(p);
            this._centerMass = center;
        }
    }
    decMass() {
        for (const p of this.particles) {
            p.mass -= 10;
            if (p.mass <= 5) {
                p.mass = 5;
            }
        }
    }
    incMass() {
        for (const p of this.particles) {
            p.mass += 10;
        }
    }
}
class Simulation {
    get particles() {
        return this._particles;
    }
    set height(value) {
        this._height = value;
    }
    set width(value) {
        this._width = value;
    }
    constructor(w, h) {
        this._particles = [];
        this.forces = [];
        this._width = w;
        this._height = h;
        this._solver = new LeapFrog();
    }
    addParticle(x, y) {
        this._particles.push(new Particle(x, y));
    }
    addForce(force) {
        this.forces.push(force);
    }
    step() {
        this._solver.step(this._particles, this.forces, Constants.TIMESTEP);
    }
    draw(ctx) {
        for (const p of this._particles) {
            p.draw(ctx);
        }
    }
}
class SolidBody {
    get particles() {
        return this._particles;
    }
    constructor(particles) {
        this._particles = [];
        for (const p of particles) {
            p.solid = true;
            p.density = 0.05;
            this._particles.push(p);
        }
    }
}
class SurfaceForce extends Force {
    constructor(particles) {
        super(particles);
    }
    apply(h) {
        //TODO
    }
    draw() {
    }
}
class Vec2 {
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    multiply(other) {
        return new Vec2(this._x * other.x, this._y * other.y);
    }
    divide(other) {
        return new Vec2(this._x / other.x, this._y / other.y);
    }
    scale(factor) {
        return new Vec2(this.x * factor, this.y * factor);
    }
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}
class ViscosityForce extends Force {
    constructor(particles, viscosity) {
        super(particles);
        this.viscosity = viscosity;
    }
    apply(h) {
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
                force = force.add(tempVel.scale(1 / this.particles[j].density)
                    .scale(this.viscosity * this.particles[j].mass * Wd2));
            }
            this.particles[i].force = this.particles[i].force.add(force);
        }
    }
    draw() {
    }
}
/*window.onload = () => {
    const canvas = document.getElementById("cnvs") as HTMLCanvasElement;

    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = 512;
    canvas.width = 512;

    const ctx = canvas.getContext("2d");

    const sim = new Simulation(width, height);

    let j = 0;
    let k = 0;
    for (let i = 0; i < Constants.NUMBER_PARTICLES; i++) {
        if (i % 40 == 0) {
            k++;
            j = 0;
        }
        j++;

        sim.addParticle(100 + j * Constants.KERNEL_RANGE / 2, 250 + k * Constants.KERNEL_RANGE / 2);
    }

    sim.addForce(new LinearForce(sim.particles, new Vec2(0, Constants.GRAVITY)));
    sim.addForce(new PressureForce(sim.particles));
    //sim.addForce(new ViscosityForce(sim.particles));

    function loop(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        sim.step();
        sim.draw(ctx);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
};
*/
window.onload = () => {
    const canvas = document.getElementById("cnvs");
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = 512;
    canvas.width = 512;
    const ctx = canvas.getContext("2d");
    let fluid = new Fluid();
    let pause = true;
    let selected = undefined;
    let oldPos = new Vec2(0, 0);
    canvas.onmouseup = function (e) {
        if (selected === undefined) {
            return;
        }
        selected.selected = false;
        selected = undefined;
    };
    canvas.onmousemove = function (e) {
        if (selected !== undefined) {
            const x = e.clientX - canvas.offsetLeft;
            const y = 512 - e.clientY - canvas.offsetTop;
            const dx = x - oldPos.x;
            const dy = y - oldPos.y;
            for (const p of selected.particles) {
                p.pos.x += dx;
                p.pos.y += dy;
            }
            oldPos.x = x;
            oldPos.y = y;
        }
    };
    canvas.onmousedown = function (e) {
        const x = e.clientX - canvas.offsetLeft;
        const y = 512 - e.clientY - canvas.offsetTop;
        for (let r of fluid.rigids) {
            for (let p of r.particles) {
                if (selected === undefined) {
                    const distance = new Vec2(x - p.pos.x, y - p.pos.y);
                    if (distance.norm() < 10) {
                        selected = r;
                        r.selected = true;
                        oldPos.x = p.pos.x;
                        oldPos.y = p.pos.y;
                        break;
                    }
                }
                else {
                    break;
                }
            }
        }
    };
    // Register key presses
    document.onkeyup = function (e) {
        switch (e.key) {
            case ' ':
                pause = !pause;
                break;
            case '1':
                fluid.initWater();
                break;
            case '2':
                fluid.initFunnel();
                break;
            case '3':
                fluid.initWaterRigid();
                break;
            case 'm':
                fluid.rigids[0].incMass();
                break;
            case 'n':
                fluid.rigids[0].decMass();
                break;
        }
    };
    // Start rendering loop
    function loop() {
        if (!pause) {
            fluid.step(); // If paused only draw, don't step
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.fillStyle = "rgba(255, 255, 255, 1)"; // Set color to white
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with white
        // Draw particles
        for (let p of fluid.particles) {
            p.draw(ctx);
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
};
//# sourceMappingURL=Main.js.map