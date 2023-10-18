# Video to Text Transcription using OpenAI Whisper

This tool uses OpenAI's Whisper ASR (Automatic Speech Recognition) system to transcribe text from a video. It follows the following steps:

## Prerequisites
- Expects `ffmpeg` to be installed and available in the system's PATH.

## Usage

1. **Extract Audio from Video:**

   This tool extracts audio from a video using `ffmpeg`. It will later be updated to use FluentFFmpeg for better compatibility and control.

2. **Transcribe Audio with Whisper:**

   The extracted audio file is passed to OpenAI's Whisper ASR system for transcription. This step involves sending the audio data to the OpenAI API.

3. **Create Output File:**

   The tool creates a `:` separated file that includes the name of the video and the transcribed text. This output file serves as a record of the transcription.

## How to Use

To use this tool, follow these steps:

1. Make sure you have `ffmpeg` installed and accessible in your system's PATH.

2. Clone or download this repository.

3. Rename .env.example to .env

4. Update OPENAI_API_KEY

5. Update inputDirectory in index.js

6. The transcribed text will be saved in an output file.

## Example

```bash
$ node index.js
