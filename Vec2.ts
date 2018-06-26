class Vec2 {
    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public multiply(other: Vec2): Vec2 {
        return new Vec2(this._x * other.x, this._y * other.y);
    }

    public divide(other: Vec2): Vec2 {
        return new Vec2(this._x / other.x, this._y / other.y);
    }

    public scale(factor: number): Vec2 {
        return new Vec2(this.x * factor, this.y * factor);
    }

    public add(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    public subtract(other: Vec2): Vec2 {
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    public norm(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}