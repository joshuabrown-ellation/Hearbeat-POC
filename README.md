Heartbeat!
====================

Video Pings are important for tracking the end user experience and indispensable for correct revenue sharing with our
publisher partners/content providers.  [Link to heartbeat spec.](https://ellation.atlassian.net/wiki/pages/viewpage.action?pageId=56492094)
[Link to general tracking data.](https://docs.google.com/spreadsheets/d/1UnGlLzM8AjHwLNE7deMqI2fuCbzl-yO9LeqgkfRcXY4/edit#gid=1936183852)
[Example JSON](https://docs.google.com/spreadsheets/d/1UnGlLzM8AjHwLNE7deMqI2fuCbzl-yO9LeqgkfRcXY4/edit#gid=138786414)

They are not a timer that pings every 30 seconds.  That would be a 'wall watching' approach.  What we really want is 
a heartbeat after every 30 seconds of video watched.  The hearbeat would include three temporal data.  One is 
secondsViewed.  This number will climb as you watch the video.  So if you scrub back and watch a really cool part
of the video a few times, your secondsViewed can be longer than the video's duration.  The other is the time between
the last video heartbeat and this heartbeat, or elapsedDelta.  We are watching a video after all, so we also include
the third datum, the playheadTime from the video.  

The spec includes a requirement to fire video pings at user Pause and any video Stop events.

In HTML5 media terms, that would be derived from 'timeupdate', 'pause', 'ended' events.
'waiting' is when user playback has stopped because of lack of data.  That's ping worthy!
'playing' is when user playback has resumed because the data available again. 

'timeupdate' is emitted by the player while seek, seeked, seeking events.  So, 'timeupdate' will have to be suppressed
as a source of truth for seconds viewed while seek, seeked, seeking is is happening.

That's not going to be a state cleared by a single event. A more complex solution could give us sub-timeupdate resolution
on how much is being watched, but I propose just populating an array with the recent history of 'seek', 'seeked', 
'seeking', 'timeupdate'.  If the last two elements are 'timeupdate' we can use that event to add to the secondsWatched 
value.  


