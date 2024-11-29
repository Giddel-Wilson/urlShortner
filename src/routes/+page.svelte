<script lang="ts">
    import { onMount } from 'svelte';
    import { Moon, Sun, Copy, Menu, X } from 'lucide-svelte';
    import { toast, ToastViewport } from '$lib/components/ui/toast';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { cn } from '$lib/utils';
    import { fade, fly } from 'svelte/transition';
    import working from '$lib/images/illustration-working.svg';
    import boostM from '$lib/images/bg-boost-mobile.svg';
    import boostD from '$lib/images/bg-boost-desktop.svg';
    import shortenM from '$lib/images/bg-shorten-mobile.svg';
    import shortenD from '$lib/images/bg-shorten-desktop.svg';
  
    let url = '';
    let isLoading = false;
    let error = '';
    let links: { original: string; shortened: string }[] = [];
    let isMenuOpen = false;
    let isDark = false;
  
    onMount(() => {
      const savedLinks = localStorage.getItem('shortened-links');
      if (savedLinks) {
        links = JSON.parse(savedLinks);
      }
      
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDark = true;
        document.documentElement.classList.add('dark');
      }
    });
  
    function toggleTheme() {
      isDark = !isDark;
      document.documentElement.classList.toggle('dark');
    }
  
    $: {
      if (links.length) {
        localStorage.setItem('shortened-links', JSON.stringify(links));
      }
    }
  
    async function shortenUrl() {
      if (!url) {
        error = 'Please enter a URL';
        return;
      }
  
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
  
      try {
        isLoading = true;
        error = '';
        
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
  
        if (!response.ok) {
          throw new Error(`Failed to shorten URL. Status: ${response.status}`);
        }
  
        const shortUrl = await response.text();
  
        links = [{ original: url, shortened: shortUrl }, ...links];
        url = '';
        
        toast.add({
          title: "Success!",
          description: "URL has been shortened successfully.",
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to shorten URL';
        error = errorMessage;
      } finally {
        isLoading = false;
      }
    }
  
    async function copyToClipboard(text: string) {
      await navigator.clipboard.writeText(text);
      toast.add({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
    }
  </script>
  
  <div class={cn('min-h-screen transition-colors duration-300', isDark ? 'dark bg-gray-900' : 'bg-white')}>
    <header class="px-4 py-4 border-b dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-50 transition-all duration-300">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-8">
          <a href="/" class="text-2xl font-bold dark:text-white transition-colors duration-200 hover:text-[#2ECFD0] dark:hover:text-[#2ECFD0]">Shortly</a>
          <nav class="hidden md:flex items-center gap-6">
            <a href="/features" class="text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:text-[#2ECFD0] dark:hover:text-[#2ECFD0]">Features</a>
            <a href="/pricing" class="text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:text-[#2ECFD0] dark:hover:text-[#2ECFD0]">Pricing</a>
            <a href="/resources" class="text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:text-[#2ECFD0] dark:hover:text-[#2ECFD0]">Resources</a>
          </nav>
        </div>
        
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" on:click={toggleTheme}>
            {#if isDark}
              <Sun class="h-5 w-5" />
            {:else}
              <Moon class="h-5 w-5" />
            {/if}
          </Button>
          <div class="hidden md:flex items-center gap-4">
            <Button variant="ghost">Login</Button>
            <Button class="bg-[#2ECFD0] text-white hover:bg-[#24ACAC] rounded-full">Sign Up</Button>
          </div>
          <Button variant="ghost" size="icon" class="md:hidden" on:click={() => isMenuOpen = !isMenuOpen}>
            {#if isMenuOpen}
              <X class="h-5 w-5" />
            {:else}
              <Menu class="h-5 w-5" />
            {/if}
          </Button>
        </div>
      </div>
    </header>
  
    {#if isMenuOpen}
      <div transition:fade={{ duration: 200 }} class="md:hidden fixed inset-0 mt-14 bg-black bg-opacity-50 z-40">
        <nav transition:fly={{ y: -20, duration: 300 }} class="bg-white dark:bg-gray-800 m-4 p-6 rounded-lg">
          <a href="/features" class="block text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:text-[#2ECFD0] dark:hover:text-[#2ECFD0] mb-4">Features</a>
          <a href="/pricing" class="block text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:text-[#2ECFD0] dark:hover:text-[#2ECFD0] mb-4">Pricing</a>
          <a href="/resources" class="block text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:text-[#2ECFD0] dark:hover:text-[#2ECFD0] mb-4">Resources</a>
          <hr class="border-gray-200 dark:border-gray-700" />
          <Button variant="ghost" class="w-full">Login</Button>
          <Button class="w-full">Sign Up</Button>
        </nav>
      </div>
    {/if}
  
    <main class="max-w-6xl mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row items-center gap-12 mt-6 mb-20">
        <div class="flex-1" in:fly={{ x: -50, duration: 500, delay: 200 }}>
          <h1 class="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
            More than just shorter links
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mb-8">
            Build your brand's recognition and get detailed insights on how your links are performing.
          </p>
          <Button size="lg" class="bg-[#2ECFD0] text-white hover:bg-[#24ACAC] rounded-full">Get Started</Button>
        </div>
        <div class="flex-1">
          <img src={working} alt="Person at computer" class="w-full" />
        </div>
      </div>
  
      <div 
        class="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg mb-16 relative"
      >
        <form on:submit|preventDefault={shortenUrl} class="flex flex-col md:flex-row gap-4 md:h-20 items-center relative z-10">
          <div class="flex-1">
            <Input
              type="text"
              placeholder="Shorten a link here..."
              bind:value={url}
              class="{cn('w-full', error && 'border-red-500')} bg-white h-10"
            />
            {#if error}
              <p class="text-red-500 text-sm mt-1">{error}</p>
            {/if}
          </div>
          <Button type="submit" disabled={isLoading} class="bg-[#2ECFD0] text-white hover:bg-[#24ACAC]">
            {isLoading ? 'Shortening...' : 'Shorten It!'}
          </Button>
        </form>
      </div>
  
      {#if links.length > 0}
        <div class="space-y-4 mb-16">
          {#each links as link (link.original)}
            <div
              transition:fly={{ y: 20, duration: 300 }}
              class="bg-white dark:bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-4 transform hover:scale-[1.02] transition-all duration-300"
            >
              <div class="text-gray-600 dark:text-gray-300 break-all flex-1">{link.original}</div>
              <div class="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                <div class="text-[#2ECFD0] break-all">{link.shortened}</div>
                <Button
                  on:click={() => copyToClipboard(link.shortened)}
                  class="w-full md:w-auto bg-[#2ECFD0] text-white hover:bg-[#24ACAC] transition-colors duration-200"
                >
                  <Copy class="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
  
      <section class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4 dark:text-white">
          Advanced Statistics
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-12">
          Track how your links are performing across the web with our advanced statistics dashboard.
        </p>
        
        <div class="grid md:grid-cols-3 gap-8 relative">
          {#each [
            { title: 'Brand Recognition', description: 'Boost your brand recognition with each click. Generic links don\'t mean a thing. Branded links help instil confidence in your content.', delay: 0 },
            { title: 'Detailed Records', description: 'Gain insights into who is clicking your links. Knowing when and where people engage with your content helps inform better decisions.', delay: 200 },
            { title: 'Fully Customizable', description: 'Improve brand awareness and content discoverability through customizable links, supercharging audience engagement.', delay: 400 }
          ] as { title, description, delay }, i}
            <div
              in:fly={{ y: 50, duration: 500, delay }}
              class="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg relative transform hover:translate-y-[-5px] transition-all duration-300"
            >
              <div class="bg-gray-800 dark:bg-gray-700 p-4 rounded-full inline-block -mt-12">
                <svg class="w-6 h-6 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4m-4 8v4m0 0l-4-4m4-4l4-4" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2 dark:text-white">{title}</h3>
              <p class="text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </div>
          {/each}
        </div>
      </section>
  
      <section class="text-center py-16 bg-gray-800 dark:bg-gray-700 rounded-lg"
        >
        <h2 class="text-3xl font-bold text-white mb-8">
          Boost your links today
        </h2>
        <Button size="lg" class="bg-[#2ECFD0] text-white hover:bg-[#24ACAC] rounded-full">Get Started</Button>
      </section>
    </main>
  
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-6xl mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <h2 class="text-2xl font-bold mb-8">Shortly</h2>
            </div>
            
            <div class="flex flex-wrap gap-8">
              <div class="w-1/2 md:w-auto">
                <h3 class="font-bold mb-4">Features</h3>
                <ul class="space-y-2">
                  <li><a href="./" class="text-gray-400 hover:text-white">Link Shortening</a></li>
                  <li><a href="./" class="text-gray-400 hover:text-white">Branded Links</a></li>
                  <li><a href="./" class="text-gray-400 hover:text-white">Analytics</a></li>
                </ul>
              </div>
              
              <div class="w-1/2 md:w-auto">
                <h3 class="font-bold mb-4">Resources</h3>
                <ul class="space-y-2">
                  <li><a href="./" class="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="./" class="text-gray-400 hover:text-white">Developers</a></li>
                  <li><a href="./" class="text-gray-400 hover:text-white">Support</a></li>
                </ul>
              </div>
              
              <div class="w-1/2 md:w-auto">
                <h3 class="font-bold mb-4">Company</h3>
                <ul class="space-y-2">
                  <li><a href="./" class="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="./" class="text-gray-400 hover:text-white">Our Team</a></li>
                  <li><a href="./" class="text-gray-400 hover:text-white">Careers</a></li>
                  <li><a href="./" class="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              
              <div class="w-1/2 md:w-auto">
                <div class="flex gap-4">
                  <a href="./" class="text-gray-400 hover:text-white">
                    <span class="sr-only">Facebook</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
                  </a>
                  <a href="./" class="text-gray-400 hover:text-white">
                    <span class="sr-only">Twitter</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
                  </a>
                  <a href="./" class="text-gray-400 hover:text-white">
                    <span class="sr-only">Pinterest</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
                  </a>
                  <a href="./" class="text-gray-400 hover:text-white">
                    <span class="sr-only">Instagram</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
  
    <ToastViewport />
  </div>

  <style lang="postcss">
    :global(html) {
      font-family: 'Inter', sans-serif;
    }
    :global(.dark) {
      color-scheme: dark;
    }
  </style>