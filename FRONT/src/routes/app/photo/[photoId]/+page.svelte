<script lang="ts">	
  	
	import { page } from "$app/stores";
	import { goto } from '$app/navigation';
	$: photoId = parseInt($page.url.pathname.split('/').pop()!);
</script>

<h1>PHOTO: {photoId}</h1>


