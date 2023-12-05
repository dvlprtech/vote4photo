<script lang="ts">	
  import '../app.postcss';
  import { page } from "$app/stores";
  import { currentToken, isAuthenticated } from "$lib/store/session-store";
	import { goto } from '$app/navigation';
	if ($isAuthenticated) {
    if ($page.url.pathname === '/') {
      goto('/app/home');
    }		
	} else {
		goto('/signin');
	}
  isAuthenticated.subscribe((value) => {
    if (!value) {
      goto('/signin');
    }
  });

</script>
<slot />