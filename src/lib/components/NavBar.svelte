<script lang="ts">
  import { page, session } from "$app/stores"

  const menuItems = [
    { href: "/", label: "Accueil" },
    { href: "/about", label: "À propos" },
    { href: "/calculations", label: "Calculs" },
    { href: "/entities", label: "Entités" },
    { href: "/parameters", label: "Paramètres" },
    { href: "/storybook", label: "Storybook" },
    { href: "/variables", label: "Variables" },
  ]
  let open = false
  let openUserMenu = false

  $: pageUrlPath = $page.path.replace(/\/+$/, "") || "/"

  $: title = $session.title

  function activeMenuItem(href: string) {
    return pageUrlPath === href || pageUrlPath.startsWith(href + "/")
  }
</script>

<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div class="relative flex items-center justify-between h-16">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <!-- Mobile menu button-->
        <button
          aria-controls="mobile-menu"
          aria-expanded={open}
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          on:click={() => (open = !open)}
          type="button"
        >
          <span class="sr-only">Open main menu</span>
          {#if open}
            <!-- Heroicon name: outline/x -->
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          {:else}
            <!-- Heroicon name: outline/menu -->
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          {/if}
        </button>
      </div>
      <div
        class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
      >
        <div class="flex-shrink-0 flex items-center">
          <img
            alt={title}
            class="block lg:hidden h-8 w-auto"
            src="/logo_100x100.png"
          />
          <img
            alt={title}
            class="hidden lg:block h-8 w-auto"
            src="/logo_100x100.png"
          />
        </div>
        <div class="hidden sm:block sm:ml-6">
          <div class="flex space-x-4">
            {#each menuItems as { label, href }}
              <a
                aria-current="page"
                class="{activeMenuItem(href)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium"
                {href}>{label}</a
              >
            {/each}
          </div>
        </div>
      </div>
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
      >
        <button
          class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <span class="sr-only">View notifications</span>
          <!-- Heroicon name: outline/bell -->
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        <!-- Profile dropdown -->
        <div class="ml-3 relative">
          <div>
            <button
              aria-expanded={openUserMenu}
              aria-haspopup="true"
              class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              id="user-menu"
              on:click={() => (openUserMenu = !openUserMenu)}
              type="button"
            >
              <span class="sr-only">Open user menu</span>
              <img
                class="h-8 w-8 rounded-full"
                src="/logo_100x100.png"
                alt=""
              />
            </button>
          </div>
          {#if openUserMenu}
            <!--
              Dropdown menu

              Entering: "transition ease-out duration-100"
                From: "transform opacity-0 scale-95"
                To: "transform opacity-100 scale-100"
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            -->
            <div
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <a
                href="profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem">Your Profile</a
              >
              <a
                href="settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem">Settings</a
              >
              <a
                href="sign_out"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem">Sign out</a
              >
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  {#if open}
    <div class="sm:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1">
        {#each menuItems as { label, href }}
          <a
            aria-current="page"
            class="{activeMenuItem(href)
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium"
            {href}>{label}</a
          >
        {/each}
      </div>
    </div>
  {/if}
</nav>
