const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { exec } = require("child_process");

const hostname = "localhost";
const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.post("/parseYtUrl", (req, res) => {
    const url = req.body.url;
    // exec(`yt-dlp -x --audio-format mp3 "${url}" --extractor-args "youtube:player-client=default,-tv_simply"`, (err, stdout, stderr) => {
    //     if (err) {
    //         res.send(err.message)
    //         return;
    //     }
    //     if (stderr) {
    //         res.send(stderr)
    //         return;
    //     }

    exec(`ffmpeg -i "Java no Visual Studio Code： Projetos com Spring Boot [dkmlOi_MNb4].mp3" -ar 16000 -ac 1 -c:a pcm_s16le output.wav`, (err, stdout, stderr) => {
        if (err) {
            res.send(err.message)
            return;
        }
        if (stderr) {
            res.send(stderr)
            return;
        }
        exec(`../whisper.cpp/build/bin/whisper-cli -f "output.wav -otxt"`, (err, stdout, stderr) => {
            if (err) {
                res.send(err.message)
                return;
            }
            if (stderr) {
                res.send(stderr)
                return;
            }
            res.send(stdout)
        });
    })

});
// })