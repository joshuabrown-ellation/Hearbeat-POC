/**
 * Created by joshuabrown on 4/2/17.
 */
var videoEvents = [
    'timeupdate',
    'seek',
    'seeked',
    'seeking',
    'ended',
    'waiting',
    'pause',
  ],
  eventHistory = [], // what events have happened
  historyLength = 5, // what events have happened
  secondsViewed = 0, // how much of the video we watched
  previousTime, // previous time, if undefined, assume this is the first time event
  now, // cache Date.now() method in one place
  previousTimeOfDelta = 0,
  elapsedDelta = 0, // how long since we last sent a ping
  heartBeatInterval = 5,  // seconds between heartbeats
  demoVid = document.getElementById('demo_vid'), // demo vid!
  heartBeatLed = document.getElementById('led'), // output led
  secondsWatchedOutput = document.getElementById('watched'), // how long we've watched
  elapsedDeltaOutput = document.getElementById('delta'), // how long we've watched
  externalPause = document.getElementById('external_pause'),
  isExternalPause = false;


function ping() {
  heartBeatLed.style.backgroundColor = 'red';
  if(secondsViewed === previousTimeOfDelta){
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
    "secondsViewed": secondsViewed.toString(),
    "elapsedDelta": elapsedDelta.toString(),
    "playheadTime": now.toString(),
  });
  setTimeout(function heartBeatReset() {
    heartBeatLed.style.backgroundColor = '';
  }, 300);
}

function update(){
  previousTime = now;
  secondsWatchedOutput.innerHTML = secondsViewed;
  elapsedDelta = secondsViewed - previousTimeOfDelta;
  elapsedDeltaOutput.innerHTML = elapsedDelta;
}
function eventHandler(event) {
  now = demoVid.currentTime;

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
      update();
      if(elapsedDelta >= heartBeatInterval){
        ping();
      }
      break;
    case 'pause':
      if(!isExternalPause){
        update();
        ping();
      }
      isExternalPause = false;
      break;
    case 'waiting':
    case 'ended':
      // do something about stopping
      update();
      ping();
      break;
    case 'seek':
    case 'seeking':
    case 'seeked':
      // do something about scrubbing
      break;
    default:
      break;
  }
}

function setup(events) {
  events.forEach(function eventForEach(item) {
    demoVid.addEventListener(item, eventHandler);
  });
  externalPause.addEventListener('click', function() {
    isExternalPause = true;
    demoVid.pause();
  });
}

setup(videoEvents);