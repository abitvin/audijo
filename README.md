About
=====
Audijo is a JavaScript wrapper class around the HTML 5 audio tag. When the audio tag is not supported in the browser it falls back to Shockwave Flash.


Audijo API
==========

Constructing
------------

    // Notice no 'new' keyword.
	var audio = Audijo({
		autoplay: true,						// Default: false
		loop: true,							// Default: false
		returnUnit: 'UnitInterval',			// The default unit returned and used by buffered(),
											//		duration() and seek(). This can be 'Percentage',
											//		'UnitInterval' or 'Seconds'. Default: 'Seconds'.
		src: 'path/to/audio.mp3',			// When MP3 is not supported the source
											//		will be translated to path/to/audio.ogg
		swfLocation: 'path/to/audijo.swf'	// Default: 'swf/audijo.swf'
	});
	
Methods
-------

	// Returns the duration.
	var duration = audio.duration();
	
	// Pauses the audio.
	audio.pause();
	
	// Plays the audio.
    audio.play();
	
	// Loads the new source and plays it.
    audio.play( 'path/to/audio.mp3' );
	
	// Returns the amount played.
    var amount = audio.played();
	
	// Seek to new position.
	audio.seek( unitValue );
	
	// Load new source.
	audio.source( 'path/to/audio.mp3' );
	
Return unit
-----------
The following units are available:
* Seconds, the absolute value in seconds.
* Percentage, a value between 0 and 100.
* UnitInterval, a value between 0 and 1.

At the constructor you use `returnUnit` for the default unit used troughout the uses of the Audijo instance. For example when using 'percentage' as unit the `audio.duration()` returns a value between 0 and 100. But in certain situations for example an audio player, you want the duration to be shown in seconds but the bufferbar to be presented by percentage. For these situations there are the following methods calls available.

    audio.bufferedPercentage();
	audio.bufferedSeconds();
	audio.bufferedUnitInterval();
	
	audio.durationPercentage();
	audio.durationSeconds();
	audio.durationUnitInterval();
	
	audio.seekPercentage( value );
	audio.seekSeconds( value );
	audio.seekUnitInterval( value );


Author
======
Vincent Van Ingen  
hi@abitvin.net


License
=======
Audijo is licensed under the WHATEVER License. (See LICENSE)