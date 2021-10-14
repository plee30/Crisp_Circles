title = "Plonk";

description = `
[TAP] the
 targets
`;

characters = [
`
  rr
 rccr
rcrrcr
rcrrcr
 rccr
  rr
`,
`
      
      
  ll  
  ll


`
];

const G = {
  WIDTH: 100,
  HEIGHT: 50,
  REMAINING: 20,
  SPEED: 1
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  seed: 2,
  isPlayingBgm: true,
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2,
  theme: "dark"
};

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */
/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} Target
 */
/**
 * @type { Target [] }
 */
let targets;

/**
 * @typedef {{
 * pos: Vector,
 * }} Crosshair
 */
/**
 * @type { Crosshair }
 */
let crosshair;

let targetScore = 1000;

function update() {
  if (!ticks) {
    // Player Initalization
    player = {
      pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5)
    };
    crosshair = {
      pos: vec(G.WIDTH * 0.5 - 2, G.HEIGHT * 0.5)
    };

    targets = [];
  }
  //text("hello", G.WIDTH/2, G.HEIGHT/2);
  color("black");
  char("b", crosshair.pos);
  //color("blue");
  //box(player.pos, 1);
  player.pos = vec(input.pos.x, input.pos.y);
  player.pos.clamp(G.WIDTH/2 - 4, G.WIDTH/2, G.HEIGHT/2 - 2, G.HEIGHT/2 + 2);

  // Spawning Targets
  if (targets.length === 0) {
    const posX = rnd(0, G.WIDTH);
    const posY = rnd(G.HEIGHT/10, G.HEIGHT);
    targets.push({ 
      pos: vec(posX, posY)
    });
  }

  //color("black");
  //char("a", target.pos);
  if (targetScore > 50) {
    targetScore -= 5;
  }
  remove(targets, (t) => {
    color("black");
    char("a", t.pos);
    //color("red");
    color("transparent");
    const isCollidingWithPlayer = box(player.pos, 2).isColliding.char.a;
    //const isCollidingWithCrosshair = char.b.isColliding.char.a;
    if (input.isJustPressed) {
      if (isCollidingWithPlayer || t.pos == crosshair.pos) {
        color("red");
        particle(t.pos);
        color("blue");
        particle(t.pos);
        play("hit");
        G.REMAINING--;
        addScore(targetScore);
        targetScore = 1000;
        return(isCollidingWithPlayer);
      } 
      else {
        play("select");
        if (targetScore > 50) {
          targetScore -= 50;
        }
      }
    }
    if (player.pos.x == G.WIDTH/2 - 4) {
      t.pos.x += G.SPEED;
    }
    if (player.pos.x == G.WIDTH/2) {
      t.pos.x -= G.SPEED;
    }
    if (player.pos.y == G.HEIGHT/2 - 2) {
      t.pos.y += G.SPEED/2;
    }
    if (player.pos.y == G.HEIGHT/2 + 2) {
      t.pos.y -= G.SPEED/2;
    }
    t.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
  });

  color("green");
  text(G.REMAINING.toString(), 3, 10);
  if (G.REMAINING == 0 ) {
    end();
    G.REMAINING = 20;
  }
}
