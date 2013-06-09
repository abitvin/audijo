function Audijo( params )
{
    var me, pub,
		Unit = { Percentage: 'percentage', Seconds: 'seconds', Scalar: 'scalar' };
	
	function init()
	{
        params = params || {};

        initMe();
		initAudio();
		initPub();
	
		return pub;
	}
	
    // Initializers

	function initAudio()
	{
		function preload()
		{
			if( params.preload === undefined ) {
				return 'auto';
			}
			
			if( params.preload.constructor !== String ) {
				throw 'Preload parameter must be a string.';
			}
			
			if( -1 === [ 'none', 'auto', 'metadata' ].indexOf( params.preload ) ) {
				throw 'Preload parameter must be "none", "auto" or "metadata".';
			}
			
			return params.preload;
		}
		
        var attr, vars = {}, swfParams = {};
			
		me.id = 'audio-' + nextId();
        me.audio = document.createElement( 'audio' );

        if( me.audio.autoplay === undefined )
        {
            me.swf = document.createElement( 'div' );
            me.swf.setAttribute( 'id', me.id );
			document.documentElement.appendChild( me.swf );

            attr = { id: me.id, style: 'position: fixed; top: -100px;' },
            vars = { audijoId: me.id, loop: params.loop },
            swfParams = { allowScriptAccess: 'always' };

            swfobject.embedSWF(
                params.swfLocation || 'swf/audijo.swf', me.id, '50', '50', '9.0.0', false,
                vars, swfParams, attr, function( e ) { me.swf = e.ref; }
            );

			Audijo.registerSwfAudio( me );
			
            me.audio = null;
        }
        else
        {
            me.audio.setAttribute( 'id', me.id );
            me.audio.autoplay = params.autoplay;
		    me.audio.controls = params.controls;
			me.audio.loop = params.loop;
			me.audio.preload = preload();

			document.documentElement.appendChild( me.audio );

			fireCallback();
        }
	}
	
	function initMe()
	{
        me = {
			audio: null,
			externalInterfaceLoaded: false,
			fireCallback: fireCallback,
			id: null,
			swf: null
		};
	}
	
	function initPub()
	{
		pub = {
			buffered: null,
			bufferedPercentage: bufferedPercentage,
			bufferedScalar: bufferedScalar,
			bufferedSeconds: bufferedSeconds,
			played: null,
			playedPercentage: playedPercentage,
			playedScalar: playedScalar,
			playedSeconds: playedSeconds,
			duration: duration,
			pause: pause,
			play: play,
			seek: null,
			seekPercentage: seekPercentage,
			seekScalar: seekScalar,
			seekSeconds: seekSeconds,
			source: source
		};
		
		returnUnit( params.returnUnit || Unit.Seconds );
	}

    // Public methods

	function bufferedPercentage()
	{
		return bufferedScalar() * 100;
	}
	
	function bufferedScalar()
	{
		var d = duration();
		
		if( d === 0 ) {
			return 0;
		}
		
		return bufferedSeconds() / d;
	}
	
	function bufferedSeconds()
	{
		return pick( bufferedSecondsHtml5, bufferedSecondsSwf );
	}
	
	function bufferedSecondsHtml5()
	{
		return me.audio.buffered.length > 0 ? me.audio.buffered.end( 0 ) : 0;
	}
	
	function bufferedSecondsSwf()
	{
		return me.externalInterfaceLoaded ? me.swf.buffered() : 0;
	}
	
	function duration()
	{
		return pick( durationHtml5, durationSwf );
	}
	
	function durationHtml5()
	{
		return isNaN( me.audio.duration ) ? 0 : me.audio.duration;
	}
	
	function durationSwf()
	{
		return me.externalInterfaceLoaded ? me.swf.duration() : 0;
	}
	
    function pause()
	{
		pick( pauseHtml5, pauseSwf );
	}
	
	function pauseHtml5()
	{
		me.audio.pause();
	}
	
	function pauseSwf()
	{
		if( me.externalInterfaceLoaded ) {
			me.swf.pauseAudio();
		}
	}
	
	function play( url )
	{
		// FIXME play when loaded.
		// When not loaded supply params.src = url and params.autoplay = true
		
        if( url ) {
			source( url );
		}
		
		pick( playHtml5, playSwf );
	}
	
	function playHtml5()
	{
		me.audio.play();
	}
	
	function playSwf()
	{
		if( me.externalInterfaceLoaded ) {
			me.swf.playAudio();
		}
	}
	
	function playedPercentage()
	{
		return playedScalar() * 100;
	}
	
	function playedScalar()
	{
		var d = duration();
		
		if( d === 0 ) {
			return 0;
		}
		
		return playedSeconds() / d; 
	}
	
	function playedSeconds()
	{
		return pick( playedSecondsHtml5, playedSecondsSwf );
	}
	
	function playedSecondsHtml5()
	{
		return me.audio.currentTime;
	}
	
	function playedSecondsSwf()
	{
		return me.externalInterfaceLoaded ? me.swf.played() : 0;
	}
	
	function returnUnit( unit )
	{
		switch( unit )
		{
			case Unit.Percentage:
			{
				pub.buffered = bufferedPercentage;
				pub.played = playedPercentage;
				pub.seek = seekPercentage;
				break;
			}
			
			case Unit.Scalar:
			{
				pub.buffered = bufferedScalar;
				pub.played = playedScalar;
				pub.seek = seekScalar;
				break;
			}
			
			case Unit.Seconds:
			{
				pub.buffered = bufferedSeconds;
				pub.played = playedSeconds;
				pub.seek = seekSeconds;
				break;
			}
			
			default:
			{
				throw 'Unit can only be "' + Unit.Seconds + '" or "' + Unit.Scalar + '"';
			}
		}
	}
	
	function seekPercentage( offset )
	{
		seekScalar( offset / 100 );
	}
	
	function seekScalar( offset )
	{
		seekSeconds( offset * duration() );
	}
	
	function seekSeconds( offset )
	{
		if( offset < 0 ) {
			offset = 0;
		}
		else if( offset > bufferedSeconds() ) {
			offset = bufferedSeconds();
		}
		
		pick( seekSecondsHtml5, seekSecondsSwf, offset );
	}
	
	function seekSecondsHtml5( offset )
	{
		me.audio.currentTime = offset;
	}
	
	function seekSecondsSwf( offset )
	{
		if( me.externalInterfaceLoaded ) {
			me.swf.seekAudio( offset );
		}
	}
	
	function source( url )
	{
        var mp3, ogg, ext = url.substr( url.length - 4, 4 );

        if( ext === '.mp3' || ext === '.ogg' ) {
			url = url.substr( 0, url.length - 4 );
		}
		
        if( me.audio )
        {
            mp3 = document.createElement( 'source' );
		    mp3.setAttribute( 'src', url + '.mp3' );
		    mp3.setAttribute( 'type', 'audio/mpeg' );
		
		    ogg = document.createElement( 'source' );
		    ogg.setAttribute( 'src', url + '.ogg' );
		    ogg.setAttribute( 'type', 'audio/ogg' );

            me.audio.innerHTML = '';
		    me.audio.appendChild( mp3 );
		    me.audio.appendChild( ogg );
            me.audio.load();
        }
        else
        {
            me.swf.source( url + '.mp3' );
        }
	}

    // Private methods

	function fireCallback()
	{
		params.src && source( params.src );
		params.autoplay && play();
		params.callback && params.callback();
	}
	
	function pick( a, b, argument )
	{
		return ( me.audio ? a : b )( argument );
	}
	
	function nextId()
	{
        Audijo.uniqId = Audijo.uniqId || 0;
        
        return ++Audijo.uniqId;
	}
	
	return init();
}

Audijo.loaded = function( id )
{
	var audio = Audijo.swfs[ id ];
	audio.externalInterfaceLoaded = true;
	audio.fireCallback();
};

Audijo.registerSwfAudio = function( me )
{
	Audijo.swfs[ me.id ] = me;
}

Audijo.swfs = {};
