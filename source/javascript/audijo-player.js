function AudijoPlayer( params )
{
	var me, pub;
	
	function init()
	{
		initMe();
		initAudio();
		initView();
		initPub();
		
		return pub;
	}
	
	// Initializers
	
	function initAudio()
	{
		params.returnUnit = 'Percentage';
		me.audio = Audijo( params );
	}
	
	function initMe()
	{
		me = {
			audio: null
		};
	}
	
	function initPub()
	{
		pub = {
			pause: me.audio.pause,
			play: me.audio.play,
			seek: me.audio.seek,
			source: me.audio.source
		};
	}
	
	function initView()
	{
		function control( e )
		{
			e = window.event || e;
			
			isPlaying ? me.audio.pause() : me.audio.play();
			isPlaying = !isPlaying;
			
			main.className = 'audijo-player ' + ( isPlaying ? 'playing' : 'paused' );
			
			stopPropagation( e );
		}
		
		function draw()
		{
			buffered.style.width = me.audio.buffered() + '%';
			played.style.width = me.audio.played() + '%';
		}
		
		function seek( e )
		{
			e = window.event || e;
			
			if( e.layerX === undefined ) {
				e.layerX = e.clientX - main.getBoundingClientRect().left;
			}
		
			me.audio.seek( e.layerX / main.clientWidth * 100 );
		}
		
		var isPlaying = params.autoplay,
			main = get( params.target ),
			status = document.createElement( 'div' ),
			buffered = document.createElement( 'div' ),
			played = document.createElement( 'div' ),
			controller = document.createElement( 'div' ),
			icon = document.createElement( 'div' );
		
		main.className = 'audijo-player ' + ( isPlaying ? 'playing' : 'paused' );
		status.className = 'status';
		buffered.className = 'buffered';
		played.className = 'played';
		controller.className = 'controller';
		icon.className = 'icon';
		
		status.onclick = seek;
		controller.onclick = control;
		
		main.appendChild( status );
		status.appendChild( buffered );
		status.appendChild( played );
		status.appendChild( controller );
		controller.appendChild( icon );
		
		setInterval( draw, 1000 / ( params.fps || 20 ) );
	}
	
	// Helpers
	
	function get( id )
	{
		return id.constructor === String ? document.getElementById( id ) : id;
	}
	
	function stopPropagation( e )
	{
		if( e.stopPropagation ) {
			e.stopPropagation();
		}
		else {
			e.cancelBubble = true;
		}
	}
	
	return init();
}