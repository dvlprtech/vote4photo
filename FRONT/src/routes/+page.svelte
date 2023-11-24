<script>
	
	import { page } from "$app/stores";
	import { goto } from '$app/navigation';
	  if ($page.url.pathname === '/') {
		 goto('/dummy');
	  }
  </script>
  
  
  