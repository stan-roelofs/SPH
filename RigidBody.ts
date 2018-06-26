class RigidBody {
    get centerMass(): Vec2 {
        return this._centerMass;
    }
    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        this._selected = value;
    }
    get particles(): Particle[] {
        return this._particles;
    }
    private _particles: Particle[];
    private _selected: boolean;
    private _centerMass: Vec2;

    constructor(particles: Particle[], center: Vec2) {
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