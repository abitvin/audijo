package  
{  
    import flash.display.MovieClip;  
	import flash.events.Event;
    import flash.external.ExternalInterface;  
	import flash.media.*;
	import flash.net.URLRequest;
	import flash.system.Security;
	
    public class Audijo extends MovieClip
	{
		private var channel:SoundChannel;
		private var isPlaying:Boolean = false;
		private var sound:Sound;
		private var position:Number = 0;
	
        public function Audijo()
		{
			ExternalInterface.addCallback( "buffered", buffered );
			ExternalInterface.addCallback( "duration", duration );
			ExternalInterface.addCallback( "pauseAudio", pauseAudio );
			ExternalInterface.addCallback( "playAudio", playAudio );
			ExternalInterface.addCallback( "played", played );
			ExternalInterface.addCallback( "seekAudio", seekAudio );
			ExternalInterface.addCallback( "source", source );
			
			ExternalInterface.call( "Audijo.loaded", root.loaderInfo.parameters.audijoId );
        }
		
		function onSoundComplete( e:Event ):void
		{
			isPlaying = false;
			position = 0;
			
    		if( root.loaderInfo.parameters.loop == "true" ) {
				playAudio();
			}
		}
		
		public function buffered():Number
		{
			if( !sound || sound.bytesTotal == 0 ) {
				return 0;
			}
			
			return sound.bytesLoaded / sound.bytesTotal * duration();
		}
		
		public function duration():Number
		{
			if( !sound || sound.bytesTotal == 0 ) {
				return 0;
			}
			else if( sound.bytesLoaded == sound.bytesTotal ) {
				return sound.length / 1000;
			}
			
			// Approximation
			return sound.bytesTotal / sound.bytesLoaded * sound.length / 1000;
		}
		
		public function pauseAudio():void
		{
			if( !channel || !isPlaying ) {
				return;
			}
			
			position = channel.position;
			channel.stop();
			isPlaying = false;
		}
		
		public function playAudio( audioSrc:String = null ):void
		{
			if( audioSrc ) {
				source( audioSrc );
			}
			
			if( !isPlaying )
			{
				if( channel ) {
					channel.removeEventListener( Event.SOUND_COMPLETE, onSoundComplete );
				}
				
				channel = sound.play( position );
				channel.addEventListener( Event.SOUND_COMPLETE, onSoundComplete );
				
				isPlaying = true;
			}
		}
		
		public function played():Number
		{
			return channel ? ( channel.position / 1000 ) : 0;
		}
		
		public function seekAudio( offset:Number ):void
		{
			offset *= 1000;
			
			if( isPlaying )
			{
				pauseAudio();
				position = offset;
				playAudio();
			}
			else
			{
				position = offset;
			}
		}
		
		public function source( audioSrc:String ):void
		{
			stopAudio();
			
			sound = new Sound();
			sound.load( new URLRequest( audioSrc ) );
		}
		
		public function stopAudio():void
		{
			pauseAudio();
			position = 0;
		}
    }  
}  