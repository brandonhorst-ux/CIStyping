# Type & Go! ⌨️🐶

A simple, low-distraction keyboarding game for practicing short lowercase sentences.

## Features

- 10 short sentences
- No capital letters required
- Incorrect letters are gently rejected rather than causing a failure
- Large typing area
- Simple progress bar
- Stars and streaks
- Short celebration animation after each sentence
- Puppy moves toward the house
- Works on desktop, Chromebook, or tablet with a keyboard
- No server or database required

## Run it

You can open `index.html` directly in a browser.

## Put it on GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, and `game.js`.
3. Commit the files.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`.
7. Save.

GitHub will provide a web address for the game.

## Change the sentences

Open `game.js` and edit the `sentences` list:

```js
const sentences = [
  "the dog runs fast",
  "i see a red ball",
  "the cat is sleeping"
];
```

Keep the sentences lowercase if you want the game to remain a lowercase-only activity.
