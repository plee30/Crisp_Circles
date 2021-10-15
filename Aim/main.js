// From https://stackoverflow.com/questions/609965/detecting-when-the-mouse-is-not-moving
var timeout;
var directionX = "";
var directionY = "";
document.onmousemove = function(){
  clearTimeout(timeout);
  timeout = setTimeout(function(){directionX = "still"; directionY = "still";}, 100);
}
// From https://stackoverflow.com/questions/24294452/detect-mouse-direction-javascript
var oldX = 0,
    oldY = 0,
mousemovemethod = function (e) {
    
  if (e.pageY < oldY - 2) {
    directionY = "up"
  } else if (e.pageY > oldY + 2) {
    directionY = "down"
  }
  if (e.pageX < oldX - 1) {
    directionX = "left"
  } else if (e.pageX > oldX + 1) {
    directionX = "right"
  }
        
  oldX = e.pageX;
  oldY = e.pageY;
        
}
document.addEventListener('mousemove', mousemovemethod);


title = "Plonk";

description = `
     Move with mouse
    [Click the mouse] 
    when the white box
 collides with the target
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
  WIDTH: 200,
  HEIGHT: 100,
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
 * }} Star
 */
/**
 * @type  { Star [] }
 */
let stars;

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
    stars = times(20, () => {
      // Random number generator function
      // rnd( min, max )
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      // An object of type Star with appropriate properties
      return {
        // Creates a Vector
        pos: vec(posX, posY),
      };
    });
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
  player.pos.clamp(G.WIDTH/2 - 8, G.WIDTH/2 + 5, G.HEIGHT/2 - 6, G.HEIGHT/2 + 8);

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
    targetScore -= 1;
  }

  // Spawning Stars
  stars.forEach((s) => {
    /*
    if (directionY === "up") {
      s.pos.y += G.SPEED / 2;
    }
    if (directionY === "down") {
      s.pos.y -= G.SPEED / 2;
    }
    if (directionX === "left") {
      s.pos.x += G.SPEED / 2;
    }
    if (directionX === "right") {
      s.pos.x -= G.SPEED / 2;
    }
    if (directionX === "still" && directionY === "still") {
      s.pos.x += 0;
      s.pos.y += 0;
    }*/
    if (player.pos.y == G.HEIGHT/2 - 6) {
      s.pos.y += G.SPEED / 1.5;
    }
    if (player.pos.y == G.HEIGHT/2 + 8) {
      s.pos.y -= G.SPEED / 1.5;
    }
    if (player.pos.x == G.WIDTH/2 - 8) {
      s.pos.x += G.SPEED;
    }
    if (player.pos.x == G.WIDTH/2 + 5) {
      s.pos.x -= G.SPEED;
    }
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("light_black");
    // Draw the star as a square of size 1
    box(s.pos, 2, 3);
  });

  remove(targets, (t) => {
    color("black");
    char("a", t.pos);
    color("red");
    box(player.pos, 4);
    //color("transparent");
    //const isCollidingWithPlayer = box(player.pos, 3).isColliding.char.a;
    //const isCollidingWithCrosshair = char("b", G.WIDTH * 0.5 - 2, G.HEIGHT * 0.5).isColliding.char.a;
    if (input.isJustPressed) {
      if (char("b", G.WIDTH * 0.5 - 2, G.HEIGHT * 0.5).isColliding.char.a) {
      // if (isCollidingWithCrosshair || t.pos == crosshair.pos) {
        color("red");
        particle(t.pos);
        color("blue");
        particle(t.pos);
        play("hit");
        play("coin");
        G.REMAINING--;
        addScore(targetScore);
        targetScore = 1000;
        //return(isCollidingWithCrosshair);
        return (true);
      } 
      else {
        play("select");
        if (targetScore > 50) {
          targetScore -= 50;
        }
      }
    }
    // G.WIDTH/2 - 8, G.WIDTH/2 + 5, G.HEIGHT/2 - 6, G.HEIGHT/2 + 8
    if (player.pos.y == G.HEIGHT/2 - 6) {
      t.pos.y += G.SPEED / 1.5 ;
    }
    if (player.pos.y == G.HEIGHT/2 + 8) {
      t.pos.y -= G.SPEED / 1.5;
    }
    if (player.pos.x == G.WIDTH/2 - 8) {
      t.pos.x += G.SPEED;
    }
    if (player.pos.x == G.WIDTH/2 + 5) {
      t.pos.x -= G.SPEED;
    }
    /*
    if (directionY === "up") {
      t.pos.y += G.SPEED / 1.5 * speedForceY;
    }
    if (directionY === "down") {
      t.pos.y -= G.SPEED / 1.5 * speedForceY;
    }
    if (directionX === "left") {
      t.pos.x += G.SPEED * speedForceX;
    }
    if (directionX === "right") {
      t.pos.x -= G.SPEED * speedForceX;
    }
    if (directionX === "still" && directionY === "still") {
      t.pos.x += 0;
      t.pos.y += 0;
    }*/

    t.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
    
  });

  color("green");
  text(G.REMAINING.toString(), 3, 10);
  if (G.REMAINING == 0 ) {
    end();
    G.REMAINING = 20;
  }
}
