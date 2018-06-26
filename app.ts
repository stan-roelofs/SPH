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
    const canvas = document.getElementById("cnvs") as HTMLCanvasElement;
    const log = document.getElementById("console") as HTMLDivElement;

    print("Press 1-9 to select presets");
    print("Press space to pause");
    print("Press n and m to decrease/increase the mass of rigid bodies");

    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = 512;
    canvas.width = 512;

    const ctx = canvas.getContext("2d");

    let fluid = new Fluid();

    let pause = true;
    let selected: RigidBody = undefined;
    let oldPos: Vec2 = new Vec2(0, 0);

    canvas.onmouseup = function(e) {
        if (selected === undefined) {
            return;
        }
        selected.selected = false;
        selected = undefined;
    };

    canvas.onmousemove = function(e) {
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

    canvas.onmousedown = function(e) {
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
                } else {
                    break;
                }
            }
        }
    };

    // Register key presses
    document.onkeyup = function(e) {
        switch(e.key) {
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
        ctx.fillStyle = "rgba(255, 255, 255, 1)";               // Set color to white
        ctx.fillRect(0, 0, canvas.width, canvas.height);  // Fill canvas with white

        // Draw particles
        for (let p of fluid.particles) {
            p.draw(ctx);
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    function print(text: string) {
        log.innerHTML += text + "<BR>";
    }
};