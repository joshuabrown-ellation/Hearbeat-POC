/**
 * Created by joshuabrown on 4/2/17.
 */
var pingEvents = [
    'abort',
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'interruptbegin',
    'interruptend',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting',
  ],
  eventHistory = ['','','','',''], // what events have happened
  historyLength = 5, // what events have happened
  secondsViewed = 0, // how much of the video we watched
  previousTime, // previous time, if undefined, assume this is the first time event
  now, // cache Date.now() method in one place
  previousTimeOfDelta,
  elapsedDelta = 0, // how long since we last sent a ping
  heartBeatInterval = 5,  // seconds between heartbeats
  demoVid = document.getElementById('demo_vid'), // demo vid!
  heartBeatLed = document.getElementById('led'), // output led
  secondsWatchedOutput = document.getElementById('watched'), // how long we've watched
  elapsedDeltaOutput = document.getElementById('delta'); // how long we've watched

function ping() {
  heartBeatLed.style.backgroundColor = 'red';
  if (secondsViewed === previousTimeOfDelta && previousTimeOfDelta !== undefined && eventHistory[historyLength - 2] !== 'pause') {
    return;
  }
  previousTimeOfDelta = secondsViewed;
  console.log({
    'Event Name': 'Video Heartbeat',
    "channelName": "Test Channel",
    "mediaType": "episode",
    "mediaId": "movie_id | series_id | season_id | episode_id | extra_video_id",
    "topLevelMediaId": "series_id | movie_listing_id",
    "mediaTitle": "series title | season title |  episode number | episode title OR if there is no season series title | episode number | episode title OR movie title OR for extra_video_series series title | extra title OR for movie extra series title | extra title",
    "mediaSubtitleLanguage": "en-US",
    "mediaAudioLanguage": "ja-JP",
    "mediaReleaseDate": "2017-01-15",
    "mediaDuration": "2859.445",
    "mediaAdSupported": true,
    "topLevelId": "238014",
    "topLevelType": "series",
    "secondsViewed": secondsViewed.toFixed(3).toString(),
    "elapsedDelta": elapsedDelta.toFixed(3).toString(),
    "playheadTime": now.toFixed(3).toString(),
  });
  setTimeout(function heartBeatReset() {
    heartBeatLed.style.backgroundColor = '';
  }, 300);
}

function pingEventHandler(event) {
  now = demoVid.currentTime;
  console.log(event.type);

  if (eventHistory.length < historyLength) {
    eventHistory.push(event.type);
  } else {
    eventHistory.shift();
    eventHistory.push(event.type);
  }
  switch (event.type){
    case 'timeupdate':
      // do something about playing the video back!
      // we already know the last element from eventHistory becaue of the switch
      if(eventHistory[historyLength - 2] === 'timeupdate'){ // so, hopefully not seeking....
        if (previousTime) {
          secondsViewed += (now - previousTime);
          previousTime = now;
        }
      }
      if(elapsedDelta >= heartBeatInterval){
        ping();
      }
      break;
    case 'play':
    case 'playing':
    case 'pause':
    case 'waiting':
    case 'ended':
      // do something about stopping or stopping
      ping();
      break;
    default:
      break;
  }
  previousTime = now;
  secondsWatchedOutput.innerHTML = secondsViewed;
  elapsedDelta = secondsViewed - previousTimeOfDelta;
  elapsedDeltaOutput.innerHTML = elapsedDelta;
}

function setup(events) {
  events.forEach(function eventForEach(item) {
    demoVid.addEventListener(item, pingEventHandler);
  });
}

setup(pingEvents);