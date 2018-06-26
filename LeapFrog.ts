class LeapFrog {
    static step(particles: Particle[], dt: number): Vec2[] {
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