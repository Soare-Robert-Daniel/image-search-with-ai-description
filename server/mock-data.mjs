const host_path = 'http://localhost:9000/images/'

const data_examples = [
    {
        id: 1,
        src: `${host_path}example-1.png`,
        name: 'Example 1',
        prompt: 'a cartoon character wearing a top hat and glasses, character with a hat, a character based on a haggis, toonix character, absurdist wiggly blob in a dress, m & m mascot, toon, cartoon character, anthropomorphic character, cereal mascot, pudenda, mrs bean, dancing character, wearing a monocle, caracter with brown hat'
    },
    {
        id: 2,
        src: `${host_path}example-2.jpeg`,
        name: 'Example 2',
        prompt: 'a drawing of a man in a cowboy hat, a character portrait, inspired by Heinz Anger, teacher as angry zombie, coloring page, angry ali khamenei, character design humanoid'
    },
    {
        id: 3,
        src: `${host_path}example-3.jpeg`,
        name: 'Example 3',
        prompt: 'a man in a suit drinking a glass of wine, reddit contest winner, julian ope, profile pic, gilleard james, vine'
    },
    {
        id: 4,
        src: `${host_path}example-4.png`,
        name: 'Example 4',
        prompt: 'a close up of a person wearing a mask, reddit, digital art, holding his hands up to his face, hacker, voxelart, hq 4k wallpaper'
    },
    {
        id: 5,
        src: `${host_path}example-5.png`,
        name: 'Example 5',
        prompt: 'a cartoon girl with a star on her head, pink iconic character, space molly, toon, girl, pixie, kid, chibi, by Robert Freebairn, cartoon illustration, by Bob Ringwood, super-hero girl, cooky, martine, happy girl, star, nighttime!, cartoonish and simplistic, dancing character, sally, gogo',
    },
    {
        id: 6,
        src: `${host_path}example-6.png`,
        name: 'Example 6',
        prompt: 'a cartoon girl with a star on her head, pink iconic character, space molly, toon, girl, pixie, kid, chibi, by Robert Freebairn, cartoon illustration, by Bob Ringwood, super-hero girl, cooky, martine, happy girl, star, nighttime!, cartoonish and simplistic, dancing character, sally, gogo',
    },
    {
        id: 7,
        src: `${host_path}example-7.png`,
        name: 'Example 7',
        prompt: 'a cartoon girl with a star on her head, pink iconic character, space molly, toon, girl, pixie, kid, chibi, by Robert Freebairn, cartoon illustration, by Bob Ringwood, super-hero girl, cooky, martine, happy girl, star, nighttime!, cartoonish and simplistic, dancing character, sally, gogo',
    },
    {
        id: 8,
        src: `${host_path}example-8.png`,
        name: 'Example 8',
        prompt: 'a close up of a person wearing a vampire costume, by Jamie Hewlett, behance, wearing red formal attire, muscular bald man, official anime artwork, hp lovecraft style, high-contrast lighting, emaciated, wearing a blazer, slender symmetrical body, vampire queen, necro, bat, albino, bandai'
    },
    {
        id: 9,
        src: `${host_path}example-9.png`,
        name: 'Example 9',
        prompt: 'there is a rainbow in the sky over a fire, a matte painting, pixabay contest winner, holography, enb, iphone background, world of fire and blood, campfire, 8k n 9, comic book:.2 | unreal engine:.3, splash page, 420, colorful aesthetic'
    },
    {
        id: 10,
        src: `${host_path}example-10.png`,
        name: 'Example 10',
        prompt: 'there is a rainbow in the sky over a fire, a matte painting, pixabay contest winner, holography, enb, iphone background, world of fire and blood, campfire, 8k n 9, comic book:.2 | unreal engine:.3, splash page, 420, colorful aesthetic'
    },
    {
        id: 11,
        src: `${host_path}example-11.png`,
        name: 'Example 11',
        prompt: 'a man with a red nose and a black hoodie, a detailed painting, by Shitao, hinata hyuga from naruto, winamp skin, gray skin. grunge, oversized shuriken, extremely realistic face, archer, brook, high definition render, nine tails, red ocher, mime, nigt'
    },
    {
        id: 12,
        src: `${host_path}example-12.png`,
        name: 'Example 12',
        prompt: 'a painting of a man and a child sitting on a beach, a storybook illustration, by Peter de Seve, cgsociety, fantasy art, with aqua neon dreadlocks, connected to nature via vines, willow smith young, steve henderson and mark brooks, with seaweed, big red afro, art for the fool tarot card'
    },
    {
        id: 13,
        src: `${host_path}example-13.png`,
        name: 'Example 13',
        prompt: 'a drawing of a person on a boat in the water, a color pencil sketch, inspired by Ralph Albert Blakelock, featured on pixiv, lovecraftian landscape, walking towards the full moon, neon radioactive swamp, small reeds behind lake, inhabited on many levels, artsation contest winner'
    },
    {
        id: 14,
        src: `${host_path}example-14.png`,
        name: 'Example 14',
        prompt: 'a woman wearing a cat ears and a dress, a picture, instagram contest winner, purple crystal jewelry, 🔥 😎 🕹️ 👀, moroccan queens ny, discord profile picture, natural straight eyebrows, f/2 8, proud smirk, gypsy, f / 2 4, stream, 1 9 th, cheetah, uncropped'
    },
    {
        id: 15,
        src: `${host_path}example-15.jpeg`,
        name: 'Example 15',
        prompt: 'a man taking a picture of himself in a mirror, running shoes, russian, winter, full face, digital glasses, ventail, man in his 40s, wearing a lemon, w 7 6 8, iphone 1 3 pro max, bold bright colors, peace, gang, no jersey, insane face, pacing, ready, 8 h, dreary'
    },
    {
        id: 16,
        src: `${host_path}example-16.jpeg`,
        name: 'Example 16',
        prompt: 'a close up of a woman with a flower in her hair, beeple and jeremiah ketner, stunning 3d render of a fairy, by Android Jones, karol bak uhd, mark ryden highly detailed, with beautiful colors, iris, 2 0 s, with wings. ultra-detailed, ios, nice, colored, azure, beautiful girl'
    },
    {
        id: 17,
        src: `${host_path}example-17.jpeg`,
        name: 'Example 17',
        prompt: 'a man and a woman standing next to each other, gigachad jesus, attractive brown hair woman, at a birthday party, david villegas, holiday season, low res, cleaned up, smart awkward and sexy, desi, handsome saitama, rectangular, persian, they are siblings, wearing red, latinas, aztec, holding a bomb'
    },
    {
        id: 18,
        src: `${host_path}example-18.jpeg`,
        name: 'Example 18',
        prompt: 'a woman in a white dress swimming under water, brooke shaden detailed, embers adrift in the air, inhabited on many levels, moorland, dark blue mist, critical moment photograph, damsel in distress, unconscious, floating in empty space, saturated, fallen crown'
    },
    {
        id: 19,
        src: `${host_path}example-19.png`,
        name: 'Example 19',
        prompt: 'a close up of a bike on a white background, colourful flat surreal design, follows the golden ratio, pictogram, morandi color scheme, winning illustration, graphic”, illustration », on simple background, volume, inspired by Ota Bubeníček, smooth graphics, flash photo'
    },
    {
        id: 20,
        src: `${host_path}example-20.png`,
        name: 'Example 20',
        prompt: 'a green and orange tree on a white background, color dispersion, on grey background, environment design illustration, 2d solid shape logo, procreate illustration, colorful palette illustration, beautiful photo, 3 d vector'
    }
]

export default data_examples;