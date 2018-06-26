window.onload = () => {
    const canvas = document.getElementById("cnvs") as HTMLCanvasElement;
    const log = document.getElementById("console") as HTMLDivElement;
    const sliderH = document.getElementById("sliderH") as HTMLInputElement;
    const sliderHVal = document.getElementById("sliderHVal") as HTMLDivElement;
    const sliderMass = document.getElementById("sliderMass") as HTMLInputElement;
    const sliderMassVal = document.getElementById("sliderMassVal") as HTMLDivElement;

    print("Press 1-9 to select presets");
    print("Press space to pause");
    print("Press n and m to decrease/increase the mass of rigid bodies");
    print("Click and drag rigid bodies to move them");

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
        updateOptions();
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

    function updateOptions() {
        sliderHVal.innerHTML = fluid.h.toString();
        sliderMassVal.innerHTML = fluid.mass.toString();
    }

    function print(text: string) {
        log.innerHTML += text + "<BR>";
    }

    sliderH.oninput = function() {
        fluid.h = parseInt(sliderH.value);
    };
    sliderMass.oninput = function() {
        fluid.mass = parseInt(sliderMass.value);
    };
};