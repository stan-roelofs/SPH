class Poly6 {

    private static constant = 315 / (64 * Math.PI);

    static W(r: Vec2, h: number): number {
        if (0 <= r.norm() && r.norm() <= h) {
            return (this.constant / Math.pow(h, 9)) * Math.pow((Math.pow(h, 2) - Math.pow(r.norm(), 2)), 3);
        }
        return 0;
    }
}

class Spiky {

    private static constant = - 45 / Math.PI;

    static Wd(r: Vec2, h: number): Vec2 {
        if (0 < r.norm() && r.norm() <= h) {
            const temp = (this.constant / Math.pow(h, 6)) * Math.pow(h - r.norm(), 3) / r.norm();
            return r.scale(temp);
        }
        return new Vec2(0, 0);
    }
}

class Viscosity {

    private static constant = 45 / Math.PI;

    static Wd2(r: Vec2, h: number): number {
        if (0 < r.norm() && r.norm() <= h) {
            return (this.constant / Math.pow(h, 6)) * (h - r.norm());
        }
        return 0;
    }
}