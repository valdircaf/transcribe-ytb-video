const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { exec, spawn } = require("child_process");
const { stderr, stdout } = require('process');
const { error } = require('console');
const path = require('path');

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
    const actDir = process.cwd() + "/server"
    exec(`yt-dlp -x --audio-format mp3 -o "${actDir}/%(id)s.%(ext)s" --print filename "${url}" --extractor-args "youtube:player-client=default,-tv_simply"`, (err, stdout, stderr) => {
        if (err) {
            res.send(err.message)
            return;
        }
        console.log(stdout.trim());
        const fullPath = stdout.trim();
        const name = path.parse(fullPath).name.replace("webm", "mp3");
        const fileName = name + ".mp3";
        const wavFile = name + ".wav";
        exec(`ffmpeg -i "${fileName}" -ar 16000 -ac 1 -c:a pcm_s16le "${wavFile}"`, 

            {cwd: "/Users/novo/Documents/projetos/transcribe-ytb/server"},
            (error, stdout, stderr) => {
            if (error) {
                res.send(error.message)
                return;
            }
                exec(`../whisper.cpp/build/bin/whisper-cli -f "${wavFile}" -m ../whisper.cpp/models/ggml-base.bin -otxt -l pt`, 
                {cwd: "/Users/novo/Documents/projetos/transcribe-ytb/server"},
                (error, stdout, stderr) => {
                if (error) {
                    res.send(error.message)
                    return;
                }
                
                res.send(stdout)
        })
    }) 
})
})
