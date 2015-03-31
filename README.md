# Youtube MP3 Downloader

Youtube MP3 Downloader is a module which allows to specify one or multiple YouTube videos from whom the audio data should be extracted, converted to MP3, and stored on disk.

## Installation

### Prerequisites

To run this project, you need to have a local installation of FFmpeg present on your system. You can download it from https://www.ffmpeg.org/download.html

### Checkout the project from Github to a local folder

`git clone https://github.com/tobilg/youtube-mp3-downloader.git`

### Install module dependencies

Navigate to the folder where you checked out the project to in your console. Run `npm install`.

### Running

A basic usage example is the following:

```javascript
var YoutubeMp3Downloader = require('youtube-mp3-downloader');

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "/path/to/ffmpeg",        //Where is the FFmpeg binary located?
    "outputPath": "/path/to/mp3/folder",    //Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       //What video quality should be used?
    "parallelismFactor": 2                  //How many parallel downloads/encodes should be started?
});

//Download video and save as MP3 file
YD.download(["rnkuRQ8tjIE"], function(result) {
    console.log(result);
});
```
