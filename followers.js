class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(p) {
    return Math.sqrt((p.y - this.y) ** 2 + (p.x - this.x) ** 2);
  }

  angleTo(p) {
    return Math.atan2(this.y - p.y, this.x - p.x);
  }

  move(dx, dy) {
    return new Point(this.x + dx, this.y + dy);
  }
}

function loop(func) {
  let t1;
  function iteration(t2) {
    if (t1 === undefined) {
      t1 = t2;
      requestAnimationFrame(iteration);
      return;
    }
    const dt = t2 - t1;
    t1 = t2;
    func(dt);
    requestAnimationFrame(iteration);
  }
  requestAnimationFrame(iteration);
}

function mouse() {
  let p = new Point(0, 0);

  window.addEventListener("mousemove", function (e) {
    p = new Point(e.pageX, e.pageY);
  });

  return {
    pos() {
      return p;
    },
  };
}

// Have one thing that follows the mouse
let thing = follower(mouse());

// Have N things that follow the thing N-1
for (let i = 0; i < 50; i++) {
  thing = follower(thing);
}

function follower(thing) {
  const me = document.createElement("div");
  document.body.appendChild(me);
  Object.assign(me.style, {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "black",
  });

  function clamp(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  }

  let p = new Point(Math.random() * 500, Math.random() * 500);

  loop(function (dt) {
    const maxSpeed = 1000;
    const a = (maxSpeed - 5) / (100 - 20);
    const b = 5 - 20 * a;

    const speed = clamp(a * thing.pos().distanceTo(p) + b, -5, maxSpeed);
    const angle = thing.pos().angleTo(p);

    const dx = speed * Math.cos(angle) * (dt / 1000);
    const dy = speed * Math.sin(angle) * (dt / 1000);

    p = p.move(dx, dy);
    Object.assign(me.style, {
      left: p.x + "px",
      top: p.y + "px",
    });
  });

  return {
    pos() {
      return p;
    },
  };
}
