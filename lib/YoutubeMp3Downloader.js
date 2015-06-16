"use strict";
var os = require('os');
var ffmpeg = require('fluent-ffmpeg');
var ytdl = require('ytdl-core');
var async = require('async');

function YoutubeMp3Downloader(options) {

    var self = this;

    self.youtubeBaseUrl = 'http://www.youtube.com/watch?v=';
    self.youtubeVideoQuality = (options && options.youtubeVideoQuality ? options.youtubeVideoQuality : 'highest');
    self.outputPath = (options && options.outputPath ? options.outputPath : (os.platform() === 'win32' ? 'D:/temp' : '/tmp'));
    self.parallelismFactor = (options && options.parallelismFactor ? options.parallelismFactor : 1);

    if (options && options.ffmpegPath) {
        ffmpeg.setFfmpegPath(options.ffmpegPath);
    }

}

YoutubeMp3Downloader.prototype.download = function(videoInfo, cb) {
    var self = this;
    var videoArray = [];

    if (Array.isArray(videoInfo)) {
        videoArray = videoInfo;
    } else if (typeof videoInfo === "string") {
        videoArray.push(videoInfo);
    }

    function getVideo(videoId, callback) {

        var videoUrl = self.youtubeBaseUrl+videoId;

        ytdl.getInfo(videoUrl, function(err, info){

            if(err) {
                return callback(err);
            }

            var videoTitle = info.title.replace(/"/g, '').replace(/'/g, '').replace(/\//g, '').replace(/\?/g, '');
            var artist = "Unknown";
            var title = "Unknown";

            if (videoTitle.indexOf("-") > -1) {
                var temp = videoTitle.split("-");
                if (temp.length >= 2) {
                    artist = temp[0].trim();
                    title = temp[1].trim();
                }
            } else {
                title = videoTitle;
            }

            var stream = ytdl(videoUrl, {
                quality: self.youtubeVideoQuality
            });

            var fileName = self.outputPath + '/' + videoTitle + '.mp3';
            var startTimestamp = new Date().getTime();

            var proc = new ffmpeg({
                source: stream
            })
                .audioBitrate(info.formats[0].audioBitrate)
                .withAudioCodec('libmp3lame')
                .toFormat('mp3')
                .outputOptions('-id3v2_version', '4')
                .outputOptions('-metadata', 'title=' + title)
                .outputOptions('-metadata', 'artist=' + artist)
                .on('error', function(err) {
                    console.log('An error occurred: ' + err.message);
                    callback(err, null);
                })
                .on('end', function() {
                    //console.log('Processing finished !');
                    callback(null, {
                        "file": fileName,
                        "videoId": videoId,
                        "youtubeUrl": videoUrl,
                        "videoTitle": videoTitle,
                        "artist": artist,
                        "title": title,
                        "took": (new Date().getTime()-startTimestamp)
                    });
                })
                .saveToFile(fileName);

        });
    }

    async.mapLimit(videoArray, self.parallelismFactor, getVideo, function(err, results){
        cb(err, results);
    });

}

module.exports = YoutubeMp3Downloader;