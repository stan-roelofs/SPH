class Particle {
    get rigid(): boolean {
        return this._rigid;
    }

    set rigid(value: boolean) {
        this._rigid = value;
    }
    set solid(value: boolean) {
        this._solid = value;
    }
    get solid(): boolean {
        return this._solid;
    }
    get density(): number {
        return this._density;
    }

    set density(value: number) {
        this._density = value;
    }
    get pressure(): number {
        return this._pressure;
    }

    set pressure(value: number) {
        this._pressure = value;
    }
    get force(): Vec2 {
        return this._force;
    }

    set force(value: Vec2) {
        this._force = value;
    }
    get mass(): number {
        return this._mass;
    }

    set mass(value: number) {
        this._mass = value;
    }
    get vel(): Vec2 {
        return this._vel;
    }

    set vel(value: Vec2) {
        this._vel = value;
    }
    get pos(): Vec2 {
        return this._pos;
    }

    set pos(value: Vec2) {
        this._pos = value;
    }

    private _pos: Vec2;
    private _vel: Vec2;
    private _mass: number;
    private _force: Vec2;
    private _pressure: number;
    private _density: number;
    private _solid: boolean;
    private _rigid: boolean;

    private readonly size: number = 8;

    constructor(x: number, y: number, mass: number = 1, solid: boolean = false, rigid: boolean = false) {
        this._pos = new Vec2(x, y);
        this._vel = new Vec2(0, 0);
        this._mass = mass;
        this._force = new Vec2(0, 0);
        this._pressure = 0;
        this._density = 0;
        this._solid = solid;
        this._rigid = rigid;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
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