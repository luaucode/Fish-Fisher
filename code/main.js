import kaboom from "kaboom";

// initialize context
kaboom();

// load assets
loadSprite("ocean", "sprites/ocean.gif");
loadSprite("title", "sprites/fishfisher.png");
loadSprite("bubble", "sprites/bubbles.png");
loadSprite("space", "sprites/space.png");
loadSprite("lost", "sprites/lost.png");

// fish
loadSprite("schnoz", "sprites/schnoz.png");
loadSprite("smackers", "sprites/smackers.png");
loadSprite("steven", "sprites/steven.png");
loadSprite("larold", "sprites/larold.png");
loadSprite("salvador", "sprites/salvador.png");

// enemies
loadSprite("carrageenan", "sprites/carrageenan.png");
loadSprite("plastic", "sprites/plastic.png");
loadSprite("shawn", "sprites/shawn.png");

// hook
loadSprite("hook", "sprites/hook.png");
loadSprite("hookline", "sprites/hookline.png");

// music
loadSound("title", "sounds/title.wav")
loadSound("game", "sounds/game.wav")
loadSound("loser", "sounds/loser.wav")

// sfx
loadSound("shawnattack", "sounds/shawnattack.mp3")
loadSound("piranha", "sounds/piranha.mp3")
loadSound("plastic", "sounds/plastic.mp3")
loadSound("fish", "sounds/fish.mp3")

// initialize constants
const SWIM_SPEED = width() / 3.5;
const FISH_LIST = ["schnoz", "smackers", "steven", "larold", "salvador"];
const FISH_LENGTH = FISH_LIST.length;

// game constants
const MAXHEALTH = 15;
const HOOK_SPEED = width() / 3;
const CARRAGEENAN_SPEED = height() / 2;
const PLASTIC_SPEED = height() / 2.5;
const SHAWN_SPEED = height() / 1.5;
const FRIEND_SPEED = height() / 3;

// points
let points = 0;

// music
const titleMusic = play("title", {
	volume: 0.8,
	loop: true,
});

const gameMusic = play("game", {
	volume: 0.8,
	loop: true,
});

const loseMusic = play("loser", {
	volume: 0.8,
	loop: false,
});

const shawnAttack = play("shawnattack", {
	volume: 0.5,
	loop: false,
});

// initialize scene
scene("title", () => {
	titleMusic.play();
	gameMusic.pause();
	loseMusic.pause();
	shawnAttack.pause();
	
	// add background
	add([
		rect(width(), height()),
		color(100, 210, 240),
	]);
	
	// add background ocean
	add([
		sprite("ocean"),
		scale((height() + width()) / 600),
		pos(width() / 2, height() / 2),
		origin("center"),
		opacity(0.2),
	]);
	
	// add bubbles floating upward
	loop(0.4, () => {
		add([
			sprite("bubble"),
			origin("top"),
			opacity(0.45),
			area(),
			scale(height() / randi(130, 230)),
			pos(randi(20, width() - 20), height()),
			move(UP, SWIM_SPEED),
			cleanup(),
		]);
	});
	
	// add title
	add([
		sprite("title"),
		origin("top"),
		scale(height() / 2200),
		pos(width() / 2, height() / 15),
	]);

	// add play button
	add([
		sprite("space"),
		origin("bot"),
		scale(height() / 600),
		pos(width() / 2, height() - height() / 9),
		area(),
		"play",
	]);
	
	// add fish to swim across screen
	loop(3.5, () => {
		add([
			sprite(FISH_LIST[randi(0, FISH_LENGTH)]),
			origin("right"),
			area(),
			opacity(0.95),
			scale(height() / 100),
			pos(0, randi(20, height() - 20)),
			move(RIGHT, SWIM_SPEED),
			cleanup(),
		]);
	});

	// keyPress to switch to game scene
	keyPress("space", () => {
		go("game");
	});
});

scene("game", () => {
	loseMusic.pause();
	titleMusic.pause();
	gameMusic.play();

	points = 0;
	
	// add background
	add([
		rect(width(), height()),
		color(100, 210, 240),
	]);

	// add background ocean
	add([
		sprite("ocean"),
		scale((height() + width()) / 600),
		pos(width() / 2, height() / 2),
		origin("center"),
		opacity(0.2),
	]);

	//add hook
	const hook = add([
		sprite("hook"),
		scale(height() / 60),
		pos(width() / 2, height() / 2 - (height() / 60)),
		origin("bot"),
		area(),
		"hook",
	]);

	// add hook health
	hook.health = MAXHEALTH;

	const hookline = add([
		sprite("hookline"),
		scale(height() / 60),
		pos(width() / 2, height() / 2),
		origin("bot"),
	]);

	// add health bar
	add([
		rect(width() / 4, height() / 60),
		pos(20, 20),
		color(70, 70, 70),
	]);
	
	const healthBar = add([
		rect(width() / 4, height() / 60),
		pos(20, 20),
		color(100, 245, 150),
	]);

	healthBar.action(() => {
		healthBar.width = (width()/4) / MAXHEALTH * hook.health;
		if (hook.health <= 0) {
			go("lose");
		} else if (hook.health <= MAXHEALTH / 5) {
			healthBar.color = rgb(255, 107, 107);
		} else if (hook.health <= MAXHEALTH / 3) {
			healthBar.color = rgb(255, 217, 61);
		} else {
			healthBar.color = rgb(100, 245, 150);
		}
	});

	// add score
	const score = add([
		text("Score: 0"),
		pos(width() - 20, 30),
		scale(0.5),
		origin("right"),
	]);

	score.action(() => {
		score.text = "Score: " + points
	});

	// hook movement
	keyDown("left", () => {
		hook.move(-HOOK_SPEED, 0);
		hookline.move(-HOOK_SPEED, 0);
	});

	keyDown("right", () => {
		hook.move(HOOK_SPEED, 0);
		hookline.move(HOOK_SPEED, 0);
	});

	keyDown("r", () => {
		go("game");
	});

	// add piranha
	wait(rand(0.5, 3), () => {
		loop(rand(2.5, 4), () => {
			add([
				sprite("carrageenan"),
				origin("top"),
				opacity(0.9),
				area(),
				scale(height() / 80),
				pos(randi(20, width() - 20), height()),
				move(randi(250, 290), CARRAGEENAN_SPEED),
				cleanup(),
				"carrageenan",
			]);
		});
	});

	// add plastic can carrier
	wait(rand(0.5, 3), () => {
		loop(rand(1.5, 2), () => {
			const plastic = add([
				sprite("plastic"),
				origin("center"),
				opacity(0.6),
				area(),
				rotate(randi(0, 90)),
				scale(height() / 80),
				pos(randi(20, width() - 20), height()),
				move(UP, PLASTIC_SPEED),
				cleanup(),
				"plastic",
			]);
			
			plastic.action(() => {
				plastic.angle += 0.3;
			})
		});
	});

	// add SHAWN
	wait(randi(5, 10), () => {
		loop(randi(5, 10), () => {
			let randomX = randi(20, width() - 20);
			let dy = height() / 2;
			let dx = hook.pos.x - randomX;
			if (dx == 0) {
				dx = 1;
			}
			let angle = (Math.atan(dy / dx) * 180/ Math.PI);
			
			add([
				sprite("shawn"),
				origin("top"),
				area(),
				rotate(-angle + 90),
				scale(height() / 90),
				pos(randomX, height()),
				move(-angle, SHAWN_SPEED),
				cleanup(),
				"shawn",
			]);
		});
	});

	// add friendly fish
	wait(rand(0.5, 3), () => {
		loop(rand(2, 3), () => {
			add([
				sprite(FISH_LIST[randi(0, FISH_LENGTH)]),
				origin("top"), 
				opacity(0.9),
				area(),
				scale(height() / 80),
				pos(randi(20, width() - 20), height()),
				move(randi(250, 290), FRIEND_SPEED),
				cleanup(),
				"friend"
			]);
		});
	});

	// hook collision detection
	hook.collides("carrageenan", (carrageenan) => {
		play("piranha");
		destroy(carrageenan);
		hook.health -= 2;
		shake(12);
	});

	hook.collides("plastic", (plastic) => {
		play("plastic");
		destroy(plastic);
		hook.health -= 1;
		shake(5);
	});

	hook.collides("shawn", (shawn) => {
		shawnAttack.play();
		destroy(shawn);
		hook.health -= 3;
		shake(18);
	});

	hook.collides("friend", (friend) => {
		play("fish");
		destroy(friend);
		points += 1;
	});
});

// initializing lose scene
scene("lose", () => {
	// stop playing music
	titleMusic.pause();
	gameMusic.pause();
	
	loseMusic.play();
	
	// add background
	add([
		rect(width(), height()),
		color(100, 210, 240),
	]);

	// add background ocean
	add([
		sprite("ocean"),
		scale((height() + width()) / 600),
		pos(width() / 2, height() / 2),
		origin("center"),
		opacity(0.2),
	]);

	// add "You Lost" text
	add([
		sprite("lost"),
		origin("center"),
		pos(width() / 2, height() / 3),
	])

	// add score text
	add([
		text("Score: " + points),
		origin("center"),
		pos(width() / 2, height() / 3 * 2)
	])

	// add "Press space to try again" text
	add([
		text("[press space to try again]"),
		origin("center"),
		pos(width() / 2, height() - 30),
		scale(0.4),
	])
	
	// keyPress to switch to game scene
	keyPress("space", () => {
		go("game");
	});
});

// run title scene
go("title");