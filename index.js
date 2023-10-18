const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const { OpenAI } = require("openai");
require('dotenv').config();

// Define the input directory containing video files.
const inputDirectory = '';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
// Define the output text file.
const outputTextFile = 'output.txt';

// Function to extract audio from a video file using ffmpeg.
function extractAudio(inputVideo, outputAudio) {
    return new Promise((resolve, reject) => {
        const ffmpegCommand = `ffmpeg -i "${inputVideo}" -vn -acodec pcm_s16le -ar 16000 -ac 1 "${outputAudio}"`;

        childProcess.exec(ffmpegCommand, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function transcribe(buffer) {

    return await OpenAI.createTranscription.transcribe(buffer);
    // return response;
}
async function audioToText(inputAudio) {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(inputAudio),
        model: "whisper-1",
    });
    console.log("------------");
    console.log(transcription);
    return transcription;
}
// Function to process all video files in the directory.
async function processVideoDirectory(inputDirectory, filterList) {
    const files = fs.readdirSync(inputDirectory);
    //filter out already processed files.
    const videoFiles = files.filter(item => !filterList.includes(item));

    for (const videoFile of videoFiles) {
        const videoFilePath = path.join(inputDirectory, videoFile);
        const audioFilePath = path.join(inputDirectory, `${videoFile}.wav`);

        try {
            await extractAudio(videoFilePath, audioFilePath);
            const audioText = await audioToText(audioFilePath);

            // Append the video file name and audio text to the output text file.
            fs.appendFileSync(outputTextFile, `${videoFile}: ${audioText.text}\n`);

            // Clean up the temporary audio file.
            fs.unlinkSync(audioFilePath);
        } catch (error) {
            console.error(`Error processing ${videoFile}:`, error);
        }
    }
}

function getListOfProcessedFiles() {
    //get the contents, split at each line an then split at ':' and get the 0th element.
    const fContents = fs.readFileSync(outputTextFile, 'utf8');
    return fContents.split('\n').map(row => row.split(':')[0]).filter(Boolean);
}
// Main function to start the processing.
function main() {

    //   fs.writeFileSync(outputTextFile, ''); // Clear the output file if it exists.
    const processed = getListOfProcessedFiles();
    processVideoDirectory(inputDirectory, processed)
        .then(() => {
            console.log('Processing complete.');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

main();
